import { AiProvider, AiMessage, AiInterviewResponse } from "../types";

export class MockAiProvider implements AiProvider {
  async generateInterviewQuestion(
    history: AiMessage[],
    systemPrompt: string
  ): Promise<AiInterviewResponse> {
    const userMessageCount = history.filter(m => m.role === "user").length;
    
    if (userMessageCount >= 3) {
      return {
        question: "Thank you, I have all the information I need to generate the PRD.",
        reason: "Sufficient context gathered.",
        isComplete: true,
        completenessScore: 100
      };
    }

    return {
      question: "Could you tell me more about the specific features you want in your app?",
      reason: "Need to understand core features to create a complete PRD.",
      options: [
        "User Authentication",
        "Data Dashboard",
        "Payment Integration",
        "Social Sharing"
      ],
      isComplete: false,
      completenessScore: Math.min(100, userMessageCount * 33)
    };
  }

  async generatePrd(
    history: AiMessage[],
    systemPrompt: string
  ): Promise<string> {
    return `# Mock PRD

## 1. Product Overview
This is a mock PRD generated because the system is in mock mode.

## 2. Mermaid Flowchart
\`\`\`mermaid
graph TD
    A[User Idea] --> B{Mock Mode?};
    B -- Yes --> C[Generate Mock PRD];
    B -- No --> D[Call AI];
\`\`\`

## 3. Mermaid ERD
\`\`\`mermaid
erDiagram
    PROJECT ||--o{ INTERVIEW_ANSWER : contains
    PROJECT ||--o| GENERATED_PRD : has
\`\`\`

## 4. Mermaid Gantt
\`\`\`mermaid
gantt
    title Mock Project Schedule
    dateFormat  YYYY-MM-DD
    section Implementation
    Setup           :a1, 2024-01-01, 7d
    Features        :after a1, 14d
\`\`\`

## 5. Feature Priority Matrix
| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Core App | High | Medium | P1 |
| Mock Mode | Medium | Low | P2 |

## 6. Risk Matrix
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API Key Missing | High | High | Use mock mode fallback |

## 7. AI Coding Agent Prompt
Copy and paste this section to an AI coding agent to start implementation.
`;
  }
}