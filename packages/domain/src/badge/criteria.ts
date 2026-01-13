export type BadgeCriteriaType =
  | "task_count"
  | "streak"
  | "timed_task_count"
  | "family_task_count"
  | "beat_timer_count"
  | "total_points_earned"
  | "redemption_count";

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  value: number;
}

export interface KidStats {
  totalTasksCompleted: number;
  currentStreak: number;
  timedTasksCompleted: number;
  familyTasksCompleted: number;
  beatTimerCount: number;
  totalPointsEarned: number;
  redemptionCount: number;
}

/**
 * Check if a kid's stats meet the criteria for a badge
 */
export function meetsCriteria(stats: KidStats, criteria: BadgeCriteria): boolean {
  switch (criteria.type) {
    case "task_count":
      return stats.totalTasksCompleted >= criteria.value;
    case "streak":
      return stats.currentStreak >= criteria.value;
    case "timed_task_count":
      return stats.timedTasksCompleted >= criteria.value;
    case "family_task_count":
      return stats.familyTasksCompleted >= criteria.value;
    case "beat_timer_count":
      return stats.beatTimerCount >= criteria.value;
    case "total_points_earned":
      return stats.totalPointsEarned >= criteria.value;
    case "redemption_count":
      return stats.redemptionCount >= criteria.value;
    default:
      return false;
  }
}

/**
 * Calculate progress toward a badge (0-100)
 */
export function calculateProgress(stats: KidStats, criteria: BadgeCriteria): number {
  let current: number;

  switch (criteria.type) {
    case "task_count":
      current = stats.totalTasksCompleted;
      break;
    case "streak":
      current = stats.currentStreak;
      break;
    case "timed_task_count":
      current = stats.timedTasksCompleted;
      break;
    case "family_task_count":
      current = stats.familyTasksCompleted;
      break;
    case "beat_timer_count":
      current = stats.beatTimerCount;
      break;
    case "total_points_earned":
      current = stats.totalPointsEarned;
      break;
    case "redemption_count":
      current = stats.redemptionCount;
      break;
    default:
      return 0;
  }

  if (criteria.value === 0) return 100;
  return Math.min(100, Math.round((current / criteria.value) * 100));
}
