import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KidNav } from "@/components/common/kid-nav";
import { prisma } from "@kideo/db";

export default async function KidLayout({
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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <KidNav />
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
