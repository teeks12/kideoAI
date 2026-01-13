import { PrismaClient, TaskCategory, TaskType } from "@prisma/client";

const prisma = new PrismaClient();

// Badge definitions
const BADGES = [
  {
    slug: "first-task",
    name: "First Steps",
    description: "Completed your very first task!",
    iconEmoji: "🌟",
    criteria: { type: "task_count", value: 1 },
    sortOrder: 1,
  },
  {
    slug: "streak-3",
    name: "Getting Started",
    description: "Maintained a 3-day streak!",
    iconEmoji: "🔥",
    criteria: { type: "streak", value: 3 },
    sortOrder: 2,
  },
  {
    slug: "streak-7",
    name: "Week Warrior",
    description: "Maintained a 7-day streak!",
    iconEmoji: "💪",
    criteria: { type: "streak", value: 7 },
    sortOrder: 3,
  },
  {
    slug: "streak-30",
    name: "Monthly Master",
    description: "Maintained a 30-day streak!",
    iconEmoji: "👑",
    criteria: { type: "streak", value: 30 },
    sortOrder: 4,
  },
  {
    slug: "timer-master",
    name: "Timer Master",
    description: "Completed 5 timed tasks!",
    iconEmoji: "⏱️",
    criteria: { type: "timed_task_count", value: 5 },
    sortOrder: 5,
  },
  {
    slug: "family-helper",
    name: "Family Helper",
    description: "Completed 3 family tasks!",
    iconEmoji: "👨‍👩‍👧‍👦",
    criteria: { type: "family_task_count", value: 3 },
    sortOrder: 6,
  },
  {
    slug: "speed-demon",
    name: "Speed Demon",
    description: "Beat the timer 3 times!",
    iconEmoji: "⚡",
    criteria: { type: "beat_timer_count", value: 3 },
    sortOrder: 7,
  },
  {
    slug: "point-collector-100",
    name: "Coin Collector",
    description: "Earned 100 points total!",
    iconEmoji: "💰",
    criteria: { type: "total_points_earned", value: 100 },
    sortOrder: 8,
  },
  {
    slug: "point-collector-500",
    name: "Treasure Hunter",
    description: "Earned 500 points total!",
    iconEmoji: "💎",
    criteria: { type: "total_points_earned", value: 500 },
    sortOrder: 9,
  },
  {
    slug: "reward-redeemer",
    name: "Reward Winner",
    description: "Redeemed your first reward!",
    iconEmoji: "🎁",
    criteria: { type: "redemption_count", value: 1 },
    sortOrder: 10,
  },
];

