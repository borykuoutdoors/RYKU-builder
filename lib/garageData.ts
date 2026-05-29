// ─── Types ─────────────────────────────────────────────────────────────────

export type BuildStatus = 'ACTIVE' | 'COMPLETED' | 'DRAFT'

export interface GarageVehicle {
  id:       string
  year:     number
  make:     string
  model:    string
  trim:     string
  emoji:    string
  color:    string
  mileage:  number
  addedAt:  string
}

export interface GarageBuild {
  id:           string
  vehicleId:    string
  name:         string
  status:       BuildStatus
  budget:       number
  spent:        number
  completionPct: number
  itemCount:    number
  lastUpdated:  string
  categories:  string[]
}

// ─── Mock data ──────────────────────────────────────────────────────────────

export const GARAGE_VEHICLES: GarageVehicle[] = [
  {
    id:      'v1',
    year:    2023,
    make:    'Toyota',
    model:   '4Runner',
    trim:    'TRD Pro',
    emoji:   '🚙',
    color:   'Lunar Rock',
    mileage: 12400,
    addedAt: '2024-02-14',
  },
  {
    id:      'v2',
    year:    2021,
    make:    'Ford',
    model:   'F-150',
    trim:    'Raptor',
    emoji:   '🛻',
    color:   'Velocity Blue',
    mileage: 34700,
    addedAt: '2024-05-01',
  },
]

export const GARAGE_BUILDS: GarageBuild[] = [
  {
    id:            'gb1',
    vehicleId:     'v1',
    name:          'GHOST RUNNER',
    status:        'ACTIVE',
    budget:        20000,
    spent:         14800,
    completionPct: 74,
    itemCount:     11,
    lastUpdated:   '2026-05-24',
    categories:    ['Suspension', 'Lighting', 'Roof Rack', 'RTT'],
  },
  {
    id:            'gb2',
    vehicleId:     'v1',
    name:          'DAILY ARMOR',
    status:        'DRAFT',
    budget:        8000,
    spent:         0,
    completionPct: 0,
    itemCount:     4,
    lastUpdated:   '2026-05-18',
    categories:    ['Armor', 'Recovery'],
  },
  {
    id:            'gb3',
    vehicleId:     'v2',
    name:          'EXPEDITION X1',
    status:        'COMPLETED',
    budget:        30000,
    spent:         28400,
    completionPct: 100,
    itemCount:     18,
    lastUpdated:   '2026-04-02',
    categories:    ['Suspension', 'Armor', 'Electrical', 'Recovery', 'Lighting'],
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<BuildStatus, { label: string; color: string; bg: string; dotColor: string }> = {
  ACTIVE: {
    label:    'ACTIVE',
    color:    'var(--green)',
    bg:       'rgba(155,191,106,0.08)',
    dotColor: 'var(--green)',
  },
  COMPLETED: {
    label:    'COMPLETED',
    color:    '#66FFFF',
    bg:       'rgba(102,255,255,0.08)',
    dotColor: '#66FFFF',
  },
  DRAFT: {
    label:    'DRAFT',
    color:    'rgba(243,237,226,0.40)',
    bg:       'rgba(255,255,255,0.04)',
    dotColor: 'rgba(255,255,255,0.28)',
  },
}

export function formatCurrency(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

export function formatMileage(n: number): string {
  return n.toLocaleString('en-US') + ' mi'
}

export function getVehicleBuilds(vehicleId: string): GarageBuild[] {
  return GARAGE_BUILDS.filter(b => b.vehicleId === vehicleId)
}

export function getVehicleTotalValue(vehicleId: string): number {
  return getVehicleBuilds(vehicleId).reduce((sum, b) => sum + b.spent, 0)
}
