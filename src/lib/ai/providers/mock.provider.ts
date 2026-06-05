import { AiProvider, AiProviderConfig, AiProviderResponse, AiMessage } from "../types";

export class MockProvider implements AiProvider {
  name = "mock";

  isAvailable(): boolean {
    return true; // Always available
  }

  async generate(config: AiProviderConfig): Promise<AiProviderResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let content = "";

    switch (config.task) {
      case "interview":
        content = this.generateInterviewMock(config.messages);
        break;
      case "prdGeneration":
        content = this.generatePrdMock();
        break;
      case "jsonRepair":
        content = this.generateJsonRepairMock(config.messages);
        break;
      default:
        content = "Mock response";
    }

    return {
      content,
      providerUsed: this.name,
      modelUsed: "mock-model",
      tokensUsed: 0,
    };
  }

  private generateInterviewMock(messages: AiMessage[]): string {
    const userMessageCount = messages.filter((m) => m.role === "user").length;

    let responseObj;
    if (userMessageCount >= 3) {
      responseObj = {
        question: "Thank you, I have all the information I need to generate the PRD.",
        reason: "Sufficient context gathered.",
        isComplete: true,
        completenessScore: 100,
      };
    } else {
      responseObj = {
        question: "Could you tell me more about the specific features you want in your app?",
        reason: "Need to understand core features to create a complete PRD.",
        options: [
          "User Authentication",
          "Data Dashboard",
          "Payment Integration",
          "Social Sharing",
        ],
        isComplete: false,
        completenessScore: Math.min(100, userMessageCount * 33),
      };
    }

    return JSON.stringify(responseObj);
  }

  private generatePrdMock(): string {
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

  private generateJsonRepairMock(messages: AiMessage[]): string {
    // Try to extract the broken JSON from the last message
    const lastMessage = messages[messages.length - 1];
    
    // In a real mock, we'd try to do a simple repair using JSON.parse and catching,
    // but for simplicity, let's just return a valid default format depending on what looks like it was requested.
    
    if (lastMessage?.content.includes("question") || lastMessage?.content.includes("completenessScore")) {
       return JSON.stringify({
         question: "Mock repaired question",
         reason: "Mock repaired reason",
         isComplete: false,
         completenessScore: 50
       });
    }

    return "{}";
  }
}