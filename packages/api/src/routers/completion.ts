import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, familyProcedure, parentFamilyProcedure } from "../trpc";
import {
  createCompletionSchema,
  approveCompletionSchema,
  rejectCompletionSchema,
  listCompletionsSchema,
} from "@kideo/validators";
import {
  calculatePointsWithMultiplier,
  calculateStreakUpdate,
  checkNewBadges,
  type StreakMultipliers,
  type KidStats,
  type Badge,
} from "@kideo/domain";

export const completionRouter = router({
  /**
   * Create a task completion (kid marks task as complete)
   */
  create: familyProcedure
    .input(createCompletionSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify task belongs to family and kid is assigned
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          familyId: ctx.family!.id,
          isActive: true,
          assignments: { some: { kidId: input.kidId } },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found or not assigned to this kid",
        });
      }

      // Verify kid belongs to family
      const kid = await ctx.prisma.kid.findFirst({
        where: {
          id: input.kidId,
          familyId: ctx.family!.id,
        },
      });

      if (!kid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kid not found",
        });
      }

      // Check for existing pending completion today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingCompletion = await ctx.prisma.taskCompletion.findFirst({
        where: {
          taskId: task.id,
          kidId: kid.id,
          completedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (existingCompletion) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Task already completed today",
        });
      }

      // Create completion
      const completion = await ctx.prisma.taskCompletion.create({
        data: {
          taskId: task.id,
          kidId: kid.id,
          status: task.requiresApproval ? "PENDING" : "APPROVED",
          timerSessionId: input.timerSessionId,
          proofImageUrl: input.proofImageUrl,
        },
        include: {
          task: true,
          kid: true,
        },
      });

      // If auto-approved, process points and streaks
      if (!task.requiresApproval) {
        await processApproval(ctx, completion.id);
      }

      return completion;
    }),

  /**
   * Get a completion by ID
   */
  get: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const completion = await ctx.prisma.taskCompletion.findFirst({
        where: {
          id: input.id,
          task: { familyId: ctx.family!.id },
        },
        include: {
          task: true,
          kid: true,
          approvedBy: true,
          timerSession: true,
        },
      });

      if (!completion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Completion not found",
        });
      }

      return completion;
    }),

  /**
   * List pending completions for approval
   */
  listPending: parentFamilyProcedure.query(async ({ ctx }) => {
    return ctx.prisma.taskCompletion.findMany({
      where: {
        task: { familyId: ctx.family!.id },
        status: "PENDING",
      },
      include: {
        task: true,
        kid: true,
        timerSession: true,
      },
      orderBy: { completedAt: "asc" },
    });
  }),

  /**
   * List completions with filters
   */
  list: familyProcedure
    .input(listCompletionsSchema)
    .query(async ({ ctx, input }) => {
      const { kidId, taskId, status, fromDate, toDate, limit, offset } = input;

      return ctx.prisma.taskCompletion.findMany({
        where: {
          task: { familyId: ctx.family!.id },
          kidId: kidId || undefined,
          taskId: taskId || undefined,
          status: status || undefined,
          completedAt: {
            gte: fromDate || undefined,
            lte: toDate || undefined,
          },
        },
        include: {
          task: true,
          kid: true,
          approvedBy: true,
        },
        orderBy: { completedAt: "desc" },
        take: limit,
        skip: offset,
      });
    }),

  /**
   * Approve a completion
   */
  approve: parentFamilyProcedure
    .input(approveCompletionSchema)
    .mutation(async ({ ctx, input }) => {
      const completion = await ctx.prisma.taskCompletion.findFirst({
        where: {
          id: input.completionId,
          task: { familyId: ctx.family!.id },
          status: "PENDING",
        },
        include: {
          task: true,
          kid: { include: { streak: true } },
        },
      });

      if (!completion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Completion not found or already processed",
        });
      }

      return processApproval(ctx, completion.id);
    }),

  /**
   * Reject a completion
   */
  reject: parentFamilyProcedure
    .input(rejectCompletionSchema)
    .mutation(async ({ ctx, input }) => {
      const completion = await ctx.prisma.taskCompletion.findFirst({
        where: {
          id: input.completionId,
          task: { familyId: ctx.family!.id },
          status: "PENDING",
        },
      });

      if (!completion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Completion not found or already processed",
        });
      }

      return ctx.prisma.taskCompletion.update({
        where: { id: input.completionId },
        data: {
          status: "REJECTED",
          approvedById: ctx.user!.id,
          approvedAt: new Date(),
          rejectionReason: input.reason,
        },
        include: {
          task: true,
          kid: true,
        },
      });
    }),

  /**
   * Get completion history for a kid
   */
  history: familyProcedure
    .input(
      z.object({
        kidId: z.string().cuid(),
        limit: z.number().int().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.taskCompletion.findMany({
        where: {
          kidId: input.kidId,
          task: { familyId: ctx.family!.id },
        },
        include: {
          task: true,
          approvedBy: true,
        },
        orderBy: { completedAt: "desc" },
        take: input.limit,
      });
    }),
});

/**
 * Process approval: award points, update streaks, check badges
 */
