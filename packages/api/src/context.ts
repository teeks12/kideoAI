import { prisma } from "@kideo/db";
import type { User, Family } from "@kideo/db";

/**
 * Auth context from Clerk
 */
export interface AuthContext {
  userId: string;
  orgId?: string | null;
  orgRole?: string | null;
}

/**
 * Full context available to tRPC procedures
 */
export interface Context {
  prisma: typeof prisma;
  auth: AuthContext | null;
  user: User | null;
  family: Family | null;
}

/**
 * Create context options (passed from Next.js)
 */
export interface CreateContextOptions {
  auth: AuthContext | null;
}

/**
 * Create context for tRPC procedures
 * This will be called for each request
 */
export async function createContext(opts: CreateContextOptions): Promise<Context> {
  const { auth } = opts;

  let user: User | null = null;
  let family: Family | null = null;

  // Load or create user if authenticated
  if (auth?.userId) {
    user = await prisma.user.findUnique({
      where: { clerkId: auth.userId },
    });

    // Auto-create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: auth.userId,
          email: `${auth.userId}@placeholder.local`, // Will be updated by webhook
          role: "PARENT",
        },
      });
    }
  }

  // Load family from user's family membership
  if (user) {
    const familyMember = await prisma.familyMember.findFirst({
      where: { userId: user.id },
      include: { family: true },
    });

    if (familyMember) {
      family = familyMember.family;
    }
  }

  return {
    prisma,
    auth,
    user,
    family,
  };
}

export type { Context as TRPCContext };
