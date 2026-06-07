import { z } from "zod";

export const createProjectSchema = z.object({
  sessionId: z.string().uuid(),
  rawIdea: z.string().min(20).max(2000),
  outputLanguage: z.enum(["id", "en"]).optional().default("id"),
});

export const interviewQuestionSchema = z.object({
  sessionId: z.string().uuid(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).optional(),
});

export const interviewAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  projectId: z.string(),
  sequenceNumber: z.number().int(),
  stage: z.string(),
  question: z.string(),
  aiReason: z.string().optional(),
  selectedOption: z.string(),
  answerValue: z.string(),
  completenessScore: z.number().int().min(0).max(100),
});

export const generatePrdSchema = z.object({
  sessionId: z.string().uuid(),
  projectId: z.string().optional(),
});