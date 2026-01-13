import { z } from "zod";

export const TimerStatusEnum = z.enum([
  "RUNNING",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
]);

export const startTimerSchema = z.object({
  taskId: z.string().cuid(),
  kidId: z.string().cuid(),
});

export const pauseTimerSchema = z.object({
  sessionId: z.string().cuid(),
  elapsedSeconds: z.number().int().min(0),
});

export const resumeTimerSchema = z.object({
  sessionId: z.string().cuid(),
});

export const completeTimerSchema = z.object({
  sessionId: z.string().cuid(),
  elapsedSeconds: z.number().int().min(0),
});

export const cancelTimerSchema = z.object({
  sessionId: z.string().cuid(),
});

export const getActiveTimerSchema = z.object({
  kidId: z.string().cuid(),
});

export type StartTimerInput = z.infer<typeof startTimerSchema>;
export type PauseTimerInput = z.infer<typeof pauseTimerSchema>;
export type ResumeTimerInput = z.infer<typeof resumeTimerSchema>;
export type CompleteTimerInput = z.infer<typeof completeTimerSchema>;
export type CancelTimerInput = z.infer<typeof cancelTimerSchema>;
export type GetActiveTimerInput = z.infer<typeof getActiveTimerSchema>;
