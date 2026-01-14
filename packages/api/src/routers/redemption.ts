import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, familyProcedure, parentFamilyProcedure } from "../trpc";

export const redemptionRouter = router({
  /**
   * Request a reward redemption (kid action)
   */
  request: familyProcedure
    .input(
      z.object({
        rewardId: z.string().cuid(),
        kidId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      // Verify reward exists and is active
      const reward = await ctx.prisma.reward.findFirst({
        where: {
          id: input.rewardId,
          familyId: ctx.family!.id,
          isActive: true,
        },
      });

      if (!reward) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reward not found or inactive",
        });
      }

      // Check if kid has enough points
      if (kid.pointsBalance < reward.pointsCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough points",
        });
      }

      // Create redemption
      const redemption = await ctx.prisma.redemption.create({
        data: {
          kidId: kid.id,
          rewardId: reward.id,
          pointsCost: reward.pointsCost,
          status: "PENDING",
        },
        include: {
          reward: true,
          kid: true,
        },
      });

      return redemption;
    }),

  /**
   * List pending redemptions (parent view)
   */
  listPending: parentFamilyProcedure.query(async ({ ctx }) => {
    return ctx.prisma.redemption.findMany({
      where: {
        reward: { familyId: ctx.family!.id },
        status: "PENDING",
      },
      include: {
        reward: true,
        kid: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }),

  /**
   * List redemptions for a kid
   */
  listForKid: familyProcedure
    .input(z.object({ kidId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.redemption.findMany({
        where: {
          kidId: input.kidId,
          reward: { familyId: ctx.family!.id },
        },
        include: {
          reward: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }),

  /**
   * Approve a redemption
   */
  approve: parentFamilyProcedure
    .input(z.object({ redemptionId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const redemption = await ctx.prisma.redemption.findFirst({
        where: {
          id: input.redemptionId,
          reward: { familyId: ctx.family!.id },
          status: "PENDING",
        },
        include: {
          reward: true,
          kid: true,
        },
      });

      if (!redemption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Redemption not found or already processed",
        });
      }

      // Verify kid still has enough points
      if (redemption.kid.pointsBalance < redemption.pointsCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kid no longer has enough points",
        });
      }

      // Update redemption and deduct points
      await ctx.prisma.$transaction([
        ctx.prisma.redemption.update({
          where: { id: redemption.id },
          data: {
            status: "APPROVED",
            approvedById: ctx.user!.id,
            approvedAt: new Date(),
          },
        }),
        ctx.prisma.kid.update({
          where: { id: redemption.kid.id },
          data: { pointsBalance: { decrement: redemption.pointsCost } },
        }),
      ]);

      return ctx.prisma.redemption.findUnique({
        where: { id: redemption.id },
        include: { reward: true, kid: true },
      });
    }),

  /**
   * Reject a redemption
   */
  reject: parentFamilyProcedure
    .input(
      z.object({
        redemptionId: z.string().cuid(),
        reason: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const redemption = await ctx.prisma.redemption.findFirst({
        where: {
          id: input.redemptionId,
          reward: { familyId: ctx.family!.id },
          status: "PENDING",
        },
      });

      if (!redemption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Redemption not found or already processed",
        });
      }

      return ctx.prisma.redemption.update({
        where: { id: redemption.id },
        data: {
          status: "REJECTED",
          approvedById: ctx.user!.id,
          approvedAt: new Date(),
        },
        include: { reward: true, kid: true },
      });
    }),

  /**
   * Mark redemption as fulfilled
   */
  fulfill: parentFamilyProcedure
    .input(z.object({ redemptionId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const redemption = await ctx.prisma.redemption.findFirst({
        where: {
          id: input.redemptionId,
          reward: { familyId: ctx.family!.id },
          status: "APPROVED",
        },
      });

      if (!redemption) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Redemption not found or not approved",
        });
      }

      return ctx.prisma.redemption.update({
        where: { id: redemption.id },
        data: {
          status: "FULFILLED",
          fulfilledAt: new Date(),
        },
        include: { reward: true, kid: true },
      });
    }),
});
