import { z } from "zod";

export const createProjectSchema = z.object({
  session_id: z.string().uuid(),
  raw_idea: z.string().trim().min(20).max(2000)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
