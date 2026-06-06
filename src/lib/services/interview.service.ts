import { aiRouter } from "../ai/provider-router";
import { parseInterviewResponse } from "../ai/parser";
import { AiMessage, AiInterviewResponse } from "../ai/types";
import { loadPrompt, interpolatePrompt } from "../prompts/prompt-loader";
import { prisma } from "../db/prisma";

export class InterviewService {
  /**
   * Processes a user session and generates the next interview question
   */
  async generateNextQuestion(
    sessionId: string,
    providedHistory?: { role: "user" | "assistant"; content: string }[]
  ): Promise<AiInterviewResponse> {
    try {
      // Fetch project details and previous answers
      const project = await prisma.project.findUnique({
        where: { sessionId },
        include: { 
          interviewAnswers: {
            orderBy: { sequenceNumber: 'asc' }
          } 
        }
      });

      if (!project) {
        throw new Error('Project not found for session');
      }

      // 1. Construct History
      let history: AiMessage[] = providedHistory as AiMessage[] || [];
      
      if (!providedHistory || providedHistory.length === 0) {
        history = [{ role: 'user', content: project.rawIdea }];
        
        for (const answer of project.interviewAnswers) {
          history.push({ role: 'assistant', content: answer.question });
          history.push({ role: 'user', content: answer.answer });
        }
      }

      // 2. Load system prompt
      const systemPromptTemplate = await loadPrompt('interview-system-prompt.md');
      
      const questionCount = project.interviewAnswers.length;
      const currentCompletenessScore = Math.min(100, questionCount * 10); 
      
      const previousAnswersJson = JSON.stringify(
        project.interviewAnswers.map(a => ({
          question: a.question,
          answer: a.answer
        })),
        null,
        2
      );

      const systemPrompt = interpolatePrompt(systemPromptTemplate, {
         RAW_IDEA: project.rawIdea,
         PREVIOUS_ANSWERS_JSON: previousAnswersJson,
         QUESTION_COUNT: questionCount.toString(),
         CURRENT_COMPLETENESS_SCORE: currentCompletenessScore.toString()
      });

      // 3. Prepare messages for AI
      const messages: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        ...history
      ];

      // 4. Call AI Provider
      const response = await aiRouter.generate({
        task: 'interview',
        messages
      });

      // 5. Parse and validate response
      const parsedResponse = await parseInterviewResponse(response.content, history);
      
      return {
        ...parsedResponse,
        metadata: {
          provider: response.providerUsed,
          model: response.modelUsed,
          tokensUsed: response.tokensUsed
        }
      };
    } catch (error) {
      console.error('Error generating next question:', error);
      throw new Error('Failed to generate interview question');
    }
  }
}

export const interviewService = new InterviewService();