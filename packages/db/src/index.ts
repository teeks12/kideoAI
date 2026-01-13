export { prisma, PrismaClient } from "./client";

// Re-export all Prisma types
export type {
  User,
  Family,
  FamilyMember,
  Kid,
  Task,
  TaskAssignment,
  TaskCompletion,
  TimerSession,
  Reward,
  Redemption,
  Badge,
  KidBadge,
  Streak,
  Goal,
  TaskTemplate,
} from "@prisma/client";

// Re-export enums
export {
  UserRole,
  TaskCategory,
  TaskType,
  TaskSchedule,
  CompletionStatus,
  RedemptionStatus,
  TimerStatus,
} from "@prisma/client";
