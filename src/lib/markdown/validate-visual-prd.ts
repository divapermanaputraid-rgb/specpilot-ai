/**
 * Utility to validate PRD markdown against VISUAL_MARKDOWN_STANDARD.md
 * Currently implements basic checks. Can be expanded based on full standard.
 */
export function validateVisualPrd(markdown: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for expected structure
  if (!markdown.includes('## 1. Product Overview')) {
    errors.push('Missing "## 1. Product Overview" section');
  }

  // Check for visual elements (Mermaid)
  if (!markdown.includes('```mermaid')) {
    errors.push('Missing Mermaid diagrams');
  } else {
    // Check for specific diagram types (Flowchart, ERD, Gantt/Journey)
    if (!markdown.match(/graph|flowchart/i)) {
      errors.push('Missing Flowchart diagram');
    }
    if (!markdown.includes('erDiagram')) {
      errors.push('Missing ER Diagram');
    }
    if (!markdown.match(/gantt|journey/i)) {
      errors.push('Missing Gantt or Journey diagram');
    }
  }

  // Check for tables
  if (!markdown.includes('|')) {
     errors.push('Missing markdown tables (e.g., Feature Matrix or Risk Matrix)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Attempts to auto-correct common markdown issues to comply with visual standard
 */
export function formatVisualPrd(markdown: string): string {
  let formatted = markdown;

  // Ensure mermaid blocks are properly formatted
  formatted = formatted.replace(/```\s*mermaid/gi, '```mermaid');
  
  // Ensure tables have spacing
  formatted = formatted.replace(/\n\|/g, '\n\n|');
  // Clean up double spaces created above
  formatted = formatted.replace(/\n\n\n\|/g, '\n\n|');

  return formatted;
}