import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, ListPlus, PartyPopper } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Parents Set Up Tasks",
    description:
      "Create age-appropriate tasks and rewards for each child. Choose from templates or customize your own. Define what's expected vs what earns points.",
    icon: ListPlus,
    color: "primary",
  },
  {
    number: "02",
    title: "Kids Complete & Earn",
    description:
      "Kids view their daily tasks, complete them with optional timers, and watch their points and streaks grow. Every completion builds responsibility.",
    icon: UserPlus,
    color: "secondary",
  },
  {
    number: "03",
    title: "Family Celebrates Together",
    description:
      "Parents approve completions, kids redeem rewards, and everyone celebrates wins. Watch badges unlock and habits stick as your family grows stronger.",
    icon: PartyPopper,
    color: "success",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get started in minutes. Three simple steps to transform chores into
              fun, rewarding experiences.
            </p>
          </div>

          {/* Steps */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const colorClasses = {
                primary: "bg-primary-500",
                secondary: "bg-secondary-500",
                success: "bg-success-500",
              }[step.color];

              const bgColorClasses = {
                primary: "bg-primary-100",
                secondary: "bg-secondary-100",
                success: "bg-success-100",
              }[step.color];

              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Connector line (hidden on mobile) */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-[50%] top-16 hidden h-0.5 w-full bg-gray-300 md:block" />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 mb-6">
                    <div
                      className={`flex h-32 w-32 items-center justify-center rounded-full ${bgColorClasses}`}
                    >
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full ${colorClasses} shadow-lg`}
                      >
                        <Icon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    {/* Step number */}
                    <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-gray-100">
                      <span className="text-sm font-bold text-gray-900">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/waitlist">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-orange-500 to-purple-500 animate-pulse-glow px-8 text-lg font-semibold"
              >
                Join the Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
