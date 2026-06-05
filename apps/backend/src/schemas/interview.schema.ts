import { z } from "zod";

export const interviewQuestionSchema = z.object({
  session_id: z.string().uuid(),
  conversation_history: z.array(z.unknown()).default([])
});

export const interviewAnswerSchema = z.object({
  session_id: z.string().uuid(),
  project_id: z.string().min(1),
  sequence_number: z.number().int().positive(),
  stage: z.string().trim().min(1),
  question: z.string().trim().min(1),
  ai_reason: z.string().trim().min(1).optional(),
  selected_option: z.enum(["option_a", "option_b", "option_c", "custom"]),
  answer_value: z.string().trim().min(1),
  completeness_score: z.number().min(0).max(100)
});

export type InterviewQuestionInput = z.infer<typeof interviewQuestionSchema>;
export type InterviewAnswerInput = z.infer<typeof interviewAnswerSchema>;
