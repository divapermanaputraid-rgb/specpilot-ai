import { aiRouter } from "../ai/provider-router";
import { parseInterviewResponse } from "../ai/parser";
import { AiMessage, AiInterviewResponse } from "../ai/types";
import { loadPrompt, interpolatePrompt } from "../prompts/prompt-loader";

export class InterviewService {
  /**
   * Processes a user message and generates the next interview question
   */
  async generateNextQuestion(
    history: AiMessage[],
    projectId: string
  ): Promise<AiInterviewResponse> {
    try {
      // 1. Load system prompt
      const systemPromptTemplate = await loadPrompt('interview-system-prompt.md');
      
      // We could fetch project details here to interpolate into the prompt
      // const project = await db.project.findUnique({ where: { id: projectId } });
      const systemPrompt = interpolatePrompt(systemPromptTemplate, {
         // projectIdea: project?.idea || "Unknown",
      });

      // 2. Prepare messages for AI
      const messages: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history
      ];

      // 3. Call AI Provider
      const response = await aiRouter.generate({
        task: 'interview',
        messages
      });

      // 4. Parse and validate response
      return await parseInterviewResponse(response.content, history);
      
    } catch (error) {
      console.error('Error generating next question:', error);
      throw new Error('Failed to generate interview question');
    }
  }
}

export const interviewService = new InterviewService();