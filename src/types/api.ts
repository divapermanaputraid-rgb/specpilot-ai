export interface CreateProjectRequest {
  session_id: string;
  raw_idea: string;
}

export interface CreateProjectResponse {
  success: boolean;
  project_id?: string;
  error?: string;
}

export interface InterviewQuestionRequest {
  session_id: string;
  conversation_history: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface InterviewQuestionResponse {
  success: boolean;
  question?: string;
  is_complete?: boolean;
  error?: string;
}

export interface InterviewAnswerRequest {
  session_id: string;
  question: string;
  answer: string;
}

export interface InterviewAnswerResponse {
  success: boolean;
  error?: string;
}

export interface GeneratePrdRequest {
  session_id: string;
}

export interface GeneratePrdResponse {
  success: boolean;
  content?: string;
  error?: string;
}