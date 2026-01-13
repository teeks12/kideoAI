import { z } from "zod";

export const createFamilySchema = z.object({
  name: z.string().min(1, "Family name is required").max(100),
  timezone: z.string().default("America/New_York"),
});

export const updateFamilySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  timezone: z.string().optional(),
  streakMultipliers: z
    .object({
      tier1: z.number().min(1).max(3),
      tier2: z.number().min(1).max(3),
      tier3: z.number().min(1).max(3),
    })
    .optional(),
});

export const familySettingsSchema = z.object({
  streakMultipliers: z.object({
    tier1: z.number().min(1).max(3).default(1.0),
    tier2: z.number().min(1).max(3).default(1.2),
    tier3: z.number().min(1).max(3).default(1.5),
  }),
});

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;
export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;
export type FamilySettings = z.infer<typeof familySettingsSchema>;
