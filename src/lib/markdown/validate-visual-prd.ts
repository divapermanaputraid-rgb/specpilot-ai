/**
 * Utility to validate PRD markdown against VISUAL_MARKDOWN_STANDARD.md
 * Currently implements basic checks. Can be expanded based on full standard.
 */
export interface PrdValidationResult {
  valid: boolean;
  missing: string[];
}

export function validateVisualPrd(markdown: string): PrdValidationResult {
  const missing: string[] = [];

  // 1. Minimum markdown length
  if (markdown.length < 12000) {
    missing.push(`PRD too short (${markdown.length} chars). Minimum 12,000 required for full technical depth.`);
  }

  // 2. Headings count
  const headings = markdown.match(/^##\s/gm);
  if (!headings || headings.length < 20) {
    missing.push(`Missing required depth. Found ${headings?.length || 0}/20 mandatory sections (## headings).`);
  }

  // 3. Mandatory Diagrams
  if (!markdown.includes('```mermaid')) {
    missing.push('Missing all Mermaid diagrams.');
  } else {
    if (!markdown.match(/graph|flowchart/i)) missing.push('Missing Mermaid flowchart (User Flow).');
    if (!markdown.includes('erDiagram')) missing.push('Missing Mermaid erDiagram (Data Model).');
    if (!markdown.includes('gantt')) missing.push('Missing Mermaid gantt (Timeline).');
  }

  // 4. Tables and Specific Content counts
  if (!markdown.toLowerCase().includes('success metrics')) missing.push('Missing Success Metrics table.');
  
  // Feature Matrix check (at least 10 rows)
  const tableRows = markdown.match(/^\|.*\|$/gm) || [];
  if (tableRows.length < 40) { // Roughly 10 features + other tables
    missing.push('Missing Feature Requirements table with at least 10 detailed feature rows.');
  }

  // Acceptance Criteria count
  const acItems = markdown.match(/^[*-]\s.*|\|.*\|/gm) || [];
  if (!markdown.toLowerCase().includes('acceptance criteria')) {
    missing.push('Missing Acceptance Criteria section.');
  }

  // User Stories count
  const userStories = markdown.match(/as a.*i want to.*so that/gi) || [];
  if (userStories.length < 8) {
    missing.push(`Missing required user story depth. Found ${userStories.length}/8 user stories.`);
  }

  // Risk Matrix check
  if (!markdown.toLowerCase().includes('risk matrix') && !markdown.toLowerCase().includes('risks & mitigations')) {
    missing.push('Missing Risk Matrix / Risks & Mitigations table.');
  }

  // API Endpoints count
  const apiMethods = markdown.match(/GET|POST|PUT|DELETE|PATCH/g) || [];
  if (apiMethods.length < 5) {
    missing.push(`Missing API design depth. Found ${apiMethods.length}/5 suggested endpoints.`);
  }

  // AI Coding Agent Prompt length
  const aiPromptSection = markdown.split(/##.*AI Coding Agent Prompt/i)[1];
  if (!aiPromptSection || aiPromptSection.trim().length < 500) {
    missing.push('Missing or too shallow AI Coding Agent Prompt (minimum 500 characters).');
  }

  // 5. Required Sections Checklist (21 Sections)
  const sections = [
    'Executive Summary', 'Product Overview', 'Problem Statement', 'Target Users',
    'Goals', 'Non-Goals', 'Success Metrics', 'MVP Scope', 'User Roles',
    'User Stories', 'Main User Flow', 'Feature Requirements', 'Acceptance Criteria',
    'Data Model', 'API Endpoint Suggestion', 'AI Feature Design',
    'Tech Stack Recommendation', 'Timeline', 'Risks & Mitigations',
    'Open Questions', 'AI Coding Agent Prompt'
  ];

  for (const section of sections) {
    const regex = new RegExp(`##.*${section}`, 'i');
    if (!regex.test(markdown)) {
      missing.push(`Missing Section: ${section}`);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
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
