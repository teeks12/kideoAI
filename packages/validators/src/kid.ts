import { z } from "zod";

export const createKidSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  dateOfBirth: z.coerce.date().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  interests: z.array(z.string().max(50)).max(10).default([]),
  pin: z
    .string()
    .length(4)
    .regex(/^\d{4}$/, "PIN must be 4 digits")
    .optional()
    .nullable(),
});

export const updateKidSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(50).optional(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  interests: z.array(z.string().max(50)).max(10).optional(),
  pin: z
    .string()
    .length(4)
    .regex(/^\d{4}$/, "PIN must be 4 digits")
    .optional()
    .nullable(),
});

export const verifyKidPinSchema = z.object({
  kidId: z.string().cuid(),
  pin: z.string().length(4).regex(/^\d{4}$/),
});

export type CreateKidInput = z.infer<typeof createKidSchema>;
export type UpdateKidInput = z.infer<typeof updateKidSchema>;
export type VerifyKidPinInput = z.infer<typeof verifyKidPinSchema>;
