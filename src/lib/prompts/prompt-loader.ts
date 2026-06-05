import fs from 'fs/promises';
import path from 'path';

/**
 * Loads a markdown prompt file from the docs/prompts directory
 */
export async function loadPrompt(filename: string): Promise<string> {
  try {
    // Assuming this runs in a Next.js environment where process.cwd() is the project root
    const promptPath = path.join(process.cwd(), 'docs', 'prompts', filename);
    const content = await fs.readFile(promptPath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error loading prompt ${filename}:`, error);
    // Provide a fallback depending on the requested prompt
    if (filename === 'json-repair-prompt.md') {
      return `You are a helpful JSON repair assistant. 
Your task is to take a broken JSON string and repair it so that it is valid JSON and matches the requested format.
Do not add any markdown formatting, conversational text, or explanations.
Output ONLY the raw, valid JSON object.`;
    }
    throw new Error(`Failed to load prompt ${filename}`);
  }
}

/**
 * Interpolates variables into a prompt template
 * Variables should be in the format {{variableName}}
 */
export function interpolatePrompt(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}