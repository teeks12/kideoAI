import { z } from "zod";

export const CompletionStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const createCompletionSchema = z.object({
  taskId: z.string().cuid(),
  kidId: z.string().cuid(),
  timerSessionId: z.string().cuid().optional().nullable(),
  proofImageUrl: z.string().url().optional().nullable(),
});

export const approveCompletionSchema = z.object({
  completionId: z.string().cuid(),
});

export const rejectCompletionSchema = z.object({
  completionId: z.string().cuid(),
  reason: z.string().max(500).optional(),
});

export const listCompletionsSchema = z.object({
  kidId: z.string().cuid().optional(),
  taskId: z.string().cuid().optional(),
  status: CompletionStatusEnum.optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export type CreateCompletionInput = z.infer<typeof createCompletionSchema>;
export type ApproveCompletionInput = z.infer<typeof approveCompletionSchema>;
export type RejectCompletionInput = z.infer<typeof rejectCompletionSchema>;
export type ListCompletionsInput = z.infer<typeof listCompletionsSchema>;