async function processApproval(ctx: any, completionId: string) {
  const completion = await ctx.prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: {
      task: true,
      kid: { include: { streak: true, badges: true } },
      timerSession: true,
    },
  });

  if (!completion) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Completion not found",
    });
  }

  const family = await ctx.prisma.family.findUnique({
    where: { id: completion.task.familyId },
  });

  const multipliers = family?.streakMultipliers as StreakMultipliers | undefined;
  const currentStreak = completion.kid.streak?.currentCount || 0;

  // Calculate points
  let pointsAwarded = 0;
  let multiplierApplied = 1.0;

  if (completion.task.category === "PAID") {
    pointsAwarded = calculatePointsWithMultiplier(
      completion.task.points,
      currentStreak,
      multipliers
    );
    multiplierApplied =
      pointsAwarded > 0 ? pointsAwarded / completion.task.points : 1.0;

    // Add beat-the-timer bonus if applicable
    if (
      completion.task.type === "BEAT_THE_TIMER" &&
      completion.timerSession?.beatTarget
    ) {
      pointsAwarded += completion.task.bonusPoints;
    }
  }

  // Update streak if task counts toward streak
  let streakUpdate = null;
  if (completion.task.countsTowardStreak && completion.kid.streak) {
    streakUpdate = calculateStreakUpdate(
      {
        currentCount: completion.kid.streak.currentCount,
        longestCount: completion.kid.streak.longestCount,
        lastActiveDate: completion.kid.streak.lastActiveDate,
      },
      completion.completedAt
    );
  }

  // Run all updates in a transaction
  const result = await ctx.prisma.$transaction(async (tx: any) => {
    // Update completion
    const updatedCompletion = await tx.taskCompletion.update({
      where: { id: completionId },
      data: {
        status: "APPROVED",
        approvedById: ctx.user?.id,
        approvedAt: new Date(),
        pointsAwarded,
        multiplierApplied,
      },
    });

    // Update kid's points balance
    if (pointsAwarded > 0) {
      await tx.kid.update({
        where: { id: completion.kid.id },
        data: {
          pointsBalance: { increment: pointsAwarded },
        },
      });
    }

    // Update streak
    if (streakUpdate && streakUpdate.wasIncremented) {
      await tx.streak.update({
        where: { kidId: completion.kid.id },
        data: {
          currentCount: streakUpdate.currentCount,
          longestCount: streakUpdate.longestCount,
          lastActiveDate: streakUpdate.lastActiveDate,
          currentTier: streakUpdate.currentTier,
        },
      });
    }

    return updatedCompletion;
  });

  // Check for new badges (outside transaction for performance)
  await checkAndAwardBadges(ctx, completion.kid.id);

  return ctx.prisma.taskCompletion.findUnique({
    where: { id: completionId },
    include: {
      task: true,
      kid: { include: { streak: true } },
      approvedBy: true,
    },
  });
}

/**
 * Check and award any new badges
 */
async function checkAndAwardBadges(ctx: any, kidId: string) {
  // Get kid stats
  const [
    totalTasksCompleted,
    timedTasksCompleted,
    familyTasksCompleted,
    beatTimerCount,
    totalPointsEarnedResult,
    redemptionCount,
    earnedBadges,
    allBadges,
  ] = await Promise.all([
    ctx.prisma.taskCompletion.count({
      where: { kidId, status: "APPROVED" },
    }),
    ctx.prisma.taskCompletion.count({
      where: {
        kidId,
        status: "APPROVED",
        task: { type: { in: ["TIMED", "BEAT_THE_TIMER"] } },
      },
    }),
    ctx.prisma.taskCompletion.count({
      where: {
        kidId,
        status: "APPROVED",
        task: { type: "FAMILY" },
      },
    }),
    ctx.prisma.timerSession.count({
      where: { kidId, beatTarget: true },
    }),
    ctx.prisma.taskCompletion.aggregate({
      where: { kidId, status: "APPROVED" },
      _sum: { pointsAwarded: true },
    }),
    ctx.prisma.redemption.count({
      where: { kidId, status: { in: ["APPROVED", "FULFILLED"] } },
    }),
    ctx.prisma.kidBadge.findMany({
      where: { kidId },
      select: { badge: { select: { slug: true } } },
    }),
    ctx.prisma.badge.findMany(),
  ]);

  const streak = await ctx.prisma.streak.findUnique({
    where: { kidId },
  });

  const stats: KidStats = {
    totalTasksCompleted,
    currentStreak: streak?.currentCount || 0,
    timedTasksCompleted,
    familyTasksCompleted,
    beatTimerCount,
    totalPointsEarned: totalPointsEarnedResult._sum.pointsAwarded || 0,
    redemptionCount,
  };

  const earnedSlugs = new Set<string>(earnedBadges.map((b: any) => b.badge.slug as string));

  const badges: Badge[] = allBadges.map((b: any) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    criteria: b.criteria as any,
  }));

  const newBadges = checkNewBadges(badges, earnedSlugs, stats);

  // Award new badges
  if (newBadges.length > 0) {
    await ctx.prisma.kidBadge.createMany({
      data: newBadges.map((badge) => ({
        kidId,
        badgeId: badge.id,
      })),
    });
  }

  return newBadges;
}
