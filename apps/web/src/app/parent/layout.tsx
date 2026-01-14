import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ParentNav } from "@/components/common/parent-nav";
import { prisma } from "@kideo/db";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Check if user has a family
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      familyMembers: {
        take: 1,
      },
    },
  });

  if (!user?.familyMembers.length) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ParentNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