// Age-appropriate task templates
const TASK_TEMPLATES = [
  // Ages 2-3
  {
    title: "Put toys in bins",
    description: "Clean up toys and put them in their bins",
    iconEmoji: "🧸",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 2,
    ageMax: 3,
    sortOrder: 1,
  },
  {
    title: "Help dust with a sock",
    description: "Put a sock on your hand and dust low surfaces",
    iconEmoji: "🧦",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 2,
    ageMax: 3,
    sortOrder: 2,
  },
  {
    title: "Put laundry in hamper",
    description: "Put dirty clothes in the laundry hamper",
    iconEmoji: "👕",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 2,
    ageMax: 3,
    sortOrder: 3,
  },

  // Ages 4-6
  {
    title: "Set the table",
    description: "Put plates, cups, and utensils on the table",
    iconEmoji: "🍽️",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 4,
    ageMax: 6,
    sortOrder: 10,
  },
  {
    title: "Water the plants",
    description: "Use a small watering can to water indoor plants",
    iconEmoji: "🌱",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 5,
    ageMin: 4,
    ageMax: 6,
    sortOrder: 11,
  },
  {
    title: "Help feed pets",
    description: "Help put food in pet bowls",
    iconEmoji: "🐕",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 4,
    ageMax: 6,
    sortOrder: 12,
  },
  {
    title: "Make your bed",
    description: "Pull up covers and arrange pillows",
    iconEmoji: "🛏️",
    category: TaskCategory.EXPECTED,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 0,
    ageMin: 4,
    ageMax: 6,
    sortOrder: 13,
  },

  // Ages 7-10
  {
    title: "Load the dishwasher",
    description: "Rinse dishes and load them into the dishwasher",
    iconEmoji: "🍽️",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 10,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 20,
  },
  {
    title: "Fold towels",
    description: "Fold clean towels and put them away",
    iconEmoji: "🧺",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 10,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 21,
  },
  {
    title: "Peel vegetables",
    description: "Help prepare dinner by peeling vegetables",
    iconEmoji: "🥕",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 15,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 22,
  },
  {
    title: "Read for 15 minutes",
    description: "Read a book for at least 15 minutes",
    iconEmoji: "📚",
    category: TaskCategory.EXPECTED,
    type: TaskType.TIMED,
    suggestedPoints: 0,
    timerDurationMinutes: 15,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 23,
  },
  {
    title: "Clean your room",
    description: "Tidy up your room - make bed, organize, vacuum",
    iconEmoji: "🧹",
    category: TaskCategory.PAID,
    type: TaskType.BEAT_THE_TIMER,
    suggestedPoints: 20,
    timerDurationMinutes: 20,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 24,
  },
  {
    title: "Take out trash",
    description: "Empty small trash cans and take the bag outside",
    iconEmoji: "🗑️",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 10,
    ageMin: 7,
    ageMax: 10,
    sortOrder: 25,
  },

  // Ages 11+
  {
    title: "Mow the lawn",
    description: "Mow the front and back lawn (with supervision)",
    iconEmoji: "🌿",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 50,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 30,
  },
  {
    title: "Wash the car",
    description: "Wash and dry the family car",
    iconEmoji: "🚗",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 40,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 31,
  },
  {
    title: "Cook a simple meal",
    description: "Prepare a simple meal for the family",
    iconEmoji: "👨‍🍳",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 30,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 32,
  },
  {
    title: "Do laundry",
    description: "Wash, dry, and fold a load of laundry",
    iconEmoji: "🧺",
    category: TaskCategory.PAID,
    type: TaskType.INDIVIDUAL,
    suggestedPoints: 25,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 33,
  },
  {
    title: "Homework time",
    description: "Complete homework for at least 30 minutes",
    iconEmoji: "📝",
    category: TaskCategory.EXPECTED,
    type: TaskType.TIMED,
    suggestedPoints: 0,
    timerDurationMinutes: 30,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 34,
  },
  {
    title: "Walk the dog",
    description: "Take the dog for a 20-minute walk",
    iconEmoji: "🐕‍🦺",
    category: TaskCategory.EXPECTED,
    type: TaskType.TIMED,
    suggestedPoints: 0,
    timerDurationMinutes: 20,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 35,
  },
  {
    title: "Babysit younger siblings",
    description: "Watch younger siblings for an hour",
    iconEmoji: "👶",
    category: TaskCategory.PAID,
    type: TaskType.TIMED,
    suggestedPoints: 30,
    timerDurationMinutes: 60,
    ageMin: 11,
    ageMax: 17,
    sortOrder: 36,
  },
];

async function seedBadges() {
  console.log("Seeding badges...");

  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: badge,
      create: badge,
    });
  }

  console.log(`Seeded ${BADGES.length} badges`);
}

async function seedTaskTemplates() {
  console.log("Seeding task templates...");

  for (const template of TASK_TEMPLATES) {
    const id = `template-${template.sortOrder}`;
    await prisma.taskTemplate.upsert({
      where: { id },
      update: template,
      create: { id, ...template },
    });
  }

  console.log(`Seeded ${TASK_TEMPLATES.length} task templates`);
}

async function main() {
  console.log("Starting database seed...");

  await seedBadges();
  await seedTaskTemplates();

  console.log("Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
