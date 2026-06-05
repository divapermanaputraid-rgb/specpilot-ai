import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const answerSchema = z.object({
  session_id: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
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

    const { session_id, question, answer } = result.data;

    // Check mock mode
    if (process.env.AI_MODE === "mock" || !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
      });
    }

    // Find project
    const project = await prisma.project.findUnique({
      where: { sessionId: session_id },
      include: { interviewAnswers: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Calculate next sequence number
    const nextSeq = project.interviewAnswers.length + 1;

    // Store answer
    await prisma.interviewAnswer.create({
      data: {
        projectId: project.id,
        sequenceNumber: nextSeq,
        question,
        answer,
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