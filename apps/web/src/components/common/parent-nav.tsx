"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn, Home, CheckCircle2, Users, Gift, Settings, Bell } from "@kideo/ui";
import { trpc } from "@/lib/trpc/client";

const navItems = [
  { href: "/parent/dashboard", label: "Dashboard", icon: Home },
  { href: "/parent/tasks", label: "Tasks", icon: CheckCircle2 },
  { href: "/parent/kids", label: "Kids", icon: Users },
  { href: "/parent/rewards", label: "Rewards", icon: Gift },
  { href: "/parent/approvals", label: "Approvals", icon: Bell },
  { href: "/parent/settings", label: "Settings", icon: Settings },
];

export function ParentNav() {
  const pathname = usePathname();
  const { data: family } = trpc.family.get.useQuery();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/parent/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">Kideo</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex md:gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {family && (
              <div className="hidden text-sm text-gray-600 sm:block">
                {family.name}
              </div>
            )}
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
