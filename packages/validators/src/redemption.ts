import { z } from "zod";

export const RedemptionStatusEnum = z.enum([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "FULFILLED",
]);

export const requestRedemptionSchema = z.object({
  rewardId: z.string().cuid(),
  kidId: z.string().cuid(),
});

export const approveRedemptionSchema = z.object({
  redemptionId: z.string().cuid(),
});

export const rejectRedemptionSchema = z.object({
  redemptionId: z.string().cuid(),
  reason: z.string().max(500).optional(),
});

export const fulfillRedemptionSchema = z.object({
  redemptionId: z.string().cuid(),
});

export const listRedemptionsSchema = z.object({
  kidId: z.string().cuid().optional(),
  status: RedemptionStatusEnum.optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export type RequestRedemptionInput = z.infer<typeof requestRedemptionSchema>;
export type ApproveRedemptionInput = z.infer<typeof approveRedemptionSchema>;
export type RejectRedemptionInput = z.infer<typeof rejectRedemptionSchema>;
export type FulfillRedemptionInput = z.infer<typeof fulfillRedemptionSchema>;
export type ListRedemptionsInput = z.infer<typeof listRedemptionsSchema>;
