import { aiRouter } from "../ai/provider-router";
import { AiMessage } from "../ai/types";
import { loadPrdGenerationPrompt } from "../prompts/prompt-loader";
import { validateVisualPrd, formatVisualPrd } from "../markdown/validate-visual-prd";

type OutputLanguage = "id" | "en";

export class PrdService {
  /**
   * Generates a PRD based on interview history
   */
  async generatePrd(
    interviewHistory: AiMessage[],
    projectId: string,
    outputLanguage: OutputLanguage = "id",
    retryFeedback?: string[]
  ): Promise<{ 
    content: string; 
    isValid: boolean; 
    validationErrors: string[];
    score: number;
    metadata?: {
      provider: string;
      model: string;
      tokensUsed?: number;
    };
  }> {
    try {
      // 1. Load comprehensive system prompt
      const outputLanguageLabel = outputLanguage === "id" ? "Bahasa Indonesia" : "English";
      const languageInstructions = outputLanguage === "id"
        ? `Output language: Bahasa Indonesia

Language rules:
- Generate the full PRD in Bahasa Indonesia.
- Keep technical terms readable and natural.
- Markdown headings may be in Bahasa Indonesia.
- Tables should use Bahasa Indonesia labels.
- Mermaid diagram node labels should preferably use Bahasa Indonesia, but keep Mermaid syntax valid.
- Code/API examples can remain technical English where appropriate.
- AI Coding Agent Prompt should be in Bahasa Indonesia with technical terms preserved.`
        : `Output language: English

Language rules:
- Generate the full PRD in English.
- Use clear, professional product requirement writing.
- Keep Markdown, Mermaid, code/API examples, and technical terms valid.`;

      const systemPrompt = `${await loadPrdGenerationPrompt()}

${languageInstructions}`;

      // 2. Prepare messages for AI
      // In a real app, we might summarize the interview history first to save tokens
      const formattedHistory = interviewHistory
        .map(m => `${m.role === 'user' ? 'User' : 'System'}: ${m.content}`)
        .join('\n\n');

      let userPrompt = `Output language: ${outputLanguageLabel}

Please generate a PRD based on the following interview history:

${formattedHistory}`;

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

      return {
        content: formattedPrd,
        isValid: validation.valid,
        validationErrors: validation.missing,
        score: validation.score,
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