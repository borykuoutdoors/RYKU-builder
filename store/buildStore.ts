'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Vehicle } from '@/types/vehicle'
import type { Product } from '@/types/product'

export type BuildStep = 1 | 2 | 3 | 4 | 5 | 6

// Map purpose IDs → legacy mission strings
const PURPOSE_TO_MISSION: Record<string, string> = {
  p_camp:    'camping',
  p_over:    'overland',
  p_daily:   'daily',
  p_work:    'utility',
  p_offroad: 'offroad',
  p_travel:  'expedition',
  p_tow:     'utility',
  p_fam:     'daily',
  p_util:    'utility',
}

interface BuildState {
  // Config
  vehicle:     Vehicle | null
  year:        string
  trim:        string
  drive:       string
  mission:     string | null
  purposes:    string[]
  budget:      number
  items:       Record<string, Product>   // productId → Product
  step:        BuildStep
  buildName:   string
  summaryNote: string
  completed:   boolean

  // Computed (derived)
  gearTotal:       () => number
  laborTotal:      () => number
  buildTotal:      () => number
  remainingBudget: () => number
  budgetPercent:   () => number
  isOverBudget:    () => boolean
  hasRack:         () => boolean
  hasRTT:          () => boolean
  hasLights:       () => boolean
  hasWinch:        () => boolean
  hasArmor:        () => boolean
  hasSusp:         () => boolean
  hasWheels:       () => boolean

  // Actions
  setVehicle:      (v: Vehicle, year: string, trim: string, drive: string) => void
  setMission:      (m: string) => void
  setBudget:       (b: number) => void
  toggleItem:      (p: Product) => void
  removeItem:      (id: string) => void
  clearBuild:      () => void
  setStep:         (s: BuildStep) => void
  setBuildName:    (name: string) => void
  setSummaryNote:  (note: string) => void
  setCompleted:    (val: boolean) => void
  togglePurpose:   (id: string) => void
  setPurposes:     (ids: string[]) => void
}

export const useBuildStore = create<BuildState>()(
  persist(
    (set, get) => ({
      vehicle:     null,
      year:        '',
      trim:        '',
      drive:       '',
      mission:     null,
      purposes:    [],
      budget:      15000,
      items:       {},
      step:        1,
      buildName:   'MY BUILD',
      summaryNote: '',
      completed:   false,

      // ── Computed ────────────────────────────────────────────────────────
      gearTotal: () =>
        Object.values(get().items).reduce((sum, p) => sum + p.price, 0),

      laborTotal: () =>
        Object.values(get().items).reduce((sum, p) => sum + p.labor, 0),

      buildTotal: () => get().gearTotal() + get().laborTotal(),

      remainingBudget: () => get().budget - get().buildTotal(),

      budgetPercent: () => {
        const pct = (get().buildTotal() / get().budget) * 100
        return Math.min(pct, 100)
      },

      isOverBudget: () => get().remainingBudget() < 0,

      hasRack: () =>
        Object.values(get().items).some(p => p.category === 'Roof Racks'),

      hasRTT: () =>
        Object.values(get().items).some(p => p.category === 'Rooftop Tents'),

      hasLights: () =>
        Object.values(get().items).some(p => p.category === 'Lighting'),

      hasWinch: () =>
        Object.values(get().items).some(
          p => p.id === 'rc1' || p.id === 'rc2' || p.id === 'rc5'
        ),

      hasArmor: () =>
        Object.values(get().items).some(
          p => p.category === 'Armor & Protection' && (p.id === 'rc5' || p.id === 'ap3')
        ),

      hasSusp: () =>
        Object.values(get().items).some(p => p.category === 'Suspension'),

      hasWheels: () =>
        Object.values(get().items).some(p => p.category === 'Wheels & Tires'),

      // ── Actions ─────────────────────────────────────────────────────────
      setVehicle: (v, year, trim, drive) =>
        set({ vehicle: v, year, trim, drive, items: {} }),

      setMission: (m) => set({ mission: m }),

      togglePurpose: (id) =>
        set(state => {
          const next = state.purposes.includes(id)
            ? state.purposes.filter(p => p !== id)
            : [...state.purposes, id]
          const mission = next.length > 0 ? (PURPOSE_TO_MISSION[next[0]] ?? null) : null
          return { purposes: next, mission }
        }),

      setPurposes: (ids) =>
        set(() => {
          const mission = ids.length > 0 ? (PURPOSE_TO_MISSION[ids[0]] ?? null) : null
          return { purposes: ids, mission }
        }),

      setBudget: (b) => set({ budget: b }),

      toggleItem: (p) =>
        set(state => {
          const next = { ...state.items }
          if (next[p.id]) {
            delete next[p.id]
          } else {
            next[p.id] = p
          }
          return { items: next }
        }),

      removeItem: (id) =>
        set(state => {
          const next = { ...state.items }
          delete next[id]
          return { items: next }
        }),

      clearBuild: () =>
        set({ vehicle: null, year: '', trim: '', drive: '', mission: null,
              purposes: [], budget: 15000, items: {}, step: 1, buildName: 'MY BUILD',
              summaryNote: '', completed: false }),

      setStep: (s) => set({ step: s }),

      setBuildName:   (name) => set({ buildName: name }),
      setSummaryNote: (note) => set({ summaryNote: note }),
      setCompleted:   (val)  => set({ completed: val }),
    }),
    {
      name: 'ryku.build.v1',
      partialize: (s) => ({
        vehicle: s.vehicle, year: s.year, trim: s.trim, drive: s.drive,
        mission: s.mission, purposes: s.purposes, budget: s.budget, items: s.items,
        step: s.step, buildName: s.buildName,
        summaryNote: s.summaryNote, completed: s.completed,
      }),
    }
  )
)
