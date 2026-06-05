import { NextResponse } from "next/server";
import { z } from "zod";

const questionSchema = z.object({
  session_id: z.string().uuid(),
  conversation_history: z.array(
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

    const { session_id, conversation_history } = result.data;

    // Check mock mode
    if (process.env.AI_MODE === "mock" || (!process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY)) {
      // Mock logic: after 3 user messages, finish the interview.
      const userMessageCount = conversation_history.filter(m => m.role === "user").length;
      
      if (userMessageCount >= 3) {
        return NextResponse.json({
          success: true,
          is_complete: true,
        });
      }

      return NextResponse.json({
        success: true,
        question: "Could you tell me more about the specific features you want in your app?",
        is_complete: false,
      });
    }

    // TODO: Implement actual AI provider routing
    // For now, return mock
    return NextResponse.json({
      success: true,
      question: "Could you tell me more about the specific features you want in your app?",
      is_complete: false,
    });
  } catch (error) {
    console.error("Error getting interview question:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}