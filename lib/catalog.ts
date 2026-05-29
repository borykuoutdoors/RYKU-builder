/**
 * RYKU static catalog — verbatim port of assets/ryku-catalog.js.
 * IDs are canonical and used by lib/rank.ts. Do not rename.
 */

// ─── Build purposes (9) ──────────────────────────────────────────────────────
export interface BuildPurpose {
  id:    string
  label: string
  sub:   string
  icon:  string
}

export const buildPurposes: BuildPurpose[] = [
  { id: 'p_camp',   label: 'Camping',          sub: 'Basecamp setup, comfort, shelter and cooking', icon: '⛺' },
  { id: 'p_over',   label: 'Overland',          sub: 'Long-range self-supported remote travel',       icon: '🗺️' },
  { id: 'p_daily',  label: 'Daily Use',         sub: 'Street-to-trail with everyday livability',      icon: '🛣️' },
  { id: 'p_work',   label: 'Work',              sub: 'Cargo, hauling, and work-site operations',       icon: '🔧' },
  { id: 'p_offroad',label: 'Off-Road',          sub: 'Rock crawling, trails, and technical terrain',  icon: '🪨' },
  { id: 'p_travel', label: 'Adventure Travel',  sub: 'Multi-day trips across mixed terrain',           icon: '🧭' },
  { id: 'p_tow',    label: 'Towing',            sub: 'Maximum tow capacity and stability systems',     icon: '🪝' },
  { id: 'p_fam',    label: 'Family Travel',     sub: 'Safety, comfort, and family-ready loadout',      icon: '👨‍👩‍👧' },
  { id: 'p_util',   label: 'Emergency/Utility', sub: 'Mission-critical utility and emergency prep',    icon: '🚨' },
]

// ─── Budget tiers (5) ────────────────────────────────────────────────────────
export interface BudgetTier {
  id:    string
  label: string
  sub:   string
  min:   number
  max:   number   // 0 = unlimited
}

export const budgetTiers: BudgetTier[] = [
  { id: 'b_entry',  label: 'Under $2,500',      sub: 'Entry-level upgrades',         min: 0,     max: 2500  },
  { id: 'b_mid',    label: '$2,500 – $5,000',   sub: 'Mid-range build kit',          min: 2500,  max: 5000  },
  { id: 'b_serious',label: '$5,000 – $10,000',  sub: 'Serious expedition loadout',   min: 5000,  max: 10000 },
  { id: 'b_full',   label: '$10,000 – $20,000', sub: 'Full tactical build',          min: 10000, max: 20000 },
  { id: 'b_pro',    label: '$20,000+',           sub: 'Pro-grade operator platform',  min: 20000, max: 0     },
]

// ─── Vehicle makes + models (11 makes) ───────────────────────────────────────
export interface VehicleMakeEntry {
  id:     string
  make:   string
  models: string[]
}

export const vehicleMakes: VehicleMakeEntry[] = [
  { id: 'toyota',    make: 'Toyota',      models: ['Tacoma', '4Runner', 'Tundra', 'Land Cruiser', 'Sequoia', 'FJ Cruiser'] },
  { id: 'ford',      make: 'Ford',        models: ['Bronco', 'F-150', 'F-250 Super Duty', 'Ranger', 'Expedition'] },
  { id: 'jeep',      make: 'Jeep',        models: ['Wrangler', 'Gladiator', 'Grand Cherokee', 'Cherokee'] },
  { id: 'chevrolet', make: 'Chevrolet',   models: ['Colorado', 'Silverado 1500', 'Silverado 2500HD', 'Suburban', 'Tahoe'] },
  { id: 'gmc',       make: 'GMC',         models: ['Canyon', 'Sierra 1500', 'Sierra 2500HD', 'Yukon'] },
  { id: 'ram',       make: 'Ram',         models: ['1500 TRX', '1500', '2500 Power Wagon', '2500', '3500'] },
  { id: 'nissan',    make: 'Nissan',      models: ['Frontier', 'Titan', 'Armada', 'Xterra (2015-)'] },
  { id: 'subaru',    make: 'Subaru',      models: ['Outback Wilderness', 'Forester', 'Crosstrek', 'Ascent'] },
  { id: 'land_rover',make: 'Land Rover',  models: ['Defender', 'Discovery', 'Discovery Sport'] },
  { id: 'mercedes',  make: 'Mercedes-Benz',models: ['G-Class', 'GLE', 'Sprinter'] },
  { id: 'rivian',    make: 'Rivian',      models: ['R1T', 'R1S'] },
]

