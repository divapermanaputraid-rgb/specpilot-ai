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

/**
 * Specifically loads and builds the PRD generation prompt with all standards and context
 */
export async function loadPrdGenerationPrompt(): Promise<string> {
  const baseTemplate = await loadPrompt('prd-generation-prompt.md');
  
  // Load context files
  const standardsFiles = [
    'OUTPUT_STANDARD.md',
    'VISUAL_MARKDOWN_STANDARD.md'
  ];
  
  const docsDir = path.join(process.cwd(), 'docs');
  
  const standardsContent = await Promise.all(
    standardsFiles.map(f => fs.readFile(path.join(docsDir, f), 'utf-8'))
  );
  
  const templateContent = await fs.readFile(path.join(docsDir, 'PRD_TEMPLATE.md'), 'utf-8');
  
  // Load examples (max 2)
  const examplesDir = path.join(docsDir, 'examples');
  let examplesText = 'No examples provided.';
  try {
    const exampleFiles = await fs.readdir(examplesDir);
    const mds = exampleFiles.filter(f => f.endsWith('.md')).slice(0, 2);
    const contents = await Promise.all(
      mds.map(f => fs.readFile(path.join(examplesDir, f), 'utf-8'))
    );
    examplesText = contents.join('\n\n---\n\n');
  } catch (e) {
    // Ignore if directory missing
  }

  return interpolatePrompt(baseTemplate, {
    standards: standardsContent.join('\n\n---\n\n'),
    template: templateContent,
    examples: examplesText
  });
}
