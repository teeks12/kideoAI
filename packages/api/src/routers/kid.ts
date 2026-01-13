import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, familyProcedure, parentFamilyProcedure } from "../trpc";
import { createKidSchema, updateKidSchema, verifyKidPinSchema } from "@kideo/validators";
import { createInitialStreak } from "@kideo/domain";

export const kidRouter = router({
  /**
   * Create a new kid profile
   */
  create: parentFamilyProcedure
    .input(createKidSchema)
    .mutation(async ({ ctx, input }) => {
      const kid = await ctx.prisma.kid.create({
        data: {
          ...input,
          familyId: ctx.family!.id,
        },
      });

      // Create initial streak for the kid
      const initialStreak = createInitialStreak();
      await ctx.prisma.streak.create({
        data: {
          kidId: kid.id,
          ...initialStreak,
        },
      });

      return kid;
    }),

  /**
   * Get a kid by ID
   */
  get: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const kid = await ctx.prisma.kid.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
        include: {
          streak: true,
          badges: {
            include: { badge: true },
          },
        },
      });

      if (!kid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kid not found",
        });
      }

      return kid;
    }),

  /**
   * List all kids in the family
   */
  list: familyProcedure.query(async ({ ctx }) => {
    return ctx.prisma.kid.findMany({
      where: { familyId: ctx.family!.id },
      include: {
        streak: true,
      },
      orderBy: { name: "asc" },
    });
  }),

  /**
   * Update a kid profile
   */
  update: parentFamilyProcedure
    .input(updateKidSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const kid = await ctx.prisma.kid.findFirst({
        where: {
          id,
          familyId: ctx.family!.id,
        },
      });

      if (!kid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kid not found",
        });
      }

      return ctx.prisma.kid.update({
        where: { id },
        data,
      });
    }),

  /**
   * Delete a kid profile
   */
  delete: parentFamilyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const kid = await ctx.prisma.kid.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
      });

      if (!kid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kid not found",
        });
      }

      return ctx.prisma.kid.delete({
        where: { id: input.id },
      });
    }),

  /**
   * Get kid stats
   */
  getStats: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const kid = await ctx.prisma.kid.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
        include: {
          streak: true,
        },
      });

      if (!kid) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kid not found",
        });
      }

      const [
        totalTasksCompleted,
        timedTasksCompleted,
        familyTasksCompleted,
        beatTimerCount,
        totalPointsEarned,
        redemptionCount,
        badgeCount,
      ] = await Promise.all([
        ctx.prisma.taskCompletion.count({
          where: { kidId: kid.id, status: "APPROVED" },
        }),
        ctx.prisma.taskCompletion.count({
          where: {
            kidId: kid.id,
            status: "APPROVED",
            task: { type: { in: ["TIMED", "BEAT_THE_TIMER"] } },
          },
        }),
        ctx.prisma.taskCompletion.count({
          where: {
            kidId: kid.id,
            status: "APPROVED",
            task: { type: "FAMILY" },
          },
        }),
        ctx.prisma.timerSession.count({
          where: {
            kidId: kid.id,
            beatTarget: true,
          },
        }),
        ctx.prisma.taskCompletion.aggregate({
          where: { kidId: kid.id, status: "APPROVED" },
          _sum: { pointsAwarded: true },
        }),
        ctx.prisma.redemption.count({
          where: { kidId: kid.id, status: { in: ["APPROVED", "FULFILLED"] } },
        }),
        ctx.prisma.kidBadge.count({
          where: { kidId: kid.id },
        }),
      ]);

      return {
        kid,
        stats: {
          totalTasksCompleted,
          timedTasksCompleted,
          familyTasksCompleted,
          beatTimerCount,
          totalPointsEarned: totalPointsEarned._sum.pointsAwarded || 0,
          redemptionCount,
          badgeCount,
          currentStreak: kid.streak?.currentCount || 0,
          longestStreak: kid.streak?.longestCount || 0,
        },
      };
    }),

  /**
   * Verify kid PIN
   */
  verifyPin: familyProcedure
    .input(verifyKidPinSchema)
    .mutation(async ({ ctx, input }) => {
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

      if (!kid.pin) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kid does not have a PIN set",
        });
      }

      if (kid.pin !== input.pin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid PIN",
        });
      }

      return { success: true, kidId: kid.id };
    }),
});
