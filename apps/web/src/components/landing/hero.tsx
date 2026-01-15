"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Star,
  ListChecks,
  Gift,
  Flame,
  Trophy,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white pt-24 sm:pt-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      <div className="container relative mx-auto px-4 pb-16 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                AI-Powered • Coming Soon
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              AI-Powered Chores,{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Made Fun
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600 lg:mx-0">
              Our AI suggests age-appropriate tasks and rewards tailored to your
              child&apos;s interests. Build responsibility through fun streaks,
              points, and achievements - no more nagging!
            </p>

            {/* CTAs */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/waitlist">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-orange-500 to-purple-500 animate-pulse-glow text-base font-semibold shadow-lg transition-all hover:shadow-xl sm:w-auto"
                >
                  Join the Waitlist
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 text-base font-semibold sm:w-auto"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-500" />
                <span>Age-appropriate chores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-500" />
                <span>Builds responsibility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success-500" />
                <span>Less nagging, less conflict</span>
              </div>
            </div>
          </div>

          {/* Right: App Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:mx-0">
            {/* Phone frame mockup */}
            <div className="relative rounded-[2.5rem] bg-gray-900 p-3 shadow-2xl">
              <div className="rounded-[2rem] bg-white p-4">
                {/* Status bar mockup */}
                <div className="mb-4 flex items-center justify-between px-2">
                  <span className="text-xs font-medium text-gray-500">9:41</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-4 rounded-sm bg-gray-400" />
                    <div className="h-2 w-2 rounded-sm bg-gray-400" />
                  </div>
                </div>

                {/* App header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Good morning,</p>
                    <h2 className="text-xl font-bold text-gray-900">Emma! 👋</h2>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1">
                    <Star className="h-4 w-4 fill-primary-500 text-primary-500" />
                    <span className="font-bold text-primary-700">245</span>
                  </div>
                </div>

                {/* Streak card */}
                <div className="mb-4 rounded-2xl bg-gradient-to-r from-secondary-500 to-secondary-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-100">Current Streak</p>
                      <p className="text-2xl font-bold">7 Days 🔥</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary-100">Multiplier</p>
                      <p className="text-2xl font-bold">1.5x</p>
                    </div>
                  </div>
                </div>

                {/* Today's tasks */}
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Today&apos;s Tasks</h3>
                  <span className="text-sm text-gray-500">3 remaining</span>
                </div>

                {/* Task items */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-success-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-500">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Make bed</p>
                      <p className="text-sm text-gray-500">Part of being in the family • Done!</p>
                    </div>
                    <span className="text-lg">✓</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                      <ListChecks className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Feed the dog</p>
                      <p className="text-sm text-gray-500">Part of being in the family</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100">
                      <Gift className="h-5 w-5 text-warning-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Clean room</p>
                      <p className="text-sm text-gray-500">Earn rewards • 25 pts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges - hidden on mobile to prevent overflow */}
            <div className="absolute -left-4 top-1/4 hidden rounded-xl bg-white p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100">
                  <Flame className="h-4 w-4 text-secondary-600" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">7-Day Streak!</p>
                  <p className="text-xs text-gray-500">Keep it going</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 hidden rounded-xl bg-white p-3 shadow-lg sm:block">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <Trophy className="h-4 w-4 text-primary-600" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Badge Unlocked</p>
                  <p className="text-xs text-gray-500">Super Helper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
