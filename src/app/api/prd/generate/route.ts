import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const generateSchema = z.object({
  sessionId: z.string().uuid(),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = generateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, projectId } = result.data;

    // Check mock mode
    if (process.env.AI_MODE === "mock" || (!process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY)) {
      const mockPrd = `# Mock PRD for Session ${sessionId}

## 1. Product Overview
This is a mock PRD generated because the system is in mock mode or AI keys are missing.

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

      if (process.env.DATABASE_URL) {
        try {
          const project = await prisma.project.findUnique({ where: { sessionId }});
          if (project) {
            await prisma.generatedPrd.upsert({
              where: { projectId: project.id },
              create: {
                projectId: project.id,
                sessionId,
                content: mockPrd,
              },
              update: {
                content: mockPrd,
              }
            });
            await prisma.project.update({
              where: { id: project.id },
              data: { status: "COMPLETED" }
            });
          }
        } catch (e) {
            console.error("Failed to save mock PRD to DB:", e)
        }
      }

      return NextResponse.json({
        success: true,
        prd: mockPrd,
      });
    }

    // TODO: Implement actual PRD generation using AI provider routing and docs loading
    return NextResponse.json({
        success: true,
        prd: "# Live Mode PRD Placeholder\n\nAI PRD generation is not fully implemented yet.",
    });

  } catch (error) {
    console.error("Error generating PRD:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}