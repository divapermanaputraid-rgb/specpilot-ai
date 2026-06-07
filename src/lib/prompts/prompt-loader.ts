import fs from 'fs/promises';
import path from 'path';
import {
  FALLBACK_INTERVIEW_SYSTEM_PROMPT,
  FALLBACK_JSON_REPAIR_PROMPT,
  FALLBACK_PRD_GENERATION_PROMPT,
  FALLBACK_PRD_TEMPLATE,
  FALLBACK_OUTPUT_STANDARD,
  FALLBACK_VISUAL_MARKDOWN_STANDARD,
} from './fallback-prompts';

/**
 * Loads a markdown prompt file from the docs/prompts directory.
 * Falls back to embedded constants if file is not available (e.g., in Vercel serverless functions).
 */
export async function loadPrompt(filename: string): Promise<string> {
  try {
    // Assuming this runs in a Next.js environment where process.cwd() is the project root
    const promptPath = path.join(process.cwd(), 'docs', 'prompts', filename);
    const content = await fs.readFile(promptPath, 'utf-8');
    return content;
  } catch (error) {
    // Only log in development to avoid cluttering production logs
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Could not load prompt file ${filename}, using fallback constant`, error);
    }
    
    // Use fallback constants based on filename
    switch (filename) {
      case 'interview-system-prompt.md':
        return FALLBACK_INTERVIEW_SYSTEM_PROMPT;
      case 'json-repair-prompt.md':
        return FALLBACK_JSON_REPAIR_PROMPT;
      case 'prd-generation-prompt.md':
        return FALLBACK_PRD_GENERATION_PROMPT;
      default:
        // If no fallback exists, this is an unexpected prompt file
        throw new Error(`No fallback available for prompt ${filename}`);
    }
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
 * Specifically loads and builds the PRD generation prompt with all standards and context.
 * Falls back to embedded constants if files are not available.
 */
export async function loadPrdGenerationPrompt(): Promise<string> {
  let baseTemplate: string;
  let standardsContent: string[];
  let templateContent: string;
  let examplesText = 'No examples provided.';

  try {
    // Try loading base template
    baseTemplate = await loadPrompt('prd-generation-prompt.md');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Using fallback PRD generation prompt');
    }
    baseTemplate = FALLBACK_PRD_GENERATION_PROMPT;
  }

  try {
    // Try loading standards files
    const standardsFiles = ['OUTPUT_STANDARD.md', 'VISUAL_MARKDOWN_STANDARD.md'];
    const docsDir = path.join(process.cwd(), 'docs');
    
    standardsContent = await Promise.all(
      standardsFiles.map(f => fs.readFile(path.join(docsDir, f), 'utf-8'))
    );
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Could not load standards files, using fallback constants');
    }
    standardsContent = [FALLBACK_OUTPUT_STANDARD, FALLBACK_VISUAL_MARKDOWN_STANDARD];
  }

  try {
    // Try loading template
    const docsDir = path.join(process.cwd(), 'docs');
    templateContent = await fs.readFile(path.join(docsDir, 'PRD_TEMPLATE.md'), 'utf-8');
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Could not load PRD template, using fallback constant');
    }
    templateContent = FALLBACK_PRD_TEMPLATE;
  }

  try {
    // Try loading examples (max 2)
    const docsDir = path.join(process.cwd(), 'docs');
    const examplesDir = path.join(docsDir, 'examples');
    const exampleFiles = await fs.readdir(examplesDir);
    const mds = exampleFiles.filter(f => f.endsWith('.md')).slice(0, 2);
    const contents = await Promise.all(
      mds.map(f => fs.readFile(path.join(examplesDir, f), 'utf-8'))
    );
    examplesText = contents.join('\n\n---\n\n');
  } catch (e) {
    // Examples are optional, silently ignore if missing
  }

  return interpolatePrompt(baseTemplate, {
    standards: standardsContent.join('\n\n---\n\n'),
    template: templateContent,
    examples: examplesText,
  });
}
