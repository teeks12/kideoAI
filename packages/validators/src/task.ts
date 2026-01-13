import { z } from "zod";

// Match Prisma enums
export const TaskCategoryEnum = z.enum(["EXPECTED", "PAID"]);
export const TaskTypeEnum = z.enum([
  "INDIVIDUAL",
  "FAMILY",
  "TIMED",
  "BEAT_THE_TIMER",
]);
export const TaskScheduleEnum = z.enum([
  "DAILY",
  "WEEKLY",
  "WEEKDAYS",
  "WEEKENDS",
  "ADHOC",
]);

export const createTaskSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(500).optional().nullable(),
    instructions: z.string().max(1000).optional().nullable(),
    iconEmoji: z.string().max(10).optional().nullable(),
    category: TaskCategoryEnum.default("EXPECTED"),
    type: TaskTypeEnum.default("INDIVIDUAL"),
    schedule: TaskScheduleEnum.default("ADHOC"),
    points: z.number().int().min(0).max(1000).default(0),
    bonusPoints: z.number().int().min(0).max(500).default(0),
    timerDurationMinutes: z.number().int().min(1).max(120).optional().nullable(),
    requiresApproval: z.boolean().default(true),
    countsTowardStreak: z.boolean().default(true),
    kidIds: z.array(z.string().cuid()).optional(),
  })
  .refine(
    (data) => {
      // Timed tasks must have duration
      if (
        (data.type === "TIMED" || data.type === "BEAT_THE_TIMER") &&
        !data.timerDurationMinutes
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Timed tasks must have a timer duration",
      path: ["timerDurationMinutes"],
    }
  )
  .refine(
    (data) => {
      // EXPECTED tasks should not have points
      if (data.category === "EXPECTED" && data.points > 0) {
        return false;
      }
      return true;
    },
    {
      message: "Expected tasks cannot have points",
      path: ["points"],
    }
  );

export const updateTaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  instructions: z.string().max(1000).optional().nullable(),
  iconEmoji: z.string().max(10).optional().nullable(),
  category: TaskCategoryEnum.optional(),
  type: TaskTypeEnum.optional(),
  schedule: TaskScheduleEnum.optional(),
  points: z.number().int().min(0).max(1000).optional(),
  bonusPoints: z.number().int().min(0).max(500).optional(),
  timerDurationMinutes: z.number().int().min(1).max(120).optional().nullable(),
  requiresApproval: z.boolean().optional(),
  countsTowardStreak: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const assignTaskSchema = z.object({
  taskId: z.string().cuid(),
  kidIds: z.array(z.string().cuid()).min(1),
});

export const listTasksSchema = z.object({
  kidId: z.string().cuid().optional(),
  category: TaskCategoryEnum.optional(),
  type: TaskTypeEnum.optional(),
  schedule: TaskScheduleEnum.optional(),
  includeInactive: z.boolean().default(false),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
