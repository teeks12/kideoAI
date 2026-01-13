import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, familyProcedure, parentFamilyProcedure } from "../trpc";
import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  listTasksSchema,
  TaskCategoryEnum,
  TaskTypeEnum,
  TaskScheduleEnum,
} from "@kideo/validators";

// Override schema for fromTemplate (without refine validations)
const taskOverridesSchema = z.object({
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
});

export const taskRouter = router({
  /**
   * Create a new task
   */
  create: parentFamilyProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { kidIds, ...taskData } = input;

      const task = await ctx.prisma.task.create({
        data: {
          ...taskData,
          familyId: ctx.family!.id,
          createdById: ctx.user!.id,
          // Create assignments if kidIds provided
          assignments: kidIds?.length
            ? {
                create: kidIds.map((kidId) => ({ kidId })),
              }
            : undefined,
        },
        include: {
          assignments: { include: { kid: true } },
        },
      });

      return task;
    }),

  /**
   * Get a task by ID
   */
  get: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
        include: {
          assignments: { include: { kid: true } },
          createdBy: true,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return task;
    }),

  /**
   * List tasks
   */
  list: familyProcedure.input(listTasksSchema).query(async ({ ctx, input }) => {
    const { kidId, category, type, schedule, includeInactive } = input;

    return ctx.prisma.task.findMany({
      where: {
        familyId: ctx.family!.id,
        isActive: includeInactive ? undefined : true,
        category: category || undefined,
        type: type || undefined,
        schedule: schedule || undefined,
        ...(kidId && {
          assignments: { some: { kidId } },
        }),
      },
      include: {
        assignments: { include: { kid: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /**
   * Get today's tasks for a specific kid
   */
  todayForKid: familyProcedure
    .input(z.object({ kidId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Build schedule filter
      const scheduleFilter = [
        "DAILY",
        "ADHOC",
        ...(isWeekend ? ["WEEKENDS"] : ["WEEKDAYS"]),
      ];

      const tasks = await ctx.prisma.task.findMany({
        where: {
          familyId: ctx.family!.id,
          isActive: true,
          assignments: { some: { kidId: input.kidId } },
          schedule: { in: scheduleFilter as any },
        },
        include: {
          completions: {
            where: {
              kidId: input.kidId,
              completedAt: {
                gte: today,
                lt: tomorrow,
              },
            },
            orderBy: { completedAt: "desc" },
            take: 1,
          },
        },
        orderBy: [{ category: "asc" }, { title: "asc" }],
      });

      return tasks.map((task) => ({
        ...task,
        todayCompletion: task.completions[0] || null,
        isCompletedToday: task.completions.length > 0,
      }));
    }),

  /**
   * Update a task
   */
  update: parentFamilyProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const task = await ctx.prisma.task.findFirst({
        where: {
          id,
          familyId: ctx.family!.id,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return ctx.prisma.task.update({
        where: { id },
        data,
        include: {
          assignments: { include: { kid: true } },
        },
      });
    }),

  /**
   * Delete a task
   */
  delete: parentFamilyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return ctx.prisma.task.delete({
        where: { id: input.id },
      });
    }),

  /**
   * Assign task to kids
   */
  assign: parentFamilyProcedure
    .input(assignTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          familyId: ctx.family!.id,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // Verify all kids belong to this family
      const kids = await ctx.prisma.kid.findMany({
        where: {
          id: { in: input.kidIds },
          familyId: ctx.family!.id,
        },
      });

      if (kids.length !== input.kidIds.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more kids not found in this family",
        });
      }

      // Delete existing assignments and create new ones
      await ctx.prisma.$transaction([
        ctx.prisma.taskAssignment.deleteMany({
          where: { taskId: input.taskId },
        }),
        ctx.prisma.taskAssignment.createMany({
          data: input.kidIds.map((kidId) => ({
            taskId: input.taskId,
            kidId,
          })),
        }),
      ]);

      return ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        include: {
          assignments: { include: { kid: true } },
        },
      });
    }),

  /**
   * Create task from template
   */
  fromTemplate: parentFamilyProcedure
    .input(
      z.object({
        templateId: z.string().cuid(),
        kidIds: z.array(z.string().cuid()).optional(),
        overrides: taskOverridesSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.prisma.taskTemplate.findUnique({
        where: { id: input.templateId },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      const taskData = {
        title: input.overrides?.title || template.title,
        description: input.overrides?.description ?? template.description,
        instructions: input.overrides?.instructions ?? template.instructions,
        iconEmoji: input.overrides?.iconEmoji ?? template.iconEmoji,
        category: input.overrides?.category || template.category,
        type: input.overrides?.type || template.type,
        points: input.overrides?.points ?? template.suggestedPoints,
        timerDurationMinutes:
          input.overrides?.timerDurationMinutes ?? template.timerDurationMinutes,
        schedule: input.overrides?.schedule || "ADHOC",
        requiresApproval: input.overrides?.requiresApproval ?? true,
        countsTowardStreak: input.overrides?.countsTowardStreak ?? true,
      };

      return ctx.prisma.task.create({
        data: {
          ...taskData,
          familyId: ctx.family!.id,
          createdById: ctx.user!.id,
          assignments: input.kidIds?.length
            ? {
                create: input.kidIds.map((kidId) => ({ kidId })),
              }
            : undefined,
        },
        include: {
          assignments: { include: { kid: true } },
        },
      });
    }),
});
