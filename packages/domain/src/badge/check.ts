import { meetsCriteria, calculateProgress, type BadgeCriteria, type KidStats } from "./criteria";

export interface Badge {
  id: string;
  slug: string;
  name: string;
  criteria: BadgeCriteria;
}

export interface EarnedBadge {
  badgeId: string;
  slug: string;
  name: string;
  earnedAt: Date;
}

/**
 * Check which badges a kid has newly earned
 * Returns badges that the kid qualifies for but hasn't earned yet
 */
export function checkNewBadges(
  allBadges: Badge[],
  earnedBadgeSlugs: Set<string>,
  stats: KidStats
): Badge[] {
  const newBadges: Badge[] = [];

  for (const badge of allBadges) {
    // Skip if already earned
    if (earnedBadgeSlugs.has(badge.slug)) {
      continue;
    }

    // Check if criteria is met
    if (meetsCriteria(stats, badge.criteria)) {
      newBadges.push(badge);
    }
  }

  return newBadges;
}

/**
 * Get all badges a kid qualifies for (including already earned)
 */
export function getQualifiedBadges(allBadges: Badge[], stats: KidStats): Badge[] {
  return allBadges.filter((badge) => meetsCriteria(stats, badge.criteria));
}

/**
 * Get badges that are close to being earned (>50% progress)
 */
export function getNearbyBadges(
  allBadges: Badge[],
  earnedBadgeSlugs: Set<string>,
  stats: KidStats,
  threshold: number = 50
): Array<{ badge: Badge; progress: number }> {
  const nearby: Array<{ badge: Badge; progress: number }> = [];

  for (const badge of allBadges) {
    // Skip if already earned
    if (earnedBadgeSlugs.has(badge.slug)) {
      continue;
    }

    // Skip if already qualified
    if (meetsCriteria(stats, badge.criteria)) {
      continue;
    }

    // Calculate progress
    const progress = calculateProgress(stats, badge.criteria);

    if (progress >= threshold) {
      nearby.push({ badge, progress });
    }
  }

  // Sort by progress descending
  return nearby.sort((a, b) => b.progress - a.progress);
}
