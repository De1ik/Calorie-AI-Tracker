export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatServiceConfig {
  apiKey?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}