// ─── Recommendation categories (9) ───────────────────────────────────────────
// Scoring keys match purpose map in rank.ts: camp / over / daily / work / off / travel / tow / fam / util
export interface RecCategory {
  id:     string
  label:  string
  icon:   string
  base:   number   // always-on score
  camp:   number
  over:   number
  daily:  number
  work:   number
  off:    number
  travel: number
  tow:    number
  fam:    number
  util:   number
  picks:  RecProduct[]
}

export interface RecProduct {
  name:   string
  brand:  string
  price:  number
  sku:    string
}

export const recCategories: RecCategory[] = [
  {
    id: 'r_susp', label: 'Suspension & Lift', icon: '⚙️',
    base: 0.6,
    camp: 0.4, over: 0.9, daily: 0.3, work: 0.4, off: 1.1, travel: 0.7, tow: 0.2, fam: 0.3, util: 0.4,
    picks: [
      { name: 'Stage 2 Lift System',     brand: 'ICON Vehicle Dynamics', price: 2800, sku: 'IVD-S2-TRD' },
      { name: 'Old Man Emu 2" Lift',     brand: 'ARB',                   price: 1650, sku: 'OME-2IN-4R'  },
      { name: 'Fox 2.0 Performance',     brand: 'Fox',                   price: 1400, sku: 'FOX-20-PERF' },
    ],
  },
  {
    id: 'r_rack', label: 'Roof Rack Systems', icon: '🏗️',
    base: 0.5,
    camp: 0.8, over: 1.0, daily: 0.3, work: 0.6, off: 0.4, travel: 0.8, tow: 0.2, fam: 0.7, util: 0.5,
    picks: [
      { name: 'Slimline II Platform',    brand: 'Front Runner',          price: 950,  sku: 'FR-SL2-TAC'  },
      { name: 'Alu-Cab Expedition Rack', brand: 'Alu-Cab',               price: 1200, sku: 'ALUCAB-EXP'  },
      { name: 'Rhino-Rack Pioneer',      brand: 'Rhino-Rack',            price: 760,  sku: 'RR-PION-LT'  },
    ],
  },
  {
    id: 'r_tent', label: 'Rooftop Tent', icon: '⛺',
    base: 0.3,
    camp: 1.1, over: 0.9, daily: 0.0, work: 0.0, off: 0.3, travel: 0.8, tow: 0.0, fam: 0.9, util: 0.0,
    picks: [
      { name: 'Skycamp 3.0',             brand: 'iKamper',               price: 3400, sku: 'IKA-SKYCAMP3' },
      { name: 'Rooftop Tent 2.0',        brand: 'Roofnest',              price: 2800, sku: 'RN-RTT2'       },
      { name: 'Ruggedized RTT',          brand: 'Tepui',                 price: 1950, sku: 'TEP-RUGG'      },
    ],
  },
  {
    id: 'r_light', label: 'Auxiliary Lighting', icon: '💡',
    base: 0.5,
    camp: 0.6, over: 0.8, daily: 0.4, work: 0.7, off: 1.1, travel: 0.6, tow: 0.3, fam: 0.4, util: 0.8,
    picks: [
      { name: 'Dual LED Spot/Flood',     brand: 'Baja Designs',          price: 890,  sku: 'BD-DUAL-SF'   },
      { name: 'Radiance Scene Light',    brand: 'Rigid Industries',      price: 640,  sku: 'RI-RAD-SCENE'  },
      { name: 'SAE Driving/Fog',         brand: 'KC HiLiTES',            price: 480,  sku: 'KC-SAE-DF'     },
    ],
  },
  {
    id: 'r_rec', label: 'Recovery Gear', icon: '🪝',
    base: 0.4,
    camp: 0.5, over: 0.9, daily: 0.1, work: 0.5, off: 1.1, travel: 0.7, tow: 0.4, fam: 0.3, util: 0.8,
    picks: [
      { name: 'Zeon 10-S Winch',         brand: 'WARN',                  price: 1800, sku: 'WRN-Z10S'      },
      { name: 'TRED PRO Recovery Boards', brand: 'MAXTRAX',              price: 380,  sku: 'MX-TREDPRO'    },
      { name: 'Recovery Kit Pro',        brand: 'ARB',                   price: 290,  sku: 'ARB-RK-PRO'    },
    ],
  },
  {
    id: 'r_armor', label: 'Armor & Protection', icon: '🛡️',
    base: 0.3,
    camp: 0.2, over: 0.7, daily: 0.1, work: 0.3, off: 1.1, travel: 0.5, tow: 0.1, fam: 0.2, util: 0.5,
    picks: [
      { name: 'Steel Bumper w/ Winch',   brand: 'ARB',                   price: 2100, sku: 'ARB-BUMP-WIN'  },
      { name: 'Rock Sliders',            brand: 'Shrockworks',           price: 750,  sku: 'SHR-RS-TRD'    },
      { name: 'Skid Plate System',       brand: 'SteelCraft',            price: 480,  sku: 'SC-SKID-SYS'   },
    ],
  },
  {
    id: 'r_power', label: 'Power & Electrical', icon: '⚡',
    base: 0.4,
    camp: 0.9, over: 1.0, daily: 0.3, work: 0.7, off: 0.5, travel: 0.9, tow: 0.4, fam: 0.8, util: 0.9,
    picks: [
      { name: 'Dual Battery System',     brand: 'ARB',                   price: 850,  sku: 'ARB-DUAL-BAT'  },
      { name: 'Yeti 1000X',              brand: 'YETI',                  price: 1300, sku: 'YTI-1000X'      },
      { name: 'Redarc BCDC1225D',        brand: 'Redarc',                price: 420,  sku: 'RED-BCDC1225D'  },
    ],
  },
  {
    id: 'r_wheels', label: 'Wheels & Tires', icon: '🛞',
    base: 0.5,
    camp: 0.3, over: 0.8, daily: 0.4, work: 0.5, off: 1.1, travel: 0.7, tow: 0.4, fam: 0.3, util: 0.5,
    picks: [
      { name: 'KO2 All-Terrain 285/70R17', brand: 'BF Goodrich',        price: 260,  sku: 'BFG-KO2-285'   },
      { name: 'MT2 Mud-Terrain 35x12.5R17', brand: 'Falken Wildpeak',   price: 310,  sku: 'FAL-MT2-35'    },
      { name: 'Method Race 305 Wheel',    brand: 'Method Race Wheels',   price: 320,  sku: 'MRW-305-17'    },
    ],
  },
  {
    id: 'r_storage', label: 'Storage & Organization', icon: '📦',
    base: 0.4,
    camp: 0.8, over: 0.9, daily: 0.5, work: 0.9, off: 0.3, travel: 0.8, tow: 0.7, fam: 1.0, util: 0.8,
    picks: [
      { name: 'Drawer System',           brand: 'DECKED',                price: 1100, sku: 'DCK-DRW-TRD'   },
      { name: 'Cargo Management System', brand: 'Bedrug',                price: 480,  sku: 'BR-CARGO'       },
      { name: 'Molle Panel System',      brand: 'Tuffy Security',        price: 340,  sku: 'TUF-MLL-PNL'   },
    ],
  },
]

