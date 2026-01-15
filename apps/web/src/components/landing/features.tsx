import {
  ListChecks,
  Flame,
  Gift,
  Timer,
  Award,
  Shield,
  CheckCircle2,
  Star,
  Clock,
  Trophy,
  Sparkles,
} from "lucide-react";

const features = [
  {
    id: "ai",
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description:
      "Our AI learns your child's age, interests, and habits to suggest perfect tasks and rewards. No more guessing what chores are appropriate - let AI do the thinking.",
    highlights: [
      "Age-appropriate task suggestions",
      "Personalized reward ideas",
      "Interest-based recommendations",
      "Adapts as your child grows",
    ],
    color: "primary",
    mockup: "ai",
  },
  {
    id: "tasks",
    icon: ListChecks,
    title: "Smart Task Management",
    description:
      "Create age-appropriate chores with our intuitive task builder. Distinguish between expected family responsibilities and paid tasks that earn points.",
    highlights: [
      "Expected vs Paid chores distinction",
      "Age-specific templates (2-18+)",
      "Daily, weekly, or ad-hoc scheduling",
      "Custom point values",
    ],
    color: "secondary",
    mockup: "tasks",
  },
  {
    id: "streaks",
    icon: Flame,
    title: "Streaks & Multipliers",
    description:
      "Kids build daily streaks and unlock point multipliers. Consistency is rewarded - watch motivation soar as streaks grow!",
    highlights: [
      "Daily streak tracking",
      "1.2x multiplier at 3 days",
      "1.5x multiplier at 7+ days",
      "Visual progress celebration",
    ],
    color: "secondary",
    mockup: "streaks",
  },
  {
    id: "rewards",
    icon: Gift,
    title: "Rewards Shop",
    description:
      "Kids redeem points for rewards you define and approve. From screen time to special treats - you stay in full control.",
    highlights: [
      "Custom reward creation",
      "Parent approval required",
      "Redemption limits (weekly, etc.)",
      "Point cost control",
    ],
    color: "success",
    mockup: "rewards",
  },
  {
    id: "timers",
    icon: Timer,
    title: "Focus Timers",
    description:
      "Perfect for reading, cleaning, or homework. Kids start a timer and stay focused until the minimum time is reached.",
    highlights: [
      "Minimum time requirements",
      "Pause and resume",
      "Beat-the-timer challenges",
      "Automatic completion",
    ],
    color: "warning",
    mockup: "timers",
  },
];

function AIMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">AI Suggestions</h4>
          <p className="text-xs text-gray-500">For Emma, age 8</p>
        </div>
      </div>
      <div className="mb-4 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 p-3">
        <p className="text-sm text-gray-600">Based on Emma&apos;s interests in <span className="font-medium text-primary-600">art</span> and <span className="font-medium text-primary-600">animals</span>:</p>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Organize art supplies</p>
              <p className="text-xs text-primary-600">AI suggested • Paid • 20 pts</p>
            </div>
            <span className="text-sm">+</span>
          </div>
        </div>
        <div className="rounded-xl border-2 border-primary-200 bg-primary-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Brush the dog</p>
              <p className="text-xs text-primary-600">AI suggested • Expected</p>
            </div>
            <span className="text-sm">+</span>
          </div>
        </div>
        <div className="rounded-xl border-2 border-secondary-200 bg-secondary-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Drawing session reward</p>
              <p className="text-xs text-secondary-600">Suggested reward • 100 pts</p>
            </div>
            <span className="text-sm">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Today&apos;s Tasks</h4>
        <span className="text-sm text-gray-500">4 tasks</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
            <ListChecks className="h-4 w-4 text-primary-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Make bed</p>
            <p className="text-xs text-gray-500">Expected</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-success-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-500">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Feed the dog</p>
            <p className="text-xs text-gray-500">Expected • Done!</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-100">
            <Star className="h-4 w-4 text-warning-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Clean room</p>
            <p className="text-xs text-gray-500">Paid • 25 pts</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning-100">
            <Star className="h-4 w-4 text-warning-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Take out trash</p>
            <p className="text-xs text-gray-500">Paid • 15 pts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StreaksMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-600 p-4 text-white">
        <p className="text-sm text-secondary-100">Current Streak</p>
        <p className="text-3xl font-bold">7 Days 🔥</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-sm">1.5x multiplier active!</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div key={i} className="text-center">
            <p className="mb-1 text-xs text-gray-500">{day}</p>
            <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${
              i < 7 ? "bg-secondary-500" : "bg-gray-200"
            }`}>
              {i < 7 && <Flame className="h-4 w-4 text-white" />}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-gray-50 p-3">
        <p className="text-sm text-gray-600">Next milestone: <span className="font-semibold text-gray-900">14 days</span></p>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-1/2 rounded-full bg-secondary-500" />
        </div>
      </div>
    </div>
  );
}

function RewardsMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Rewards Shop</h4>
        <div className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-1">
          <Star className="h-3 w-3 fill-primary-500 text-primary-500" />
          <span className="text-sm font-bold text-primary-700">245</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border-2 border-success-200 bg-success-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <p className="font-medium text-gray-900">30 min Screen Time</p>
                <p className="text-sm text-success-600">You can afford this!</p>
              </div>
            </div>
            <span className="font-bold text-success-600">50 pts</span>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍦</span>
              <div>
                <p className="font-medium text-gray-900">Ice Cream Trip</p>
                <p className="text-sm text-gray-500">Need 55 more pts</p>
              </div>
            </div>
            <span className="font-bold text-gray-400">300 pts</span>
          </div>
        </div>
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎬</span>
              <div>
                <p className="font-medium text-gray-900">Movie Night Pick</p>
                <p className="text-sm text-gray-500">Need 155 more pts</p>
              </div>
            </div>
            <span className="font-bold text-gray-400">400 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimersMockup() {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-500">Reading Time</p>
        <p className="text-4xl font-bold text-gray-900">12:34</p>
        <p className="text-sm text-gray-500">of 15:00 minimum</p>
      </div>
      <div className="mb-4">
        <div className="h-3 rounded-full bg-gray-200">
          <div className="h-3 w-[83%] rounded-full bg-gradient-to-r from-warning-400 to-warning-500" />
        </div>
      </div>
      <div className="mb-4 flex items-center justify-center gap-4">
        <button className="rounded-full bg-gray-100 p-3">
          <Clock className="h-5 w-5 text-gray-600" />
        </button>
        <button className="rounded-full bg-warning-500 p-4 shadow-lg">
          <Timer className="h-6 w-6 text-white" />
        </button>
        <button className="rounded-full bg-gray-100 p-3">
          <CheckCircle2 className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="rounded-lg bg-warning-50 p-3 text-center">
        <p className="text-sm text-warning-700">
          <Trophy className="mr-1 inline h-4 w-4" />
          Beat the timer for +10 bonus points!
        </p>
      </div>
    </div>
  );
}

export function Features() {
  const mockups: Record<string, React.ReactNode> = {
    ai: <AIMockup />,
    tasks: <TasksMockup />,
    streaks: <StreaksMockup />,
    rewards: <RewardsMockup />,
    timers: <TimersMockup />,
  };

  return (
    <section id="features" className="bg-gray-50 py-20 sm:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everything You Need to Build{" "}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Responsible Kids
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Powerful features designed to make chores fun, build lasting habits,
              and give you full control as a parent.
            </p>
          </div>

          {/* Feature rows */}
          <div className="space-y-20">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isReversed = idx % 2 === 1;
              const colorClasses: Record<string, string> = {
                primary: "bg-primary-100 text-primary-600",
                secondary: "bg-secondary-100 text-secondary-600",
                success: "bg-success-100 text-success-600",
                warning: "bg-warning-100 text-warning-600",
              };
              const dotClasses: Record<string, string> = {
                primary: "bg-primary-500",
                secondary: "bg-secondary-500",
                success: "bg-success-500",
                warning: "bg-warning-500",
              };

              return (
                <div
                  key={feature.id}
                  className={`grid items-center gap-12 lg:grid-cols-2 ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={isReversed ? "lg:order-2" : ""}>
                    <div className="mb-4 inline-flex">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[feature.color]}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>

                    <h3 className="mb-4 text-3xl font-bold text-gray-900">
                      {feature.title}
                    </h3>

                    <p className="mb-6 text-lg text-gray-600">
                      {feature.description}
                    </p>

                    <ul className="space-y-3">
                      {feature.highlights.map((highlight, hidx) => (
                        <li key={hidx} className="flex items-center gap-3">
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full ${colorClasses[feature.color]}`}
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${dotClasses[feature.color]}`}
                            />
                          </div>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mockup */}
                  <div className={`flex justify-center ${isReversed ? "lg:order-1" : ""}`}>
                    <div className="w-full max-w-sm">
                      {mockups[feature.mockup]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional features bar */}
          <div className="mt-20 grid gap-6 rounded-2xl bg-white p-8 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <Award className="h-6 w-6 text-primary-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Badges</h4>
              <p className="text-sm text-gray-500">Celebrate milestones</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100">
                <Shield className="h-6 w-6 text-secondary-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Parent Control</h4>
              <p className="text-sm text-gray-500">Full oversight</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-success-100">
                <CheckCircle2 className="h-6 w-6 text-success-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Approvals</h4>
              <p className="text-sm text-gray-500">Review completions</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-warning-100">
                <Trophy className="h-6 w-6 text-warning-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Goals</h4>
              <p className="text-sm text-gray-500">Track progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
