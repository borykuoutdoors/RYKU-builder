// ─── Types ─────────────────────────────────────────────────────────────────

export type BuildCategory =
  | 'OVERLAND'
  | 'EXPEDITION'
  | 'TACTICAL'
  | 'CAMPING'
  | 'RECOVERY'
  | 'DAILY DRIVER'
  | 'WORK TRUCK'

export type BuilderTier = 'EXPLORER' | 'PRO' | 'ELITE'

export interface InstalledByInfo {
  shopName: string
  location: string
  shopId?:  string
}

export interface CommunityBuild {
  id:            string
  builderName:   string
  builderHandle: string
  builderTier:   BuilderTier
  isVerified:    boolean
  buildName:     string
  vehicleEmoji:  string
  vehicleName:   string
  year:          number
  category:      BuildCategory
  buildValue:    number
  likes:         number
  comments:      number
  views:         number
  tags:          string[]
  featuredPhoto: string | null
  isBotm:        boolean
  installedBy?:  InstalledByInfo
}

export interface FeaturedBuilder {
  id:         string
  name:       string
  handle:     string
  tier:       BuilderTier
  isVerified: boolean
  buildCount: number
  totalLikes: number
  specialty:  string
  emoji:      string
}

export interface LeaderboardEntry {
  rank:    number
  name:    string
  handle:  string
  tier:    BuilderTier
  votes:   number
  delta:   number
  emoji:   string
}

// ─── Community builds ───────────────────────────────────────────────────────

export const COMMUNITY_BUILDS: CommunityBuild[] = [
  {
    id: 'b1',
    builderName: 'Marcus Webb',
    builderHandle: 'mwebb_overland',
    builderTier: 'ELITE',
    isVerified: true,
    buildName: 'GHOST RUNNER',
    vehicleEmoji: '🚙',
    vehicleName: '2023 Toyota 4Runner TRD Pro',
    year: 2023,
    category: 'OVERLAND',
    buildValue: 42800,
    likes: 1247,
    comments: 89,
    views: 18400,
    tags: ['Suspension', 'Roof Rack', 'Lighting', 'RTT'],
    featuredPhoto: null,
    isBotm: true,
    installedBy: { shopName: 'Rocky Mountain Rigs', location: 'Denver, CO', shopId: 'i3' },
  },
  {
    id: 'b2',
    builderName: 'Sierra Cole',
    builderHandle: 'sierra.builds',
    builderTier: 'PRO',
    isVerified: true,
    buildName: 'EXPEDITION X1',
    vehicleEmoji: '🛻',
    vehicleName: '2024 Ford F-150 Raptor',
    year: 2024,
    category: 'EXPEDITION',
    buildValue: 31500,
    likes: 834,
    comments: 62,
    views: 11200,
    tags: ['Armor', 'Recovery', 'Electrical', 'Tires'],
    featuredPhoto: null,
    isBotm: false,
    installedBy: { shopName: 'Pacific Overland', location: 'Portland, OR', shopId: 'i1' },
  },
  {
    id: 'b3',
    builderName: 'Ryan Torres',
    builderHandle: 'rt_tactical',
    builderTier: 'PRO',
    isVerified: false,
    buildName: 'IRONCLAD',
    vehicleEmoji: '🚗',
    vehicleName: '2022 Jeep Wrangler Rubicon',
    year: 2022,
    category: 'TACTICAL',
    buildValue: 28700,
    likes: 612,
    comments: 47,
    views: 8900,
    tags: ['Bumpers', 'Winch', 'Skid Plates', 'Lift'],
    featuredPhoto: null,
    isBotm: false,
    installedBy: { shopName: 'Desert Armor Works', location: 'Phoenix, AZ', shopId: 'i2' },
  },
  {
    id: 'b4',
    builderName: 'Leah Nakamura',
    builderHandle: 'leah_camps',
    builderTier: 'PRO',
    isVerified: true,
    buildName: 'STARGAZER',
    vehicleEmoji: '🚙',
    vehicleName: '2023 Land Rover Defender 110',
    year: 2023,
    category: 'CAMPING',
    buildValue: 38200,
    likes: 998,
    comments: 74,
    views: 14600,
    tags: ['RTT', 'Kitchen', 'Solar', 'Fridge'],
    featuredPhoto: null,
    isBotm: false,
  },
  {
    id: 'b5',
    builderName: 'Drew Hollis',
    builderHandle: 'drew.rig',
    builderTier: 'EXPLORER',
    isVerified: false,
    buildName: 'RESCUE OPS',
    vehicleEmoji: '🚙',
    vehicleName: '2021 Toyota Tacoma TRD Off-Road',
    year: 2021,
    category: 'RECOVERY',
    buildValue: 14300,
    likes: 321,
    comments: 28,
    views: 4100,
    tags: ['Winch', 'Hi-Lift', 'Recovery Boards', 'Tow Straps'],
    featuredPhoto: null,
    isBotm: false,
  },
  {
    id: 'b6',
    builderName: 'Jake Mercer',
    builderHandle: 'jmercer_builds',
    builderTier: 'PRO',
    isVerified: true,
    buildName: 'DAILY HAMMER',
    vehicleEmoji: '🛻',
    vehicleName: '2023 RAM 1500 TRX',
    year: 2023,
    category: 'DAILY DRIVER',
    buildValue: 19800,
    likes: 455,
    comments: 33,
    views: 6700,
    tags: ['Tires', 'Lights', 'Suspension', 'Step Bars'],
    featuredPhoto: null,
    isBotm: false,
  },
  {
    id: 'b7',
    builderName: 'Chris Fontaine',
    builderHandle: 'fontaine.fleet',
    builderTier: 'PRO',
    isVerified: false,
    buildName: 'CARGO KING',
    vehicleEmoji: '🚚',
    vehicleName: '2022 Ford F-250 Super Duty',
    year: 2022,
    category: 'WORK TRUCK',
    buildValue: 23400,
    likes: 387,
    comments: 41,
    views: 5500,
    tags: ['Toolboxes', 'Rack System', 'Lighting', 'Hitch'],
    featuredPhoto: null,
    isBotm: false,
  },
  {
    id: 'b8',
    builderName: 'Nadia Voss',
    builderHandle: 'nvoss_offroad',
    builderTier: 'ELITE',
    isVerified: true,
    buildName: 'VAPOR TRAIL',
    vehicleEmoji: '🛻',
    vehicleName: '2024 Chevy Colorado ZR2',
    year: 2024,
    category: 'OVERLAND',
    buildValue: 27600,
    likes: 723,
    comments: 56,
    views: 9800,
    tags: ['Suspension', 'Lighting', 'Bumper', 'RTT'],
    featuredPhoto: null,
    isBotm: false,
  },
]

