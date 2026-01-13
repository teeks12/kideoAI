import { z } from "zod";

export const createGoalSchema = z.object({
  kidId: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
  targetDate: z.coerce.date().optional().nullable(),
});

export const updateGoalSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  targetDate: z.coerce.date().optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
  isCompleted: z.boolean().optional(),
});

export const listGoalsSchema = z.object({
  kidId: z.string().cuid(),
  includeCompleted: z.boolean().default(true),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type ListGoalsInput = z.infer<typeof listGoalsSchema>;
