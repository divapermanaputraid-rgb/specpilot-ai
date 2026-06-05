import { aiRouter } from "../ai/provider-router";
import { AiMessage } from "../ai/types";
import { loadPrompt, interpolatePrompt } from "../prompts/prompt-loader";
import { validateVisualPrd, formatVisualPrd } from "../markdown/validate-visual-prd";

export class PrdService {
  /**
   * Generates a PRD based on interview history
   */
  async generatePrd(
    interviewHistory: AiMessage[],
    projectId: string
  ): Promise<{ content: string; isValid: boolean; validationErrors: string[] }> {
    try {
      // 1. Load system prompt
      const systemPromptTemplate = await loadPrompt('prd-generation-prompt.md');
      
      const systemPrompt = interpolatePrompt(systemPromptTemplate, {});

      // 2. Prepare messages for AI
      // In a real app, we might summarize the interview history first to save tokens
      const formattedHistory = interviewHistory
        .map(m => `${m.role === 'user' ? 'User' : 'System'}: ${m.content}`)
        .join('\n\n');

      const messages: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please generate a PRD based on the following interview history:\n\n${formattedHistory}` }
      ];

      // 3. Call AI Provider
      const response = await aiRouter.generate({
        task: 'prdGeneration',
        messages
      });

      // 4. Format and validate the generated PRD
      const formattedPrd = formatVisualPrd(response.content);
      const validation = validateVisualPrd(formattedPrd);

      if (!validation.isValid) {
        console.warn(`PRD generation produced validation errors: ${validation.errors.join(', ')}`);
        // We could implement a self-correction loop here
      }

      return {
        content: formattedPrd,
        isValid: validation.isValid,
        validationErrors: validation.errors
      };
      
    } catch (error) {
      console.error('Error generating PRD:', error);
      throw new Error('Failed to generate PRD');
    }
  }
}

export const prdService = new PrdService();