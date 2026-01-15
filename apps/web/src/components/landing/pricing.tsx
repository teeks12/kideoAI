import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Everything you need to get started",
    price: "Free",
    period: "14-day Pro trial included",
    features: [
      "14-day Pro trial",
      "Unlimited kids",
      "Unlimited tasks",
      "AI task suggestions",
      "Points & streaks",
      "Rewards system",
      "Task timers",
    ],
    cta: "Join the Waitlist",
    ctaHref: "/waitlist",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For power families",
    price: "$9.99",
    period: "per month",
    features: [
      "Unlimited kids",
      "Unlimited tasks",
      "Advanced AI recommendations",
      "Unlimited badges",
      "Advanced analytics",
      "Custom task templates",
      "Priority support",
      "Early access to features",
    ],
    cta: "Coming Soon",
    ctaHref: "#",
    highlighted: true,
    badge: "Coming Soon",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Simple,{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Start free and upgrade when you need more. No hidden fees, no
              surprises.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-primary-600 to-secondary-600 text-white shadow-xl"
                    : "bg-gray-50"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 right-8 inline-flex items-center gap-1 rounded-full bg-warning-400 px-3 py-1 text-sm font-medium text-warning-900">
                    <Sparkles className="h-3 w-3" />
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3
                    className={`text-2xl font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={
                      plan.highlighted ? "text-primary-100" : "text-gray-600"
                    }
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className={`text-5xl font-bold ${
                      plan.highlighted ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted ? "text-primary-100" : "text-gray-500"
                    }
                  >
                    {" "}
                    / {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          plan.highlighted
                            ? "bg-white/20"
                            : "bg-success-100"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            plan.highlighted
                              ? "text-white"
                              : "text-success-600"
                          }`}
                        />
                      </div>
                      <span
                        className={
                          plan.highlighted ? "text-primary-50" : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.highlighted ? (
                  <Button
                    size="lg"
                    className="w-full bg-white font-semibold text-primary-600 hover:bg-gray-100"
                    disabled
                  >
                    {plan.cta}
                  </Button>
                ) : (
                  <Link href={plan.ctaHref}>
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse-glow font-semibold"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Launch notice */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Join the waitlist to get early access when we launch. Free plan
            includes AI-powered suggestions.
          </p>
        </div>
      </div>
    </section>
  );
}
