export interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface InterviewOption {
  label: string;
  value: string;
}

export interface InterviewQuestionData {
  question: string;
  reason?: string;
  options: InterviewOption[];
  currentStage: string;
  completenessScore: number;
  status: 'interviewing' | 'ready_to_generate';
  allowCustom?: boolean;
}

export interface AiInterviewResponse {
  success: boolean;
  data: InterviewQuestionData;
}

export interface SessionData {
  id: string;
  history: InterviewMessage[];
  currentQuestion: InterviewQuestionData | null;
  prd: string;
}

const API_BASE = '/api';

export async function fetchQuestion(sessionId: string, history: InterviewMessage[]): Promise<InterviewQuestionData> {
  const res = await fetch(`${API_BASE}/interview/question`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, conversationHistory: history }),
  });
  
  const data = await res.json();
  
  if (!res.ok || !data.success) {
    let errorMessage = 'Failed to fetch question';
    if (data.error) {
      if (typeof data.error === 'object' && data.error.message) {
        errorMessage = `${data.error.message}${data.error.code ? ` (${data.error.code})` : ''}`;
        if (data.error.debug) {
          errorMessage += `\nDebug: ${data.error.debug}`;
        }
      } else {
        errorMessage = data.error;
      }
    }
    throw new Error(errorMessage);
  }
  
  return data.data;
}

export async function submitAnswer(params: {
  sessionId: string;
  projectId: string;
  sequenceNumber: number;
  stage: string;
  question: string;
  aiReason?: string;
  selectedOption: string;
  answerValue: string;
  completenessScore: number;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/interview/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to submit answer');
}

export async function fetchPrd(sessionId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/prd/${sessionId}`);
  const data = await res.json();
  if (!data.success) return '';
  return data.prd;
}

export async function generatePrd(sessionId: string): Promise<string> {
  const res = await fetch(`${API_BASE}/prd/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to generate PRD');
  return data.prd;
}

export const apiClient = {
  async createProject(params: { sessionId: string; rawIdea: string }) {
    const res = await fetch(`${API_BASE}/project/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create project');
    return data;
  },
  async getInterviewQuestion(params: { sessionId: string; conversationHistory: any[] }): Promise<InterviewQuestionData> {
    return fetchQuestion(params.sessionId, params.conversationHistory);
  },
  async submitInterviewAnswer(params: any): Promise<void> {
    return submitAnswer(params);
  },
  async getPrd(sessionId: string): Promise<string> {
    return fetchPrd(sessionId);
  },
  fetchQuestion,
  submitAnswer,
  fetchPrd,
  async generatePrd(params: { sessionId: string }): Promise<string> {
    const res = await fetch(`${API_BASE}/prd/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: params.sessionId }),
    });
    const data = await res.json();
    
    if (!data.success) {
      if (typeof data.error === 'object' && data.error.code === 'PRD_QUALITY_VALIDATION_FAILED') {
        const err = new Error(data.error.message || 'PRD failed quality validation');
        (err as any).code = data.error.code;
        (err as any).missing = data.error.missing;
        throw err;
      }
      throw new Error(data.error || 'Failed to generate PRD');
    }
    return data.prd;
  },
};