// ─── Featured gallery builds (9) ─────────────────────────────────────────────
export interface GalleryBuild {
  id:     string
  index:  string   // e.g. "01"
  tag:    string   // e.g. "BACKCOUNTRY"
  region: string
  title:  string
  owner:  string
  specs:  string[]
  filter: string   // matches filter chip id
}

export const buildsGallery: GalleryBuild[] = [
  {
    id: 'bg01', index: '01', tag: 'BACKCOUNTRY', region: 'Pacific Northwest',
    title: 'TACOMA EXPEDITION RIG',
    owner: 'CALLSIGN: PHANTOM',
    specs: ['2" Lift', 'RTT', 'Dual Battery', 'ARB Bumper'],
    filter: 'backcountry',
  },
  {
    id: 'bg02', index: '02', tag: 'OPERATOR', region: 'Southwest Desert',
    title: 'BRONCO TACTICAL BUILD',
    owner: 'CALLSIGN: IRONCLAD',
    specs: ['3" Lift', 'Steel Bumper', 'Winch', 'Rock Sliders'],
    filter: 'operator',
  },
  {
    id: 'bg03', index: '03', tag: 'EXPEDITION', region: 'Rocky Mountains',
    title: '4RUNNER OVERLAND',
    owner: 'CALLSIGN: NOMAD',
    specs: ['Roof Rack', 'Skycamp RTT', 'Dual Battery', 'Aux Lighting'],
    filter: 'expedition',
  },
  {
    id: 'bg04', index: '04', tag: 'TRAIL', region: 'Moab, Utah',
    title: 'GLADIATOR TRAIL KING',
    owner: 'CALLSIGN: REDROCK',
    specs: ['4" Lift', 'Beadlock Wheels', 'Skid Plates', 'Winch'],
    filter: 'trail',
  },
  {
    id: 'bg05', index: '05', tag: 'SOLO', region: 'Baja California',
    title: 'WRANGLER DESERT RUNNER',
    owner: 'CALLSIGN: SAGUARO',
    specs: ['2" Lift', 'Recovery Kit', 'Aux Lighting', 'Storage System'],
    filter: 'solo',
  },
  {
    id: 'bg06', index: '06', tag: 'EXPEDITION', region: 'Alaska',
    title: 'TUNDRA ARCTIC BUILD',
    owner: 'CALLSIGN: GLACIER',
    specs: ['Roof Rack', 'RTT', 'Dual Battery', 'Recovery Boards'],
    filter: 'expedition',
  },
  {
    id: 'bg07', index: '07', tag: 'OPERATOR', region: 'Central Texas',
    title: 'F-150 RAPTOR TACTICAL',
    owner: 'CALLSIGN: DAGGER',
    specs: ['Fox Shocks', 'Steel Bumper', 'Bed Storage', 'LED Lighting'],
    filter: 'operator',
  },
  {
    id: 'bg08', index: '08', tag: 'BACKCOUNTRY', region: 'Colorado',
    title: 'COLORADO TRAIL BUILD',
    owner: 'CALLSIGN: SUMMIT',
    specs: ['2" Lift', 'All-Terrain Tires', 'Roof Rack', 'Camp Kitchen'],
    filter: 'backcountry',
  },
  {
    id: 'bg09', index: '09', tag: 'TRAIL', region: 'Appalachian',
    title: 'DEFENDER EXPEDITION',
    owner: 'CALLSIGN: OVERPASS',
    specs: ['Lift Kit', 'Armor Pack', 'RTT', 'Power Station'],
    filter: 'trail',
  },
]

