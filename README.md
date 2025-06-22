# LLM-Powered Care Transition Assistant

## Objective

This project implements a healthcare dashboard that assists providers in managing patient care transitions. The application leverages Large Language Models (LLMs) to analyze discharge summaries and generate actionable insights through an intelligent chat interface. Healthcare providers can interact with the system to receive structured action cards containing specific tasks, priorities, and relevant patient information to ensure smooth care transitions.

## Features

- **Next.js 15+ with App Router**: Modern React framework with server-side rendering capabilities.
- **Responsive UI with Tailwind CSS**: Mobile-first design approach for accessibility across devices.
- **Component Library Integration**: Radix UI primitives with Shadcn components for consistent UI.
- **RESTful API Endpoints**:
  - `GET /api/discharges`: Serves combined patient discharge data from `pt-1.json`, `pt-2.json`, and `pt-3.json`.
  - `POST /api/chat`: LLM-powered endpoint that processes user messages against discharge data and generates structured "Action Cards".
- **Intelligent Chat Interface**: Allows natural language interaction for querying patient data and receiving insights.
- **Structured Action Cards**: LLM-generated cards display key information: Title, Patient, Insight, Reasoning, and Confidence.
- **Persistent Chat History**: Utilizes localStorage for saving and restoring chat conversations across browser sessions.
- **Loading States**: UI indicates when the assistant is processing a request.
- **Error Handling**: Manages errors gracefully on both client and server sides.

## Tech Stack

- **Framework**: Next.js (v15+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4+)
- **UI Components**: Radix UI (v3+), Shadcn/ui (v2.7+)
- **AI Integration**: OpenAI API (Configurable model, e.g., GPT-4 Turbo, GPT-3.5 Turbo)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **Development Tools**: ESLint, Prettier (assumed via Next.js defaults)

## Project Structure Overview

```
care-transition-dashboard/
├── public/
│   └── data/                  # Static patient discharge JSON files (pt-1.json, pt-2.json, pt-3.json)
├── src/
│   ├── app/                   # Next.js App Router: pages and API routes
│   │   ├── api/               # API route handlers
│   │   │   ├── chat/          # Handles chat requests and LLM interaction
│   │   │   └── discharges/    # Serves patient discharge data
│   │   ├── globals.css        # Global styles, Tailwind directives
│   │   ├── layout.tsx         # Root application layout
│   │   └── page.tsx           # Main page, hosts the chat interface
│   ├── components/            # Reusable React components
│   │   ├── cards/             # Components for displaying Action Cards
│   │   ├── chat/              # Components for the chat interface (ChatInterface, MessageList, etc.)
│   │   └── ui/                # Shadcn UI components (Button, Card, Input, etc.)
│   ├── lib/                   # Utility functions (e.g., cn from Shadcn)
│   └── types/                 # TypeScript type definitions (Message, ActionCard)
├── .env.example               # Example environment variables file
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v18.x or later recommended)
- npm (v9.x or later) or yarn

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd care-transition-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    Or if using yarn:
    ```bash
    yarn install
    ```

3.  **Configure environment variables:**
    -   Copy the `.env.example` file to a new file named `.env` (or `.env.local`):
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and add your OpenAI API key:
        ```
        OPENAI_API_KEY="your_openai_api_key_here"
        ```
    -   You can also optionally specify the OpenAI model to use (defaults to `gpt-4-turbo-preview` in the API route if not set):
        ```
        OPENAI_MODEL="gpt-3.5-turbo"
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Or if using yarn:
    ```bash
    yarn dev
    ```
    The application will be available at `http://localhost:3000`.

## API Endpoints

### `GET /api/discharges`
-   **Description**: Serves the combined patient discharge summaries. It reads `pt-1.json`, `pt-2.json`, and `pt-3.json` from the `public/data` directory, combines them into an array, and returns the array.
-   **Response**: An array of patient objects.

### `POST /api/chat`
-   **Description**: Processes a user's chat message. It fetches discharge data, prepares a prompt for the LLM (including the discharge data and user message), calls the OpenAI API (configured for JSON output), and returns the LLM's response, typically as structured "Action Cards".
-   **Request Body**:
    ```json
    {
      "message": "User's question about the patients or discharge summaries"
    }
    ```
-   **Success Response (Action Cards)**:
    ```json
    {
      "actionCards": [
        {
          "title": "Example Title",
          "patient": "Patient Name",
          "insight": "Key insight or recommendation.",
          "reasoning": "Reasoning based on discharge data.",
          "confidence": 0.85 // Optional
        }
        // ... more cards if applicable
      ]
    }
    ```
-   **Success Response (No Action Cards Found)**:
     ```json
    {
      "actionCards": [] // Or could be a text message if the API is adapted
    }
    ```
-   **Error Response / Fallback Text Response**:
    If the LLM provides a text response instead of cards (e.g., for a direct question not resulting in an action), or if an error occurs that's caught and formatted as a text response by the API:
    ```json
    {
      "response": "Textual response from the AI or an error message."
    }
    ```
    If the API itself encounters an error (e.g., OpenAI API error, internal server error):
    ```json
    {
      "error": "Description of the error."
      // ... other error details like type, code, status
    }
    ```


## Prompt Design Explanation

The `/api/chat/route.ts` employs a specific prompt engineering strategy to elicit structured JSON (Action Cards) from the LLM:
-   **System Prompt**: Instructs the LLM to act as an expert healthcare assistant. It explicitly defines the required JSON output structure, including the `actionCards` array and the fields within each card (`title`, `patient`, `insight`, `reasoning`, `confidence`). It also guides the LLM on how to derive these fields from the provided discharge summaries and user query, and to return an empty `actionCards` array if no relevant actions are identified.
-   **User Prompt**: Combines the full set of discharge summaries (as a JSON string) with the user's specific question, asking the LLM to generate the action cards in the format defined by the system prompt.
-   **JSON Mode**: The OpenAI API call is configured with `response_format: { type: "json_object" }` (for compatible models like `gpt-4-turbo-preview` or newer `gpt-3.5-turbo` versions) to enforce JSON output.
-   **Validation**: The API route includes parsing and basic validation of the LLM's JSON response to ensure it conforms to the expected structure. Fallback error cards are generated if validation fails.

## Challenges and Trade-offs

-   **LLM JSON Reliability**: While JSON mode significantly improves reliability, LLMs can still occasionally produce slightly malformed JSON or deviate from complex schemas. The backend includes validation and error handling for such cases, attempting to provide a graceful fallback.
-   **Prompt Engineering Iteration**: Crafting effective prompts for consistent structured output is an iterative process. The current prompts are a good starting point but might need further refinement based on more diverse queries and data.
-   **Token Limits**: Providing extensive discharge summaries in the prompt can consume a large number of tokens, potentially hitting model limits or increasing costs. For production, strategies like data summarization, embedding-based retrieval of relevant context, or using models with larger context windows would be necessary.
-   **Error Handling**: The application implements client-side and server-side error handling. Server-side logs provide details for debugging, while the client displays user-friendly messages.
-   **localStorage Limitations**: Chat history persistence via localStorage is convenient for single-user, single-browser sessions but has size limitations (typically 5-10MB) and is not suitable for sensitive data in a production healthcare environment without encryption and proper access controls. It also doesn't sync across devices.
