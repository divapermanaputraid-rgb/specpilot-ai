import { AiInterviewResponse, AiMessage } from "./types";
import { aiRouter } from "./provider-router";
import { loadPrompt } from "../prompts/prompt-loader";

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
    
    // Basic validation
    if (!parsed.question || typeof parsed.question !== 'string') {
      throw new Error("Missing or invalid 'question' field");
    }
    
    if (parsed.options && !Array.isArray(parsed.options)) {
      throw new Error("'options' must be an array if provided");
    }
    
    return {
      question: parsed.question,
      reason: parsed.reason,
      options: parsed.options,
      isComplete: !!parsed.isComplete,
      completenessScore: typeof parsed.completenessScore === 'number' ? parsed.completenessScore : 0
    };
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
      
      return {
        question: repaired.question || "I'm having trouble formulating my next question. Could you tell me more about the features?",
        reason: repaired.reason || "JSON repair fallback",
        options: Array.isArray(repaired.options) ? repaired.options : undefined,
        isComplete: !!repaired.isComplete,
        completenessScore: typeof repaired.completenessScore === 'number' ? repaired.completenessScore : 0
      };
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