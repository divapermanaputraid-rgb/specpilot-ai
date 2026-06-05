import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const answerSchema = z.object({
  sessionId: z.string().uuid(),
  projectId: z.string(),
  sequenceNumber: z.number().int(),
  stage: z.string(),
  question: z.string(),
  aiReason: z.string().optional(),
  selectedOption: z.string(),
  answerValue: z.string(),
  completenessScore: z.number().int(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = answerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, question, answerValue, sequenceNumber } = result.data;

    // Check mock mode
    if (process.env.AI_MODE === "mock" || !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
      });
    }

    // Find project
    const project = await prisma.project.findUnique({
      where: { sessionId },
      include: { interviewAnswers: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Store answer
    await prisma.interviewAnswer.create({
      data: {
        projectId: project.id,
        sequenceNumber,
        question,
        answer: answerValue,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error storing interview answer:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}