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
  ).optional(),
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

    if (process.env.NODE_ENV === "development") {
      console.log(`[API] /api/interview/question sessionId=${sessionId} historyCount=${conversationHistory?.length || 0}`);
    }

    const aiResponse = await interviewService.generateNextQuestion(
      sessionId,
      conversationHistory?.map(m => ({ role: m.role as "user" | "assistant", content: m.content }))
    );

    return NextResponse.json({
      success: true,
      data: aiResponse
    });
  } catch (error: any) {
    console.error("Error getting interview question:", error);
    
    const isDev = process.env.NODE_ENV === "development";
    const errorMessage = error.message || "Internal server error";
    
    return NextResponse.json(
      { 
        success: false, 
        error: isDev ? {
          code: "INTERVIEW_GENERATION_FAILED",
          message: errorMessage,
          debug: error.stack
        } : "Internal server error"
      },
      { status: 500 }
    );
  }
}
