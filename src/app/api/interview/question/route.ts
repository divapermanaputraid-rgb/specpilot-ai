import { NextResponse } from "next/server";
import { z } from "zod";
import { interviewService } from "@/lib/services/interview.service";

const questionSchema = z.object({
  sessionId: z.string().uuid(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = questionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, conversationHistory } = result.data;

    const aiResponse = await interviewService.generateNextQuestion(
      conversationHistory.map(m => ({ role: m.role, content: m.content })),
      sessionId
    );

    return NextResponse.json({
      success: true,
      ...aiResponse
    });
  } catch (error) {
    console.error("Error getting interview question:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}