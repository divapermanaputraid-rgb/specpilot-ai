import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { prdService } from "@/lib/services/prd.service";
import { AiMessage } from "@/lib/ai/types";

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

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
         success: false,
         error: "Database URL not configured"
      }, { status: 500 });
    }

    const project = await prisma.project.findUnique({
      where: { sessionId },
      include: { interviewAnswers: true }
    });

    if (!project) {
       return NextResponse.json({
         success: false,
         error: "Project not found for session"
       }, { status: 404 });
    }

    // Check mock mode
    if (process.env.AI_MODE === "mock") {
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

      try {
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
      } catch (e) {
          console.error("Failed to save mock PRD to DB:", e)
      }

      return NextResponse.json({
        success: true,
        prd: mockPrd,
      });
    }

    // Actual PRD Generation
    
    // Construct interview history from DB
    const interviewHistory: AiMessage[] = [];
    
    // We start with the initial idea
    interviewHistory.push({
      role: 'user',
      content: `I want to build: ${project.rawIdea}`
    });

    // Add Q&A pairs
    project.interviewAnswers.forEach(qa => {
       interviewHistory.push({
         role: 'assistant',
         content: qa.question
       });
       interviewHistory.push({
         role: 'user',
         content: qa.answer
       });
    });

    const validationMode = process.env.PRD_VALIDATION_MODE || 'warning';

    let aiResponse = await prdService.generatePrd(interviewHistory, project.id);

    // If validation fails, run one retry/regeneration attempt (unless mode is 'off')
    if (!aiResponse.isValid && validationMode !== 'off') {
      console.log(`[PRD] First attempt failed validation. Retrying with feedback...`);
      aiResponse = await prdService.generatePrd(interviewHistory, project.id, aiResponse.validationErrors);
    }

    const quality = {
      valid: aiResponse.isValid,
      missing: aiResponse.validationErrors,
      score: aiResponse.score
    };

    // Strict mode rejection
    if (!aiResponse.isValid && validationMode === 'strict') {
      return NextResponse.json({
        success: false,
        error: "Generated PRD did not meet the required quality standard.",
        quality
      }, { status: 422 });
    }

    // Save PRD (unless strict and invalid, which is handled above)
    let prdRecord;
    try {
      prdRecord = await prisma.generatedPrd.upsert({
        where: { projectId: project.id },
        create: {
          projectId: project.id,
          sessionId,
          content: aiResponse.content,
        },
        update: {
          content: aiResponse.content,
        }
      });
      await prisma.project.update({
        where: { id: project.id },
        data: { status: "COMPLETED" }
      });
    } catch (e) {
      console.error("Failed to save AI PRD to DB:", e);
    }

    return NextResponse.json({
      success: true,
      prdId: prdRecord?.id,
      markdownContent: aiResponse.content,
      providerUsed: aiResponse.metadata?.provider,
      modelUsed: aiResponse.metadata?.model,
      quality
    });

  } catch (error) {
    console.error("Error generating PRD:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}