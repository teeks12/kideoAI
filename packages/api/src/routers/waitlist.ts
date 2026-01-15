import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";

export const waitlistRouter = router({
  /**
   * Join the waitlist - public endpoint, no auth required
   */
  join: publicProcedure
    .input(
      z.object({
        email: z.string().email("Please enter a valid email address"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if email already exists
        const existing = await ctx.prisma.waitlist.findUnique({
          where: { email: input.email.toLowerCase() },
        });

        if (existing) {
          // Return success even if already on waitlist (don't reveal this info)
          return { success: true, message: "Thank you for joining our waitlist!" };
        }

        // Add to waitlist
        await ctx.prisma.waitlist.create({
          data: {
            email: input.email.toLowerCase(),
          },
        });

        return { success: true, message: "Thank you for joining our waitlist!" };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to join waitlist. Please try again.",
        });
      }
    }),
});