export const buildFilterChips = [
  { id: 'all',        label: 'ALL' },
  { id: 'backcountry',label: 'BACKCOUNTRY' },
  { id: 'operator',   label: 'OPERATOR' },
  { id: 'expedition', label: 'EXPEDITION' },
  { id: 'trail',      label: 'TRAIL' },
  { id: 'solo',       label: 'SOLO' },
]

// ─── Gear categories (8) ─────────────────────────────────────────────────────
export interface GearCategory {
  id:    string
  label: string
  icon:  string
  sku:   string   // count string, e.g. "12 SKUs"
  hint:  string
}

export const gearCategories: GearCategory[] = [
  { id: 'suspension',  label: 'Suspension',        icon: '⚙️',  sku: '18 SKUs', hint: 'Lifts, shocks, coilovers, UCA' },
  { id: 'roof-racks',  label: 'Roof Racks',         icon: '🏗️',  sku: '14 SKUs', hint: 'Platform, basket, and tent-ready racks' },
  { id: 'tents',       label: 'Rooftop Tents',      icon: '⛺',  sku: '11 SKUs', hint: 'Hardshell and softshell RTTs' },
  { id: 'lighting',    label: 'Lighting',           icon: '💡',  sku: '22 SKUs', hint: 'Light bars, spots, scenes, pods' },
  { id: 'recovery',    label: 'Recovery',           icon: '🪝',  sku: '16 SKUs', hint: 'Winches, boards, straps, anchors' },
  { id: 'armor',       label: 'Armor & Protection', icon: '🛡️',  sku: '13 SKUs', hint: 'Bumpers, sliders, skid plates' },
  { id: 'power',       label: 'Power Systems',      icon: '⚡',  sku: '9 SKUs',  hint: 'Dual battery, inverters, solar' },
  { id: 'storage',     label: 'Storage & Cargo',    icon: '📦',  sku: '17 SKUs', hint: 'Drawers, bed systems, molle panels' },
]

