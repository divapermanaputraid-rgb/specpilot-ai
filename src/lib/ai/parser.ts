import { AiInterviewResponse, AiMessage } from "./types";
import { aiRouter } from "./provider-router";
import { loadPrompt } from "../prompts/prompt-loader";
import { z } from "zod";

/**
 * Extracts JSON from a markdown string, handling potential code blocks
 */
export function extractJsonFromMarkdown(text: string): string {
  // Try to find a JSON block
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim();
  }
  
  // If no code block, try to find curly braces
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }
  
  return text.trim();
}

const aiResponseSchema = z.object({
  question: z.string().min(1, "Question must not be empty"),
  reason: z.string().optional(),
  options: z.array(z.string()).optional(),
  isComplete: z.boolean().default(false),
  completenessScore: z.number().min(0).max(100).default(0),
});

/**
 * Validates and parses the AI interview response
 * Attempts to repair broken JSON using the repair model if parsing fails
 */
export async function parseInterviewResponse(
  rawText: string,
  history: AiMessage[]
): Promise<AiInterviewResponse> {
  const jsonString = extractJsonFromMarkdown(rawText);
  
  try {
    const parsed = JSON.parse(jsonString);
    const result = aiResponseSchema.safeParse(parsed);
    
    if (!result.success) {
      throw new Error(`Zod validation failed: ${result.error.message}`);
    }
    
    return result.data;
  } catch (error) {
    console.warn("Failed to parse interview response, attempting repair", error);
    
    // Attempt to repair the JSON
    try {
      const repairPrompt = await loadPrompt('json-repair-prompt.md');
      const messages: AiMessage[] = [
        { role: 'system', content: repairPrompt },
        { role: 'user', content: `Original requested format:\n{ "question": "string", "reason": "string", "options": ["string"], "isComplete": boolean, "completenessScore": number }\n\nBroken JSON to repair:\n${rawText}` }
      ];

      const repairResponse = await aiRouter.generate({
        task: "jsonRepair",
        messages
      });

      const repairedJsonString = extractJsonFromMarkdown(repairResponse.content);
      const repaired = JSON.parse(repairedJsonString);
      
      const result = aiResponseSchema.safeParse(repaired);
      if (!result.success) {
        throw new Error(`Repaired JSON validation failed: ${result.error.message}`);
      }
      return result.data;
    } catch (repairError) {
      console.error("JSON repair failed", repairError);
      // Fallback
      return {
        question: "I encountered an error processing that. Could you elaborate on your last point?",
        reason: "Parser failure",
        isComplete: false,
        completenessScore: 0
      };
    }
  }
}