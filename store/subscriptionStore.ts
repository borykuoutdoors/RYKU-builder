'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlanId = 'explorer' | 'pro' | 'elite'

interface SubscriptionState {
  plan:    PlanId
  setPlan: (plan: PlanId) => void

  // Feature gates
  isProOrAbove:    () => boolean
  canSyncCloud:    () => boolean
  canExportPDF:    () => boolean
  canRequestQuotes:() => boolean
  maxSavedBuilds:  () => number
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'explorer',
      setPlan: (plan) => set({ plan }),

      isProOrAbove:     () => ['pro', 'elite'].includes(get().plan),
      canSyncCloud:     () => ['pro', 'elite'].includes(get().plan),
      canExportPDF:     () => ['pro', 'elite'].includes(get().plan),
      canRequestQuotes: () => ['pro', 'elite'].includes(get().plan),
      maxSavedBuilds:   () => get().plan === 'explorer' ? 3 : Infinity,
    }),
    { name: 'ryku.subscription.v1' }
  )
)
