export interface CreateProjectRequest {
  sessionId: string;
  rawIdea: string;
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

export interface GeneratePrdResponse {
  success: boolean;
  prd?: string;
  error?: string;
  details?: any;
}
