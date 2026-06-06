/**
 * Utility to validate PRD markdown against VISUAL_MARKDOWN_STANDARD.md
 * Currently implements basic checks. Can be expanded based on full standard.
 */
export interface PrdValidationResult {
  valid: boolean;
  missing: string[];
  score: number;
}

export function validateVisualPrd(markdown: string): PrdValidationResult {
  const missing: string[] = [];
  const totalChecks = 11;
  let passedChecks = 0;

  // 1. Minimum markdown length: 4000 characters
  if (markdown.length >= 4000) {
    passedChecks++;
  } else {
    missing.push(`PRD shorter than recommended (${markdown.length} chars).`);
  }

  // 2. at least 12 markdown headings
  const headings = markdown.match(/^#+\s/gm);
  if (headings && headings.length >= 12) {
    passedChecks++;
  } else {
    missing.push(`Missing required depth. Found ${headings?.length || 0}/12 sections.`);
  }

  // 3. has Product Overview or Executive Summary
  if (markdown.match(/##.*(Product Overview|Executive Summary)/i)) {
    passedChecks++;
  } else {
    missing.push('Missing Product Overview or Executive Summary.');
  }

  // 4. has Target Users
  if (markdown.match(/##.*Target Users/i)) {
    passedChecks++;
  } else {
    missing.push('Missing Target Users section.');
  }

  // 5. has MVP Scope
  if (markdown.match(/##.*MVP Scope/i)) {
    passedChecks++;
  } else {
    missing.push('Missing MVP Scope section.');
  }

  // 6. has User Stories
  if (markdown.match(/##.*User Stories/i) || markdown.match(/as a.*i want to.*so that/gi)) {
    passedChecks++;
  } else {
    missing.push('Missing User Stories.');
  }

  // 7. has Feature Requirements or Feature Matrix
  if (markdown.match(/##.*(Feature Requirements|Feature Matrix)/i)) {
    passedChecks++;
  } else {
    missing.push('Missing Feature Requirements or Feature Matrix.');
  }

  // 8. has Risks or Risks & Mitigations
  if (markdown.match(/##.*(Risks|Risks & Mitigations)/i)) {
    passedChecks++;
  } else {
    missing.push('Missing Risks or Risks & Mitigations.');
  }

  // 9. has AI Coding Agent Prompt
  if (markdown.match(/##.*AI Coding Agent Prompt/i)) {
    passedChecks++;
  } else {
    missing.push('Missing AI Coding Agent Prompt.');
  }

  // 10. has at least one Mermaid block
  if (markdown.includes('```mermaid')) {
    passedChecks++;
  } else {
    missing.push('Missing Mermaid diagrams.');
  }

  // 11. has at least one Markdown table
  if (markdown.match(/^\|.*\|$/gm)) {
    passedChecks++;
  } else {
    missing.push('Missing Markdown tables.');
  }

  const score = Math.round((passedChecks / totalChecks) * 100);

  return {
    valid: missing.length === 0,
    missing,
    score
  };
}

/**
 * Attempts to auto-correct common markdown issues to comply with visual standard
 */
export function formatVisualPrd(markdown: string): string {
  let formatted = markdown;

  // Ensure mermaid blocks are properly formatted
  formatted = formatted.replace(/```\s*mermaid/gi, '```mermaid');
  
  // Fix broken tables: remove blank lines between pipe rows
  // This matches a pipe line followed by one or more blank lines followed by another pipe line
  formatted = formatted.replace(/(\|.*\|)\n\s*\n+(\|)/g, '$1\n$2');

  return formatted;
}
