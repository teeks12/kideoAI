import {
  BellOff,
  Heart,
  Sparkles,
  ShieldCheck,
  Split,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: BellOff,
    title: "Less Nagging, More Independence",
    description:
      "Kids know exactly what's expected. No more constant reminders—they check their tasks and take ownership.",
    color: "primary",
  },
  {
    icon: Heart,
    title: "Teaches Real Responsibility",
    description:
      "Not just about earning rewards. Kids learn that some tasks are done because they're part of the family.",
    color: "secondary",
  },
  {
    icon: Sparkles,
    title: "Fun That Builds Habits",
    description:
      "Gamification keeps it exciting. Points, streaks, badges, and timers make boring chores feel like achievements.",
    color: "success",
  },
  {
    icon: ShieldCheck,
    title: "Parent Approved, Kid Loved",
    description:
      "You stay in full control with approval workflows, while kids love the interactive experience and rewards.",
    color: "warning",
  },
  {
    icon: Split,
    title: "Expected vs Paid Chores",
    description:
      "Our unique approach teaches kids the difference between family contributions and tasks that earn rewards.",
    color: "error",
  },
  {
    icon: Users,
    title: "Works for All Ages 2-18+",
    description:
      "Age-appropriate templates and customization mean Kideo grows with your family from toddlers to teens.",
    color: "primary",
  },
];

export function Benefits() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Why Families Love{" "}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Kideo
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              More than just a chore tracker. A complete system for building
              responsibility and strengthening family bonds.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              const colorClasses = {
                primary: "bg-primary-100 text-primary-600",
                secondary: "bg-secondary-100 text-secondary-600",
                success: "bg-success-100 text-success-600",
                warning: "bg-warning-100 text-warning-600",
                error: "bg-error-100 text-error-600",
              }[benefit.color];

              return (
                <div
                  key={idx}
                  className="group rounded-2xl bg-gray-50 p-6 transition-all hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
