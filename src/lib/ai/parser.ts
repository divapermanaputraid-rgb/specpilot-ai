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
  status: z.enum(['asking', 'ready_to_generate']).default('asking'),
  currentStage: z.string().default('Discovery'),
  question: z.string().min(1, "Question must not be empty"),
  reason: z.string().optional(),
  options: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ).default([]),
  allowCustom: z.boolean().default(true),
  completenessScore: z.number().min(0).max(100).default(0),
});

/**
 * Normalizes keys from snake_case to camelCase
 */
function normalizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: any, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = normalizeKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

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
    let parsed = JSON.parse(jsonString);
    parsed = normalizeKeys(parsed);

    // Ensure 4 options
    if (parsed.options && Array.isArray(parsed.options)) {
      if (parsed.options.length > 4) {
        parsed.options = parsed.options.slice(0, 4);
      }
      // Ensure Custom option
      const hasCustom = parsed.options.some((o: any) => 
        o.value === 'custom' || o.label?.toLowerCase() === 'custom'
      );
      if (!hasCustom && parsed.options.length >= 1) {
        parsed.options[parsed.options.length - 1] = { label: 'Custom', value: 'custom' };
      } else if (!hasCustom) {
        parsed.options.push({ label: 'Custom', value: 'custom' });
      }
      
      // Ensure exactly 4
      while (parsed.options.length < 4) {
        if (parsed.options.length === 3) {
          parsed.options.push({ label: 'Custom', value: 'custom' });
        } else {
          parsed.options.unshift({ label: 'More info needed', value: `more_${parsed.options.length}` });
        }
      }
      
      // Force last to be custom if not already
      if (parsed.options[3].value !== 'custom') {
        parsed.options[3] = { label: 'Custom', value: 'custom' };
      }
    }

    // Clamp completenessScore
    if (typeof parsed.completenessScore === 'number') {
      parsed.completenessScore = Math.max(0, Math.min(100, parsed.completenessScore));
    }

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
        status: 'asking',
        currentStage: 'Error Recovery',
        question: "I encountered an error processing that. Could you elaborate on your last point?",
        reason: "Parser failure",
        options: [],
        allowCustom: true,
        completenessScore: 0
      };
    }
  }
}