// ─── Featured builders ──────────────────────────────────────────────────────

export const FEATURED_BUILDERS: FeaturedBuilder[] = [
  {
    id: 'fb1',
    name: 'Marcus Webb',
    handle: 'mwebb_overland',
    tier: 'ELITE',
    isVerified: true,
    buildCount: 12,
    totalLikes: 8400,
    specialty: 'Overland / Expedition',
    emoji: '🏔️',
  },
  {
    id: 'fb2',
    name: 'Nadia Voss',
    handle: 'nvoss_offroad',
    tier: 'ELITE',
    isVerified: true,
    buildCount: 9,
    totalLikes: 5100,
    specialty: 'Off-Road / Trail',
    emoji: '⚡',
  },
  {
    id: 'fb3',
    name: 'Sierra Cole',
    handle: 'sierra.builds',
    tier: 'PRO',
    isVerified: true,
    buildCount: 7,
    totalLikes: 3800,
    specialty: 'Expedition / Camping',
    emoji: '🌲',
  },
  {
    id: 'fb4',
    name: 'Leah Nakamura',
    handle: 'leah_camps',
    tier: 'PRO',
    isVerified: true,
    buildCount: 5,
    totalLikes: 2900,
    specialty: 'Camp Setup / Comfort',
    emoji: '✨',
  },
]

// ─── Leaderboard ────────────────────────────────────────────────────────────

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1,  name: 'Marcus Webb',    handle: 'mwebb_overland',   tier: 'ELITE',    votes: 1247, delta: 42,  emoji: '🚙' },
  { rank: 2,  name: 'Nadia Voss',     handle: 'nvoss_offroad',    tier: 'ELITE',    votes: 723,  delta: 18,  emoji: '🛻' },
  { rank: 3,  name: 'Leah Nakamura',  handle: 'leah_camps',       tier: 'PRO',      votes: 998,  delta: -6,  emoji: '🚙' },
  { rank: 4,  name: 'Sierra Cole',    handle: 'sierra.builds',    tier: 'PRO',      votes: 834,  delta: 29,  emoji: '🛻' },
  { rank: 5,  name: 'Jake Mercer',    handle: 'jmercer_builds',   tier: 'PRO',      votes: 455,  delta: 11,  emoji: '🛻' },
  { rank: 6,  name: 'Chris Fontaine', handle: 'fontaine.fleet',   tier: 'PRO',      votes: 387,  delta: -3,  emoji: '🚚' },
  { rank: 7,  name: 'Ryan Torres',    handle: 'rt_tactical',      tier: 'PRO',      votes: 612,  delta: 7,   emoji: '🚗' },
  { rank: 8,  name: 'Drew Hollis',    handle: 'drew.rig',         tier: 'EXPLORER', votes: 321,  delta: 55,  emoji: '🚙' },
  { rank: 9,  name: 'Taya Briggs',    handle: 'taya.rigs',        tier: 'PRO',      votes: 278,  delta: -12, emoji: '🚙' },
  { rank: 10, name: 'Omar Khalid',    handle: 'omar_overland',    tier: 'EXPLORER', votes: 241,  delta: 33,  emoji: '🛻' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

export const CATEGORY_FILTERS = [
  'ALL',
  'OVERLAND',
  'EXPEDITION',
  'TACTICAL',
  'CAMPING',
  'RECOVERY',
  'DAILY DRIVER',
  'WORK TRUCK',
] as const

export type CategoryFilter = typeof CATEGORY_FILTERS[number]

export function formatLikes(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K'
  return String(n)
}

export function formatBuildValue(n: number): string {
  return '$' + n.toLocaleString('en-US')
}

export const TIER_CONFIG: Record<BuilderTier, { label: string; color: string; bg: string; border: string }> = {
  EXPLORER: {
    label:  'EXPLORER',
    color:  'rgba(243,237,226,0.50)',
    bg:     'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.10)',
  },
  PRO: {
    label:  'PRO',
    color:  '#FF551F',
    bg:     'rgba(255,85,31,0.10)',
    border: 'rgba(255,85,31,0.28)',
  },
  ELITE: {
    label:  'ELITE',
    color:  '#FFC857',
    bg:     'rgba(255,200,87,0.10)',
    border: 'rgba(255,200,87,0.28)',
  },
}
