export function extractJsonFromMarkdown(text: string): string | null {
  // Try to find markdown code blocks with json
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1];
  }

  // If no code block, try to find the first { and last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }

  // If no object braces, try array brackets
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return text.substring(firstBracket, lastBracket + 1);
  }

  return null;
}

export function parseAiResponse<T>(text: string, fallback?: T): T {
  try {
    // Fast path: try parsing the raw text directly
    return JSON.parse(text) as T;
  } catch (e) {
    // Slow path: try extracting JSON from markdown or raw text
    const extracted = extractJsonFromMarkdown(text);
    if (extracted) {
      try {
        return JSON.parse(extracted) as T;
      } catch (e2) {
        // If it still fails, see if we have a robust fallback mechanism
        console.error("Failed to parse extracted JSON:", extracted);
      }
    }
    
    console.error("Failed to parse AI response. Raw text:", text);
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw new Error("Failed to parse AI response as JSON");
  }
}