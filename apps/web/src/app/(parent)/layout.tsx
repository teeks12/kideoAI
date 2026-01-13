import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ParentNav } from "@/components/common/parent-nav";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!orgId) {
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
