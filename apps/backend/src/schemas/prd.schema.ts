import { z } from "zod";

export const generatePrdSchema = z.object({
  session_id: z.string().uuid(),
  project_id: z.string().min(1)
});

export const getPrdParamsSchema = z.object({
  session_id: z.string().uuid()
});

export type GeneratePrdInput = z.infer<typeof generatePrdSchema>;
