export type ApiError = {
  code: string;
  message: string;
  retryable: boolean;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: ApiError;
    };

export type InterviewOption = {
  label: string;
  value: string;
};

export type InterviewQuestionResponse = {
  status: "asking" | "ready_to_generate";
  current_stage: string;
  question: string;
  reason: string;
  options: [InterviewOption, InterviewOption, InterviewOption, InterviewOption];
  allow_custom: true;
  completeness_score: number;
};

export type Project = {
  id: string;
  session_id: string;
  raw_idea: string;
  status: "interviewing" | "ready_to_generate" | "generating" | "completed" | "error";
  current_completeness_score: number;
  question_count: number;
  created_at?: string;
  updated_at?: string;
};

export type InterviewAnswer = {
  id: string;
  project_id: string;
  session_id: string;
  sequence_number: number;
  stage: string;
  question: string;
  ai_reason?: string;
  selected_option: "option_a" | "option_b" | "option_c" | "custom";
  answer_value: string;
  completeness_score: number;
  created_at?: string;
};

export type GeneratedPRD = {
  id: string;
  project_id: string;
  session_id: string;
  markdown_content: string;
  provider_used?: string;
  model_used?: string;
  tokens_used?: number;
  created_at?: string;
};
