import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, familyProcedure, parentFamilyProcedure } from "../trpc";

export const rewardRouter = router({
  /**
   * Create a new reward
   */
  create: parentFamilyProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        pointsCost: z.number().int().min(1).max(10000),
        iconEmoji: z.string().max(10).optional(),
        quantity: z.number().int().min(1).optional(),
        requiresApproval: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.reward.create({
        data: {
          ...input,
          familyId: ctx.family!.id,
        },
      });
    }),

  /**
   * Get a reward by ID
   */
  get: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const reward = await ctx.prisma.reward.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
      });

      if (!reward) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reward not found",
        });
      }

      return reward;
    }),

  /**
   * List rewards
   */
  list: familyProcedure
    .input(
      z.object({
        includeInactive: z.boolean().default(false),
      }).default({})
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.reward.findMany({
        where: {
          familyId: ctx.family!.id,
          isActive: input.includeInactive ? undefined : true,
        },
        orderBy: { pointsCost: "asc" },
      });
    }),

  /**
   * Update a reward
   */
  update: parentFamilyProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional().nullable(),
        pointsCost: z.number().int().min(1).max(10000).optional(),
        iconEmoji: z.string().max(10).optional().nullable(),
        quantity: z.number().int().min(1).optional().nullable(),
        isActive: z.boolean().optional(),
        requiresApproval: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const reward = await ctx.prisma.reward.findFirst({
        where: {
          id,
          familyId: ctx.family!.id,
        },
      });

      if (!reward) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reward not found",
        });
      }

      return ctx.prisma.reward.update({
        where: { id },
        data,
      });
    }),

  /**
   * Delete a reward
   */
  delete: parentFamilyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      const reward = await ctx.prisma.reward.findFirst({
        where: {
          id: input.id,
          familyId: ctx.family!.id,
        },
      });

      if (!reward) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reward not found",
        });
      }

      return ctx.prisma.reward.delete({
        where: { id: input.id },
      });
    }),
});
