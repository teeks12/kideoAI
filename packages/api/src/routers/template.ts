import { z } from "zod";
import { router, familyProcedure } from "../trpc";

export const templateRouter = router({
  /**
   * List all templates
   */
  list: familyProcedure.query(async ({ ctx }) => {
    return ctx.prisma.taskTemplate.findMany({
      orderBy: [{ ageMin: "asc" }, { sortOrder: "asc" }],
    });
  }),

  /**
   * Get templates for a specific age range
   */
  getByAge: familyProcedure
    .input(z.object({ age: z.number().int().min(0).max(18) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.taskTemplate.findMany({
        where: {
          ageMin: { lte: input.age },
          ageMax: { gte: input.age },
        },
        orderBy: { sortOrder: "asc" },
      });
    }),

  /**
   * Get a template by ID
   */
  get: familyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.taskTemplate.findUnique({
        where: { id: input.id },
      });
    }),
});
