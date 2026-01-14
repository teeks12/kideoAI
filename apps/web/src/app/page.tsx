import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@kideo/ui";
import { prisma } from "@kideo/db";

export default async function HomePage() {
  const { userId } = await auth();

  // Check if user has a family
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        familyMembers: {
          take: 1,
        },
      },
    });

    const hasFamily = !!user?.familyMembers.length;

    // If logged in with a family, redirect to dashboard
    if (hasFamily) {
      return redirect("/parent/dashboard");
    }

    // If logged in but no family, redirect to onboarding
    return redirect("/onboarding");
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            Welcome to <span className="text-primary-600">Kideo</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Help your kids learn responsibility through fun tasks, rewards, and
            achievements. Build great habits together as a family.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/sign-up">
              <Button size="xl">Get Started Free</Button>
            </Link>
            <Link href="/auth/sign-in">
              <Button size="xl" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 text-4xl">✅</div>
              <h3 className="mb-2 text-lg font-semibold">Tasks & Chores</h3>
              <p className="text-sm text-gray-600">
                Create age-appropriate tasks for your kids with expected
                responsibilities and paid chores.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 text-4xl">🔥</div>
              <h3 className="mb-2 text-lg font-semibold">Streaks & Points</h3>
              <p className="text-sm text-gray-600">
                Kids earn points and build streaks. Consistency is rewarded with
                multipliers!
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 text-4xl">🎁</div>
              <h3 className="mb-2 text-lg font-semibold">Rewards</h3>
              <p className="text-sm text-gray-600">
                Define rewards your kids can redeem with their earned points.
                You approve everything.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
