export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiInterviewOption {
  label: string;
  value: string;
}

export interface AiInterviewResponse {
  status: 'asking' | 'ready_to_generate';
  currentStage: string;
  question: string;
  reason?: string;
  options: AiInterviewOption[];
  allowCustom: boolean;
  completenessScore: number;
  metadata?: {
    provider: string;
    model: string;
    tokensUsed?: number;
  };
}

export type AiTask = "interview" | "prdGeneration" | "jsonRepair";

export interface AiProviderConfig {
  task: AiTask;
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AiProviderResponse {
  content: string;
  providerUsed: string;
  modelUsed: string;
  tokensUsed?: number;
}

export interface AiProvider {
  name: string;
  isAvailable(): boolean;
  generate(config: AiProviderConfig): Promise<AiProviderResponse>;
}