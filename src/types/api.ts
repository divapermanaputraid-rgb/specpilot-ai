export type OutputLanguage = "id" | "en";

export interface CreateProjectRequest {
  sessionId: string;
  rawIdea: string;
  outputLanguage?: OutputLanguage;
}

export interface CreateProjectResponse {
  success: boolean;
  projectId?: string;
  error?: string;
  details?: any;
}

export interface InterviewQuestionRequest {
  sessionId: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface InterviewQuestionResponse {
  success: boolean;
  question?: string;
  isComplete?: boolean;
  error?: string;
  details?: any;
}

export interface InterviewAnswerRequest {
  sessionId: string;
  projectId: string;
  sequenceNumber: number;
  stage: string;
  question: string;
  aiReason?: string;
  selectedOption: string;
  answerValue: string;
  completenessScore: number;
}

export interface InterviewAnswerResponse {
  success: boolean;
  error?: string;
  details?: any;
}

export interface GeneratePrdRequest {
  sessionId: string;
  projectId?: string;
}

export interface PrdQuality {
  valid: boolean;
  missing: string[];
  score: number;
}

export interface GeneratePrdResponse {
  success: boolean;
  prdId?: string;
  markdownContent?: string;
  providerUsed?: string;
  modelUsed?: string;
  quality?: PrdQuality;
  error?: string;
  details?: any;
}
