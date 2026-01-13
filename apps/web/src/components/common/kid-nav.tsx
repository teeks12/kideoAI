"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, Home, Gift, Award, Target } from "@kideo/ui";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/badges", label: "Badges", icon: Award },
];

export function KidNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center justify-center">
            <Link href="/home" className="text-2xl font-bold text-primary-600">
              Kideo
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-16 items-center justify-around">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                    isActive
                      ? "text-primary-600"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
