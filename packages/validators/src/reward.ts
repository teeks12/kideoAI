import { z } from "zod";

export const createRewardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().nullable(),
  iconEmoji: z.string().max(10).optional().nullable(),
  pointsCost: z.number().int().min(1, "Points cost must be at least 1").max(10000),
  limitPerWeek: z.number().int().min(1).max(100).optional().nullable(),
});

export const updateRewardSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  iconEmoji: z.string().max(10).optional().nullable(),
  pointsCost: z.number().int().min(1).max(10000).optional(),
  isActive: z.boolean().optional(),
  limitPerWeek: z.number().int().min(1).max(100).optional().nullable(),
});

export const listRewardsSchema = z.object({
  includeInactive: z.boolean().default(false),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type UpdateRewardInput = z.infer<typeof updateRewardSchema>;
export type ListRewardsInput = z.infer<typeof listRewardsSchema>;
