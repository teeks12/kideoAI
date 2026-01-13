import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context, AuthContext } from "./context";
import type { User, Family, FamilyMember } from "@kideo/db";

/**
 * Initialize tRPC with context
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error ? error.cause.message : null,
      },
    };
  },
});

/**
 * Export router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public procedure - no auth required
 */
export const publicProcedure = t.procedure;

/**
 * Context types after middleware enforcement
 */
export interface AuthenticatedContext extends Context {
  auth: AuthContext;
  user: User;
}

export interface FamilyContext extends AuthenticatedContext {
  family: Family;
  membership: FamilyMember;
}

/**
 * Middleware to enforce authentication
 */
const enforceAuth = middleware(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found in database",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
      user: ctx.user,
    } as AuthenticatedContext,
  });
});

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(enforceAuth);

/**
 * Middleware to enforce parent role
 */
const enforceParent = middleware(async ({ ctx, next }) => {
  const user = (ctx as AuthenticatedContext).user;
  if (user?.role !== "PARENT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only parents can access this resource",
    });
  }

  return next({ ctx });
});

/**
 * Parent procedure - requires authentication + parent role
 */
export const parentProcedure = protectedProcedure.use(enforceParent);

/**
 * Middleware to enforce family membership
 */
const enforceFamilyMember = middleware(async ({ ctx, next }) => {
  const authCtx = ctx as AuthenticatedContext;

  if (!authCtx.auth?.orgId) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "No active family selected",
    });
  }

  if (!ctx.family) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Family not found",
    });
  }

  // Verify user is a member of this family
  const membership = await ctx.prisma.familyMember.findUnique({
    where: {
      userId_familyId: {
        userId: authCtx.user.id,
        familyId: ctx.family.id,
      },
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this family",
    });
  }

  return next({
    ctx: {
      ...ctx,
      family: ctx.family,
      membership,
    } as FamilyContext,
  });
});

/**
 * Family procedure - requires authentication + family membership
 */
export const familyProcedure = protectedProcedure.use(enforceFamilyMember);

/**
 * Parent family procedure - requires authentication + family membership + parent role
 */
export const parentFamilyProcedure = familyProcedure.use(enforceParent);

/**
 * Create a server-side caller
 */
export const createCallerFactory = t.createCallerFactory;
