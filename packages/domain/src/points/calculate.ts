export interface StreakMultipliers {
  tier1: number; // 1-2 days
  tier2: number; // 3-6 days
  tier3: number; // 7+ days
}

export const DEFAULT_MULTIPLIERS: StreakMultipliers = {
  tier1: 1.0,
  tier2: 1.2,
  tier3: 1.5,
};

/**
 * Get the multiplier tier based on current streak count
 */
export function getStreakTier(streakCount: number): 1 | 2 | 3 {
  if (streakCount >= 7) return 3;
  if (streakCount >= 3) return 2;
  return 1;
}

/**
 * Get the multiplier value for a given streak count
 */
export function getMultiplierForStreak(
  streakCount: number,
  multipliers: StreakMultipliers = DEFAULT_MULTIPLIERS
): number {
  const tier = getStreakTier(streakCount);
  switch (tier) {
    case 3:
      return multipliers.tier3;
    case 2:
      return multipliers.tier2;
    default:
      return multipliers.tier1;
  }
}

/**
 * Calculate points with streak multiplier applied
 * Returns an integer (floor of the result)
 */
export function calculatePointsWithMultiplier(
  basePoints: number,
  streakCount: number,
  multipliers: StreakMultipliers = DEFAULT_MULTIPLIERS
): number {
  if (basePoints <= 0) return 0;

  const multiplier = getMultiplierForStreak(streakCount, multipliers);
  return Math.floor(basePoints * multiplier);
}

/**
 * Calculate bonus points for beat-the-timer tasks
 * Bonus is awarded if elapsed time is less than target time
 */
export function calculateBeatTimerBonus(
  targetMinutes: number,
  elapsedSeconds: number,
  bonusPoints: number
): number {
  const targetSeconds = targetMinutes * 60;
  if (elapsedSeconds < targetSeconds) {
    return bonusPoints;
  }
  return 0;
}

/**
 * Check if a kid has enough points for a redemption
 */
export function canAffordRedemption(
  currentBalance: number,
  cost: number
): boolean {
  return currentBalance >= cost;
}

/**
 * Calculate new balance after points operation
 * Returns 0 if result would be negative
 */
export function calculateNewBalance(
  currentBalance: number,
  pointsDelta: number
): number {
  const newBalance = currentBalance + pointsDelta;
  return Math.max(0, newBalance);
}
