import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define types for Action Cards
interface ActionCard {
  title: string;
  patient: string;
  insight: string;
  reasoning: string;
  confidence?: number; // Optional
}

interface LLMActionCardsResponse {
  // Renamed to avoid conflict with NextResponse
  actionCards: ActionCard[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        {
          error:
            'Invalid request: message is required and must be a non-empty string.',
        },
        { status: 400 }
      );
    }

    const baseUrl = request.nextUrl.origin;
    const dischargesResponse = await fetch(`${baseUrl}/api/discharges`);

    if (!dischargesResponse.ok) {
      console.error(
        `Failed to fetch discharge data: ${dischargesResponse.status} ${dischargesResponse.statusText}`
      );
      const errorBody = await dischargesResponse.text();
      console.error(`Error body from /api/discharges: ${errorBody}`);
      throw new Error(
        `Failed to fetch discharge data. Status: ${dischargesResponse.status}`
      );
    }

    const dischargeData = await dischargesResponse.json();
    const dischargeDataString = JSON.stringify(dischargeData, null, 2);

    const systemPrompt = `You are an expert healthcare assistant. Your role is to analyze patient discharge summaries in conjunction with a user's query and generate actionable insights.
You MUST respond with a valid JSON object adhering to the following structure:
{
  "actionCards": [
    {
      "title": "string - A concise title for the action or alert (e.g., 'High Readmission Risk', 'Medication Discrepancy Alert', 'Urgent Follow-up Required').",
      "patient": "string - The full name of the patient relevant to this card.",
      "insight": "string - A clear, actionable insight or recommendation for the care team.",
      "reasoning": "string - A brief explanation of the clinical reasoning or data points from the summaries that led to this insight.",
      "confidence": "number - (Optional) A score between 0.0 and 1.0 indicating your confidence in this insight. Omit if not applicable or unsure."
    }
    // You can include multiple cards in the array if relevant.
  ]
}

Guidelines for generating action cards:
- Base ALL information strictly on the provided discharge summaries and the user's query. Do NOT make up information or infer beyond the provided text.
- Identify patients and insights directly relevant to the user's question.
- If the user's question is general (e.g., "any concerns?"), identify the most critical issues across all patients.
- If no relevant insights or action items are found for the given query, or if the query cannot be answered from the summaries, return an empty "actionCards" array: {"actionCards": []}.
- Ensure patient names are extracted accurately as provided in the summaries.
- Titles should be informative and concise.
- Insights should be specific and actionable.
- Reasoning should clearly link back to data in the summaries.`;

    const userPrompt = `Discharge Summaries:
---
${dischargeDataString}
---
User's Question: "${message}"

Based on the provided discharge summaries and the user's question, generate a JSON response containing relevant action cards according to the specified system prompt format.`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview', // Prefer a model good with JSON
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, // Lower for more deterministic JSON
      max_tokens: 1500, // Increased for potentially multiple cards
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      console.error('LLM returned empty response content.');
      return NextResponse.json({
        actionCards: [
          {
            title: 'Processing Error',
            patient: 'System',
            insight: 'The AI returned an empty response. Please try again.',
            reasoning: 'No content received from the language model.',
          },
        ],
      });
    }

    let parsedLLMResponse: LLMActionCardsResponse;
    try {
      parsedLLMResponse = JSON.parse(responseText);

      if (
        !parsedLLMResponse.actionCards ||
        !Array.isArray(parsedLLMResponse.actionCards)
      ) {
        console.error(
          'Invalid LLM response structure: "actionCards" array is missing or not an array. Raw:',
          responseText
        );
        throw new Error('Invalid response structure from AI.');
      }

      // Optional: Further validation of each card's fields
      parsedLLMResponse.actionCards.forEach((card, index) => {
        if (
          typeof card.title !== 'string' ||
          typeof card.patient !== 'string' ||
          typeof card.insight !== 'string' ||
          typeof card.reasoning !== 'string'
        ) {
          console.error(
            `Invalid card at index ${index}: Missing or invalid required fields. Card:`,
            card,
            'Raw response:',
            responseText
          );
          throw new Error(`Invalid action card structure at index ${index}.`);
        }
        if (
          card.confidence !== undefined &&
          (typeof card.confidence !== 'number' ||
            card.confidence < 0 ||
            card.confidence > 1)
        ) {
          console.error(
            `Invalid confidence score at index ${index}. Card:`,
            card,
            'Raw response:',
            responseText
          );
          throw new Error(
            `Invalid confidence score at index ${index}. Must be a number between 0 and 1.`
          );
        }
      });
    } catch (parseError) {
      console.error(
        'Failed to parse or validate LLM JSON response:',
        parseError instanceof Error ? parseError.message : 'Unknown error',
        'Raw LLM response:',
        responseText
      );
      return NextResponse.json({
        actionCards: [
          {
            title: 'AI Response Error',
            patient: 'System',
            insight:
              'The AI response was not in the expected format. Please try rephrasing your question or try again later.',
            reasoning: `Details: ${
              parseError instanceof Error ? parseError.message : 'Unknown error'
            }`,
          },
        ],
      });
    }

    return NextResponse.json(parsedLLMResponse); // Return the full object { actionCards: [...] }
  } catch (error) {
    console.error('Error in /api/chat POST handler:', error);
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: `OpenAI API error: ${error.message}`,
          type: error.type,
          code: error.code,
        },
        { status: error.status || 500 }
      );
    } else if (
      error instanceof Error &&
      error.message.startsWith('Failed to fetch discharge data')
    ) {
      return NextResponse.json(
        {
          error:
            'Internal server error: Could not retrieve necessary patient data to inform the AI.',
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error:
          'An unexpected error occurred while processing your chat request.',
      },
      { status: 500 }
    );
  }
}
