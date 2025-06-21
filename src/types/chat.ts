// src/types/chat.ts
export interface ActionCard {
  title: string;
  patient: string;
  insight: string;
  reasoning: string;
  confidence?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant'; // Renamed from sender
  text: string; // Will store plain text or a summary if actionCards are present
  timestamp: Date;
  actionCards?: ActionCard[];
}
