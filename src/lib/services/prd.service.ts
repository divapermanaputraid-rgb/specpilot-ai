import { aiRouter } from "../ai/provider-router";
import { AiMessage } from "../ai/types";
import { loadPrdGenerationPrompt } from "../prompts/prompt-loader";
import { validateVisualPrd, formatVisualPrd } from "../markdown/validate-visual-prd";

export class PrdService {
  /**
   * Generates a PRD based on interview history
   */
  async generatePrd(
    interviewHistory: AiMessage[],
    projectId: string,
    retryFeedback?: string[]
  ): Promise<{ 
    content: string; 
    isValid: boolean; 
    validationErrors: string[];
    metadata?: {
      provider: string;
      model: string;
      tokensUsed?: number;
    };
  }> {
    try {
      // 1. Load comprehensive system prompt
      const systemPrompt = await loadPrdGenerationPrompt();

      // 2. Prepare messages for AI
      // In a real app, we might summarize the interview history first to save tokens
      const formattedHistory = interviewHistory
        .map(m => `${m.role === 'user' ? 'User' : 'System'}: ${m.content}`)
        .join('\n\n');

      let userPrompt = `Please generate a PRD based on the following interview history:\n\n${formattedHistory}`;

      if (retryFeedback && retryFeedback.length > 0) {
        userPrompt += `\n\n---
IMPORTANT: The previous PRD failed validation. 
Regenerate the full PRD from scratch. Do not summarize.

Missing requirements that MUST be included:
${retryFeedback.map(item => `- ${item}`).join('\n')}

Additional instructions:
- Must reach minimum length (12,000+ characters).
- Must use valid Markdown tables with no blank lines between table rows.
- Must include Mermaid flowchart, erDiagram, and gantt.
- Must include AI Coding Agent Prompt of at least 500 characters.`;
      }

      const messages: AiMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      // 3. Call AI Provider
      const response = await aiRouter.generate({
        task: 'prdGeneration',
        messages
      });

      // 4. Format and validate the generated PRD
      const formattedPrd = formatVisualPrd(response.content);
      const validation = validateVisualPrd(formattedPrd);

      if (!validation.valid) {
        console.warn(`PRD generation produced validation errors: ${validation.missing.join(', ')}`);
        // We could implement a self-correction loop here
      }

      return {
        content: formattedPrd,
        isValid: validation.valid,
        validationErrors: validation.missing,
        metadata: {
          provider: response.providerUsed,
          model: response.modelUsed,
          tokensUsed: response.tokensUsed
        }
      };
      
    } catch (error) {
      console.error('Error generating PRD:', error);
      throw new Error('Failed to generate PRD');
    }
  }
}

export const prdService = new PrdService();