/**
 * lib/rank.ts — RYKU recommendation engine.
 * Exact port of build.html > rankRecommendations().
 * Match% = round(min(100, score / 2.5 * 100))
 */

import { recCategories, budgetTiers, type RecCategory, type BudgetTier } from './catalog'

// Map purpose IDs → scoring keys in RecCategory
const PURPOSE_KEY: Record<string, keyof RecCategory> = {
  p_camp:    'camp',
  p_over:    'over',
  p_daily:   'daily',
  p_work:    'work',
  p_offroad: 'off',
  p_travel:  'travel',
  p_tow:     'tow',
  p_fam:     'fam',
  p_util:    'util',
}

// High-budget bonus categories
const HIGH_BUDGET_BOOST = new Set(['r_susp', 'r_armor', 'r_power'])
// Low-budget penalty categories
const LOW_BUDGET_PENALTY = new Set(['r_tent', 'r_armor'])

export interface RankedCategory extends RecCategory {
  score:     number
  matchPct:  number
}

/**
 * Rank recommendation categories given selected purpose IDs and a budget tier ID.
 * Returns top-8 categories sorted by score descending, filtered to score > 0.5.
 */
export function rankRecommendations(
  purposeIds: string[],
  budgetTierId: string | null
): RankedCategory[] {
  const tier = budgetTiers.find(t => t.id === budgetTierId) ?? null

  return recCategories
    .map(cat => {
      let score = cat.base

      // Add per-purpose scores
      for (const pid of purposeIds) {
        const key = PURPOSE_KEY[pid]
        if (key) {
          score += (cat[key] as number) ?? 0
        }
      }

      // High-budget boost: if tier.max >= 10000 (or unlimited)
      if (tier && (tier.max >= 10000 || tier.max === 0) && HIGH_BUDGET_BOOST.has(cat.id)) {
        score += 0.4
      }

      // Low-budget penalty: if tier.max <= 2500
      if (tier && tier.max <= 2500 && tier.max > 0 && LOW_BUDGET_PENALTY.has(cat.id)) {
        score -= 0.4
      }

      const matchPct = Math.round(Math.min(100, (score / 2.5) * 100))

      return { ...cat, score, matchPct }
    })
    .filter(c => c.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}

/**
 * Returns a BudgetTier given a numeric budget value (for store compatibility).
 * Maps the store's numeric budget → nearest budgetTier id.
 */
export function budgetToTierId(budget: number): string {
  if (budget <= 2500)  return 'b_entry'
  if (budget <= 5000)  return 'b_mid'
  if (budget <= 10000) return 'b_serious'
  if (budget <= 20000) return 'b_full'
  return 'b_pro'
}

/**
 * Returns whether the build is "under-specified" (no purposes selected or no budget).
 */
export function isUnderSpecified(purposeIds: string[], budgetTierId: string | null): boolean {
  return purposeIds.length === 0 || budgetTierId === null
}
