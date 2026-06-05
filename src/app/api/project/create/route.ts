import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const createProjectSchema = z.object({
  sessionId: z.string().uuid(),
  rawIdea: z.string().min(20).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.errors },
        { status: 400 }
      );
    }

    const { sessionId, rawIdea } = result.data;

    // Check mock mode
    if (process.env.AI_MODE === "mock" || !process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        projectId: "mock-project-id",
      });
    }

    const project = await prisma.project.create({
      data: {
        sessionId,
        rawIdea,
        status: "INTERVIEWING",
      },
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}