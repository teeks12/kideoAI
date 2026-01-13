/**
 * Get start of day for a given date in a specific timezone
 * For simplicity, we'll work with UTC and expect the caller to handle timezone conversion
 */
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Calculate the number of calendar days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const d1 = getStartOfDay(date1);
  const d2 = getStartOfDay(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if a streak should be broken based on last active date
 * Streak breaks if more than 1 calendar day has passed
 */
export function shouldBreakStreak(
  lastActiveDate: Date | null,
  currentDate: Date = new Date()
): boolean {
  if (!lastActiveDate) return false;

  const daysDiff = daysBetween(lastActiveDate, currentDate);
  return daysDiff > 1;
}

/**
 * Check if today is a new day compared to last active date
 */
export function isNewDay(
  lastActiveDate: Date | null,
  currentDate: Date = new Date()
): boolean {
  if (!lastActiveDate) return true;

  const daysDiff = daysBetween(lastActiveDate, currentDate);
  return daysDiff >= 1;
}

export interface StreakUpdate {
  currentCount: number;
  longestCount: number;
  lastActiveDate: Date;
  currentTier: 1 | 2 | 3;
  wasIncremented: boolean;
  wasBroken: boolean;
}

/**
 * Calculate streak update based on task completion
 */
export function calculateStreakUpdate(
  currentStreak: {
    currentCount: number;
    longestCount: number;
    lastActiveDate: Date | null;
  },
  completionDate: Date = new Date()
): StreakUpdate {
  const { currentCount, longestCount, lastActiveDate } = currentStreak;

  // Check if streak is broken
  if (shouldBreakStreak(lastActiveDate, completionDate)) {
    // Streak was broken, start fresh
    return {
      currentCount: 1,
      longestCount: Math.max(longestCount, 1),
      lastActiveDate: completionDate,
      currentTier: 1,
      wasIncremented: true,
      wasBroken: true,
    };
  }

  // Check if this is a new day (can increment streak)
  if (isNewDay(lastActiveDate, completionDate)) {
    const newCount = currentCount + 1;
    const newTier = newCount >= 7 ? 3 : newCount >= 3 ? 2 : 1;

    return {
      currentCount: newCount,
      longestCount: Math.max(longestCount, newCount),
      lastActiveDate: completionDate,
      currentTier: newTier as 1 | 2 | 3,
      wasIncremented: true,
      wasBroken: false,
    };
  }

  // Same day, no change to streak count
  const tier = currentCount >= 7 ? 3 : currentCount >= 3 ? 2 : 1;
  return {
    currentCount,
    longestCount,
    lastActiveDate: lastActiveDate || completionDate,
    currentTier: tier as 1 | 2 | 3,
    wasIncremented: false,
    wasBroken: false,
  };
}

/**
 * Initialize a new streak for a kid
 */
export function createInitialStreak(): {
  currentCount: number;
  longestCount: number;
  lastActiveDate: null;
  currentTier: 1;
} {
  return {
    currentCount: 0,
    longestCount: 0,
    lastActiveDate: null,
    currentTier: 1,
  };
}
