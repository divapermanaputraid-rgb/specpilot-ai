import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    // Check mock mode or missing DB
    if (process.env.AI_MODE === "mock" || !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        prd: `# Mock PRD for Session ${sessionId}\n\n## 1. Product Overview\nThis is a mock PRD retrieved from the fallback system.`,
      });
    }

    const prd = await prisma.generatedPrd.findUnique({
      where: { sessionId },
      include: {
        project: true,
      },
    });

    if (!prd) {
      return NextResponse.json(
        { success: false, error: "PRD not found" },
        { status: 404 }
      );
    }

    const quality = null;

    return NextResponse.json({
      success: true,
      prd: prd.content,
      quality
    });
  } catch (error) {
    console.error("Error retrieving PRD:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}