'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types/product'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SavedBuildStatus = 'ACTIVE' | 'DRAFT' | 'COMPLETED'

export interface SavedBuild {
  id:            string
  name:          string
  vehicleId:     string
  vehicleName:   string
  vehicleEmoji:  string
  year:          string
  trim:          string
  status:        SavedBuildStatus
  budget:        number
  spent:         number
  items:         Record<string, Product>
  itemCount:     number
  mission:       string | null
  purposes:      string[]
  summaryNote:   string
  categories:    string[]
  completionPct: number
  savedAt:       string
  updatedAt:     string
  source?:       { type: 'planner' | 'community'; originalId?: string; originalName?: string }
}

interface GarageState {
  builds:        SavedBuild[]
  savedProducts: Product[]

  addBuild:       (build: SavedBuild) => void
  updateBuild:    (id: string, updates: Partial<SavedBuild>) => void
  deleteBuild:    (id: string) => void
  getBuildById:   (id: string) => SavedBuild | undefined

  saveProduct:    (product: Product) => void
  unsaveProduct:  (id: string) => void
  isProductSaved: (id: string) => boolean
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGarageStore = create<GarageState>()(
  persist(
    (set, get) => ({
      builds:        [],
      savedProducts: [],

      addBuild: (build) => set(s => ({
        builds: [build, ...s.builds.filter(b => b.id !== build.id)],
      })),

      updateBuild: (id, updates) => set(s => ({
        builds: s.builds.map(b =>
          b.id === id
            ? { ...b, ...updates, updatedAt: new Date().toISOString().slice(0, 10) }
            : b
        ),
      })),

      deleteBuild: (id) => set(s => ({
        builds: s.builds.filter(b => b.id !== id),
      })),

      getBuildById: (id) => get().builds.find(b => b.id === id),

      saveProduct: (product) => set(s => {
        if (s.savedProducts.some(p => p.id === product.id)) return s
        return { savedProducts: [product, ...s.savedProducts] }
      }),

      unsaveProduct: (id) => set(s => ({
        savedProducts: s.savedProducts.filter(p => p.id !== id),
      })),

      isProductSaved: (id) => get().savedProducts.some(p => p.id === id),
    }),
    { name: 'ryku.garage.v1' }
  )
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildFromPlannerState(state: {
  vehicle:     { id: string; name: string; emoji: string } | null
  year:        string
  trim:        string
  mission:     string | null
  purposes:    string[]
  budget:      number
  items:       Record<string, Product>
  buildName:   string
  summaryNote: string
  gearTotal:   () => number
  laborTotal:  () => number
}): SavedBuild {
  const now    = new Date().toISOString().slice(0, 10)
  const items  = state.items
  const spent  = state.gearTotal() + state.laborTotal()
  const cats   = Array.from(new Set(Object.values(items).map(p => p.category))) as string[]
  const pct    = state.budget > 0
    ? Math.min(100, Math.round((spent / state.budget) * 100))
    : 0

  return {
    id:            `build_${Date.now()}`,
    name:          state.buildName || 'My Build',
    vehicleId:     state.vehicle?.id  ?? 'unknown',
    vehicleName:   state.vehicle?.name ?? 'Unknown Vehicle',
    vehicleEmoji:  state.vehicle?.emoji ?? '🚗',
    year:          state.year,
    trim:          state.trim,
    status:        'COMPLETED',
    budget:        state.budget,
    spent,
    items,
    itemCount:     Object.keys(items).length,
    mission:       state.mission,
    purposes:      state.purposes,
    summaryNote:   state.summaryNote,
    categories:    cats,
    completionPct: pct,
    savedAt:       now,
    updatedAt:     now,
    source:        { type: 'planner' },
  }
}
