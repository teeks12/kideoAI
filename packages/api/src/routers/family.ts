import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, parentFamilyProcedure } from "../trpc";
import { updateFamilySchema, familySettingsSchema } from "@kideo/validators";

export const familyRouter = router({
  /**
   * Get current family
   */
  get: parentFamilyProcedure.query(async ({ ctx }) => {
    return ctx.family;
  }),

  /**
   * Update family settings
   */
  update: parentFamilyProcedure
    .input(updateFamilySchema.omit({ id: true }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.family.update({
        where: { id: ctx.family!.id },
        data: input,
      });
    }),

  /**
   * Get family settings
   */
  getSettings: parentFamilyProcedure.query(async ({ ctx }) => {
    const settings = familySettingsSchema.parse({
      streakMultipliers: ctx.family!.streakMultipliers,
    });
    return settings;
  }),

  /**
   * Update family settings (streak multipliers)
   */
  updateSettings: parentFamilyProcedure
    .input(familySettingsSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.family.update({
        where: { id: ctx.family!.id },
        data: {
          streakMultipliers: input.streakMultipliers,
        },
      });
    }),

  /**
   * Get family members
   */
  getMembers: parentFamilyProcedure.query(async ({ ctx }) => {
    return ctx.prisma.familyMember.findMany({
      where: { familyId: ctx.family!.id },
      include: { user: true },
    });
  }),

  /**
   * Get family stats
   */
  getStats: parentFamilyProcedure.query(async ({ ctx }) => {
    const [kidsCount, activeTasksCount, pendingApprovalsCount, totalPointsIssued] =
      await Promise.all([
        ctx.prisma.kid.count({
          where: { familyId: ctx.family!.id },
        }),
        ctx.prisma.task.count({
          where: { familyId: ctx.family!.id, isActive: true },
        }),
        ctx.prisma.taskCompletion.count({
          where: {
            task: { familyId: ctx.family!.id },
            status: "PENDING",
          },
        }),
        ctx.prisma.kid.aggregate({
          where: { familyId: ctx.family!.id },
          _sum: { pointsBalance: true },
        }),
      ]);

    return {
      kidsCount,
      activeTasksCount,
      pendingApprovalsCount,
      totalPointsIssued: totalPointsIssued._sum.pointsBalance || 0,
    };
  }),
});
