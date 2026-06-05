export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiInterviewResponse {
  question: string;
  reason?: string;
  options?: string[];
  isComplete: boolean;
  completenessScore: number;
}

export interface AiProvider {
  generateInterviewQuestion(
    history: AiMessage[],
    systemPrompt: string
  ): Promise<AiInterviewResponse>;
  
  generatePrd(
    history: AiMessage[],
    systemPrompt: string
  ): Promise<string>;
}