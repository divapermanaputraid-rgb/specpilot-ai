import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { interviewAnswerSchema } from "@/lib/validators/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = interviewAnswerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, question, answerValue, sequenceNumber, selectedOption } = result.data;

    if (process.env.NODE_ENV === "development") {
      console.log("[InterviewAnswerAPI] Received answer:", {
        selectedOption,
        answerValue,
        sequenceNumber,
      });
    }

    // Check mock mode
    if (process.env.AI_MODE === "mock" || !process.env.DATABASE_URL) {
      if (process.env.NODE_ENV === "development") {
        console.log("[InterviewAnswerAPI] Mock answer save:", {
          selectedOption,
          answerValue,
          sequenceNumber,
          answersLengthBeforeSave: 0,
          answersLengthAfterSave: 1,
        });
      }

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

    const answersLengthBeforeSave = project.interviewAnswers.length;

    // Store answer
    await prisma.interviewAnswer.create({
      data: {
        projectId: project.id,
        sequenceNumber,
        question,
        answer: answerValue,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[InterviewAnswerAPI] Stored answer:", {
        selectedOption,
        answerValue,
        sequenceNumber,
        answersLengthBeforeSave,
        answersLengthAfterSave: answersLengthBeforeSave + 1,
      });
    }

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