// ─── Shop featured (8) — coming-soon items ────────────────────────────────────
export interface ShopFeatured {
  id:    string
  name:  string
  brand: string
  price: string
  tag:   string
}

export const shopFeatured: ShopFeatured[] = [
  { id: 'sf1', name: 'Stage 2 Suspension Kit', brand: 'ICON',        price: '$2,800', tag: 'SUSPENSION' },
  { id: 'sf2', name: 'Slimline II Rack',        brand: 'FRONT RUNNER',price: '$950',   tag: 'ROOF RACK'  },
  { id: 'sf3', name: 'Skycamp 3.0 RTT',         brand: 'IKAMPER',     price: '$3,400', tag: 'TENT'       },
  { id: 'sf4', name: 'Dual LED Spot/Flood',     brand: 'BAJA DESIGNS',price: '$890',   tag: 'LIGHTING'   },
  { id: 'sf5', name: 'Zeon 10-S Winch',         brand: 'WARN',        price: '$1,800', tag: 'RECOVERY'   },
  { id: 'sf6', name: 'Steel Bumper',            brand: 'ARB',         price: '$2,100', tag: 'ARMOR'      },
  { id: 'sf7', name: 'Dual Battery System',     brand: 'ARB',         price: '$850',   tag: 'POWER'      },
  { id: 'sf8', name: 'DECKED Drawer System',    brand: 'DECKED',      price: '$1,100', tag: 'STORAGE'    },
]

// ─── Installers (8) ──────────────────────────────────────────────────────────
export interface Installer {
  id:       string
  name:     string
  city:     string
  state:    string
  rating:   number
  reviews:  number
  leadTime: string
  specialty:string[]
  thumb:    string
}

export const installers: Installer[] = [
  {
    id: 'i1', name: 'Pacific Overland',   city: 'Portland',    state: 'OR',
    rating: 4.9, reviews: 84, leadTime: '1–2 weeks',
    specialty: ['Suspension', 'Roof Racks', 'Electrical'],
    thumb: '',
  },
  {
    id: 'i2', name: 'Desert Armor Works', city: 'Phoenix',     state: 'AZ',
    rating: 4.8, reviews: 127, leadTime: '2–3 weeks',
    specialty: ['Armor', 'Recovery', 'Lighting'],
    thumb: '',
  },
  {
    id: 'i3', name: 'Rocky Mountain Rigs', city: 'Denver',     state: 'CO',
    rating: 5.0, reviews: 61, leadTime: '1 week',
    specialty: ['Full Builds', 'Suspension', 'Tents'],
    thumb: '',
  },
  {
    id: 'i4', name: 'Lone Star Overland',  city: 'Austin',     state: 'TX',
    rating: 4.7, reviews: 98, leadTime: '2–4 weeks',
    specialty: ['Electrical', 'Storage', 'Towing'],
    thumb: '',
  },
  {
    id: 'i5', name: 'Cascadia Outfitters', city: 'Seattle',    state: 'WA',
    rating: 4.9, reviews: 73, leadTime: '1–2 weeks',
    specialty: ['Roof Racks', 'Tents', 'Power'],
    thumb: '',
  },
  {
    id: 'i6', name: 'SoCal Trail Works',   city: 'San Diego',  state: 'CA',
    rating: 4.8, reviews: 156, leadTime: '3 weeks',
    specialty: ['Suspension', 'Armor', 'Off-Road'],
    thumb: '',
  },
  {
    id: 'i7', name: 'Appalachian Builds',  city: 'Asheville',  state: 'NC',
    rating: 4.6, reviews: 44, leadTime: '2 weeks',
    specialty: ['Full Builds', 'Recovery'],
    thumb: '',
  },
  {
    id: 'i8', name: 'Great Plains Rigs',   city: 'Kansas City', state: 'KS',
    rating: 4.7, reviews: 52, leadTime: '1–3 weeks',
    specialty: ['Towing', 'Storage', 'Electrical'],
    thumb: '',
  },
]

// ─── Formatting helpers ───────────────────────────────────────────────────────
export const fmt = {
  usd: (n: number) => '$' + n.toLocaleString('en-US'),
  num: (n: number) => n.toLocaleString('en-US'),
}
