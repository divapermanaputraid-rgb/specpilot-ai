/**
 * API Client for SpecPilot AI
 */

export interface CreateProjectInput {
  sessionId: string;
  rawIdea: string;
}

export interface CreateProjectResponse {
  success: boolean;
  projectId: string;
  rawIdea: string;
}

export interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GetInterviewQuestionInput {
  sessionId: string;
  conversationHistory?: InterviewMessage[];
}

export interface InterviewOption {
  label: string;
  value: string;
}

export interface InterviewQuestionData {
  status: 'asking' | 'ready_to_generate';
  currentStage: string;
  question: string;
  reason: string;
  options: InterviewOption[];
  allowCustom: boolean;
  completenessScore: number;
}

export interface GetInterviewQuestionResponse {
  success: boolean;
  data: InterviewQuestionData;
  providerUsed?: string;
  modelUsed?: string;
}

export interface SubmitInterviewAnswerInput {
  sessionId: string;
  projectId: string;
  sequenceNumber: number;
  stage: string;
  question: string;
  aiReason: string;
  selectedOption: string;
  answerValue: string;
  completenessScore: number;
}

export interface SubmitInterviewAnswerResponse {
  success: boolean;
  completenessScore: number;
  nextStep: string;
}

export interface GeneratePrdInput {
  sessionId: string;
  projectId?: string;
}

export interface GeneratePrdResponse {
  success: boolean;
  projectId: string;
  prd: string;
}

export interface GetPrdResponse {
  success: boolean;
  prd: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return response.json();
  }

  async createProject(input: CreateProjectInput): Promise<CreateProjectResponse> {
    return this.request<CreateProjectResponse>('/api/project/create', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getInterviewQuestion(input: GetInterviewQuestionInput): Promise<GetInterviewQuestionResponse> {
    return this.request<GetInterviewQuestionResponse>('/api/interview/question', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async submitInterviewAnswer(input: SubmitInterviewAnswerInput): Promise<SubmitInterviewAnswerResponse> {
    return this.request<SubmitInterviewAnswerResponse>('/api/interview/answer', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async generatePrd(input: GeneratePrdInput): Promise<GeneratePrdResponse> {
    return this.request<GeneratePrdResponse>('/api/prd/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getPrd(sessionId: string): Promise<GetPrdResponse> {
    return this.request<GetPrdResponse>(`/api/prd/${sessionId}`, {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
