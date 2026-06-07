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
  selectedOption: z.string().min(1),
  answerValue: z.string().min(1),
  completenessScore: z.number().int().min(0).max(100),
}).superRefine((data, ctx) => {
  if (data.selectedOption === "custom" && data.answerValue.trim().length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["answerValue"],
      message: "Custom answer must be at least 2 characters.",
    });
  }

  if (data.answerValue.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["answerValue"],
      message: "Answer value cannot be empty.",
    });
  }
});

export const generatePrdSchema = z.object({
  sessionId: z.string().uuid(),
  projectId: z.string().optional(),
});