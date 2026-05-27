import type { Product } from '@/types/product'

export const PRODUCTS: Product[] = [
  // ── SUSPENSION (7) ──────────────────────────────────────────────────────
  {
    id: 's1', category: 'Suspension', brand: 'ICON Vehicle Dynamics', name: 'Stage 2 System',
    emoji: '🔩', price: 2800, labor: 800, diff: 'hard',
    compat: ['tacoma', '4runner'], mission: ['offroad', 'overland', 'expedition', 'tactical'],
    note: 'Tacoma 3rd Gen only. Professional installation required.',
  },
  {
    id: 's2', category: 'Suspension', brand: 'Old Man Emu', name: 'BP-51 Bypass Shocks',
    emoji: '🔩', price: 2400, labor: 750, diff: 'hard',
    compat: ['4runner', 'tacoma', 'tundra'], mission: ['overland', 'expedition', 'offroad'],
    note: 'Direct fit with correct spring selection per load.',
  },
  {
    id: 's3', category: 'Suspension', brand: 'Fox', name: '2.5 Performance Elite Series',
    emoji: '🔩', price: 2800, labor: 850, diff: 'hard',
    compat: ['bronco', 'f150', 'ram1500'], mission: ['offroad', 'overland', 'expedition', 'tactical'],
    note: 'Remote reservoir. Confirm axle clearance for Bronco.',
  },
  {
    id: 's4', category: 'Suspension', brand: 'Rough Country', name: '2.5" Leveling Kit',
    emoji: '🔩', price: 280, labor: 350, diff: 'med',
    compat: ['tacoma', '4runner', 'tundra', 'f150', 'ram1500', 'colorado', 'frontier'],
    mission: ['daily', 'utility', 'overland', 'camping'],
    note: 'No cutting required. Works with factory KDSS (4Runner).',
  },
  {
    id: 's5', category: 'Suspension', brand: 'ICON Vehicle Dynamics', name: 'Bronco Stage 8 System',
    emoji: '🔩', price: 4200, labor: 1100, diff: 'hard',
    compat: ['bronco'], mission: ['offroad', 'overland', 'expedition', 'tactical'],
    note: 'Bronco 2021+ with Sasquatch or standard package.',
  },
  {
    id: 's6', category: 'Suspension', brand: 'Rancho', name: 'RS9000XL Shocks',
    emoji: '🔩', price: 480, labor: 400, diff: 'med',
    compat: ['gladiator', 'wrangler'], mission: ['offroad', 'daily', 'utility'],
    note: '9-position manual adjustability. Direct fit.',
  },
  {
    id: 's7', category: 'Suspension', brand: 'Bilstein', name: '5100 Series Shocks',
    emoji: '🔩', price: 680, labor: 400, diff: 'med',
    compat: ['f150', 'tundra', 'ram1500', 'colorado'], mission: ['daily', 'overland', 'utility'],
    note: 'Monotube design. Multiple height settings available.',
  },

  // ── ROOF RACKS (6) ──────────────────────────────────────────────────────
  {
    id: 'r1', category: 'Roof Racks', brand: 'Front Runner', name: 'Slimline II Full Rack',
    emoji: '🔲', price: 1380, labor: 180, diff: 'med', pop: true,
    compat: ['tacoma', '4runner', 'tundra'], mission: ['overland', 'camping', 'expedition'],
    note: 'Requires vehicle-specific fit kit (sold separately).',
  },
  {
    id: 'r2', category: 'Roof Racks', brand: 'Prinsu Design Studio', name: 'Full Roof Rack',
    emoji: '🔲', price: 940, labor: 160, diff: 'med',
    compat: ['tacoma', '4runner', 'colorado', 'frontier'], mission: ['overland', 'camping', 'expedition'],
    note: 'Laser-cut steel. Direct bolt-on, no drilling required.',
  },
  {
    id: 'r3', category: 'Roof Racks', brand: 'Yakima', name: 'OutPost HD Rack',
    emoji: '🔲', price: 740, labor: 140, diff: 'med',
    compat: ['4runner', 'bronco', 'wrangler', 'gladiator'], mission: ['camping', 'overland', 'daily'],
    note: 'Modular design. Works with most Yakima accessories.',
  },
  {
    id: 'r4', category: 'Roof Racks', brand: 'Sherpa Equipment Co.', name: 'Crestone Rack',
    emoji: '🔲', price: 1100, labor: 160, diff: 'med',
    compat: ['tacoma', '4runner', 'tundra', 'colorado'], mission: ['overland', 'expedition', 'camping'],
    note: 'Aircraft-grade aluminum. 300 lb dynamic load.',
  },
  {
    id: 'r5', category: 'Roof Racks', brand: 'Rhino-Rack', name: 'Pioneer Platform',
    emoji: '🔲', price: 640, labor: 120, diff: 'easy',
    compat: ['f150', 'tundra', 'ram1500'], mission: ['utility', 'camping', 'overland'],
    note: 'Vortex legs included. 220 lb capacity.',
  },
  {
    id: 'r6', category: 'Roof Racks', brand: 'Smittybilt', name: 'Scout Steel Rack',
    emoji: '🔲', price: 380, labor: 100, diff: 'easy',
    compat: ['wrangler', 'gladiator'], mission: ['offroad', 'camping', 'daily'],
    note: 'Heavy-duty steel. Textured black powdercoat.',
  },

  // ── ROOFTOP TENTS (5) ──────────────────────────────────────────────────
  {
    id: 'rtt1', category: 'Rooftop Tents', brand: 'iKamper', name: 'Skycamp 3.0',
    emoji: '⛺', price: 3400, labor: 120, diff: 'med', pop: true,
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'f150', 'tundra', 'ram1500', 'colorado'],
    mission: ['overland', 'camping', 'expedition'],
    note: 'Requires roof rack rated 165 lb+. Opens in 60 seconds.',
  },
  {
    id: 'rtt2', category: 'Rooftop Tents', brand: 'Roofnest', name: 'Condor XL',
    emoji: '⛺', price: 3900, labor: 120, diff: 'med',
    compat: ['f150', 'tundra', 'ram1500', '4runner'],
    mission: ['overland', 'camping', 'expedition'],
    note: 'Hard shell with 5-second open. Fits queen size mattress.',
  },
  {
    id: 'rtt3', category: 'Rooftop Tents', brand: 'James Baroud', name: 'Space Evolution',
    emoji: '⛺', price: 4200, labor: 130, diff: 'med',
    compat: ['4runner', 'bronco', 'gladiator', 'tundra'],
    mission: ['expedition', 'overland', 'camping'],
    note: 'All-weather design. 3-season rated to -4°F.',
  },
  {
    id: 'rtt4', category: 'Rooftop Tents', brand: 'Tepui', name: 'Kukenam Sky',
    emoji: '⛺', price: 1400, labor: 100, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'wrangler'],
    mission: ['camping', 'overland', 'daily'],
    note: 'Soft shell. Easy setup. 150 lb dynamic load rating.',
  },
  {
    id: 'rtt5', category: 'Rooftop Tents', brand: 'Smittybilt', name: 'Overlander Tent',
    emoji: '⛺', price: 720, labor: 90, diff: 'easy',
    compat: ['wrangler', 'gladiator', 'tacoma', 'colorado', 'frontier'],
    mission: ['camping', 'daily', 'offroad'],
    note: 'Best value entry point. Fits 2 adults comfortably.',
  },

  // ── LIGHTING (6) ──────────────────────────────────────────────────────
  {
    id: 'l1', category: 'Lighting', brand: 'Rigid Industries', name: 'E-Series 20" LED Bar',
    emoji: '💡', price: 940, labor: 220, diff: 'med', pop: true,
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'f150', 'tundra'],
    mission: ['overland', 'tactical', 'offroad', 'expedition'],
    note: 'Requires front bumper or windshield mount bracket.',
  },
  {
    id: 'l2', category: 'Lighting', brand: 'Baja Designs', name: 'Squadron Pro Pods',
    emoji: '💡', price: 560, labor: 180, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['offroad', 'overland', 'tactical'],
    note: 'Available in spot, wide-cornering, or combo beam.',
  },
  {
    id: 'l3', category: 'Lighting', brand: 'Rigid Industries', name: 'Radiance Plus SR20',
    emoji: '💡', price: 480, labor: 200, diff: 'med',
    compat: ['f150', 'tundra', 'ram1500'], mission: ['overland', 'daily', 'utility'],
    note: 'Integrated side-illumination for widened trail visibility.',
  },
  {
    id: 'l4', category: 'Lighting', brand: 'KC HiLiTES', name: 'Gravity Pro6 LED',
    emoji: '💡', price: 1800, labor: 300, diff: 'hard',
    compat: ['bronco'], mission: ['offroad', 'tactical', 'overland'],
    note: 'Bronco-specific modular system. Up to 3 lights per side.',
  },
  {
    id: 'l5', category: 'Lighting', brand: 'Baja Designs', name: 'LP6 Pro Pods',
    emoji: '💡', price: 380, labor: 150, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['offroad', 'camping', 'daily'],
    note: '6" round pod. Works with OEM and aftermarket bumpers.',
  },
  {
    id: 'l6', category: 'Lighting', brand: 'Rigid Industries', name: 'Rock Lights 6-Pack',
    emoji: '💡', price: 280, labor: 180, diff: 'med',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['offroad', 'overland', 'tactical'],
    note: 'IP68 waterproof. Requires Bluetooth controller (included).',
  },

  // ── WHEELS & TIRES (5) ──────────────────────────────────────────────────
  {
    id: 'w1', category: 'Wheels & Tires', brand: 'Falken', name: 'Wildpeak AT3W 285/70R17',
    emoji: '🛞', price: 1200, labor: 200, diff: 'easy', pop: true,
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['overland', 'daily', 'camping', 'offroad'],
    note: 'No lift required for most fitments listed. Confirm clearance.',
  },
  {
    id: 'w2', category: 'Wheels & Tires', brand: 'BF Goodrich', name: 'KO2 285/75R16',
    emoji: '🛞', price: 1100, labor: 200, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['offroad', 'overland', 'recovery', 'expedition'],
    note: 'Proven all-terrain with severe snow rating.',
  },
  {
    id: 'w3', category: 'Wheels & Tires', brand: 'Method Race Wheels', name: 'MR305 NV Beadlock 17x8.5',
    emoji: '🛞', price: 2000, labor: 220, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['offroad', 'recovery', 'tactical'],
    note: 'True beadlock ring. Requires matching beadlock tires.',
  },
  {
    id: 'w4', category: 'Wheels & Tires', brand: 'Nitto', name: 'Ridge Grappler 305/65R18',
    emoji: '🛞', price: 1400, labor: 200, diff: 'easy',
    compat: ['f150', 'tundra', 'ram1500'], mission: ['daily', 'overland', 'utility'],
    note: 'Aggressive MT + AT hybrid. Low road noise for daily driving.',
  },
  {
    id: 'w5', category: 'Wheels & Tires', brand: 'Fuel Off-Road', name: 'Assault D576 20x9',
    emoji: '🛞', price: 1600, labor: 200, diff: 'easy',
    compat: ['f150', 'tundra', 'ram1500'], mission: ['daily', 'utility', 'overland'],
    note: 'Cast aluminum. -12 offset for aggressive stance.',
  },

  // ── RECOVERY (6) ──────────────────────────────────────────────────────
  {
    id: 'rc1', category: 'Recovery', brand: 'WARN', name: 'Zeon 10-S Platinum Winch',
    emoji: '🪝', price: 1800, labor: 400, diff: 'hard', pop: true,
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500'],
    mission: ['recovery', 'offroad', 'overland', 'expedition'],
    note: 'Requires aftermarket bumper with winch plate.',
  },
  {
    id: 'rc2', category: 'Recovery', brand: 'Smittybilt', name: 'X2O 10K Waterproof Winch',
    emoji: '🪝', price: 820, labor: 350, diff: 'hard',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['recovery', 'offroad', 'overland'],
    note: 'IP67 waterproof. Best value winch for mid-size platforms.',
  },
  {
    id: 'rc3', category: 'Recovery', brand: 'MAXTRAX', name: 'MKII Recovery Boards',
    emoji: '🪝', price: 420, labor: 0, diff: 'easy', pop: true,
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['recovery', 'overland', 'expedition', 'offroad'],
    note: 'No tools required. Mount to roof rack with official mounts.',
  },
  {
    id: 'rc4', category: 'Recovery', brand: 'ARB', name: 'Deluxe Recovery Kit',
    emoji: '🪝', price: 420, labor: 0, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['recovery', 'overland', 'expedition'],
    note: 'Snatch block, tree saver, dampener, gloves, shackles.',
  },
  {
    id: 'rc5', category: 'Recovery', brand: 'ARB', name: 'Summit Front Bumper w/ Winch Mount',
    emoji: '🛡️', price: 1800, labor: 500, diff: 'hard',
    compat: ['tacoma', '4runner'], mission: ['recovery', 'offroad', 'overland', 'tactical'],
    note: 'Fits 3rd Gen Tacoma and 5th Gen 4Runner. Airbag compatible.',
  },
  {
    id: 'rc6', category: 'Recovery', brand: 'Hi-Lift', name: '60" Jack + ORB Adapter',
    emoji: '🪝', price: 240, labor: 0, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['recovery', 'offroad', 'overland'],
    note: 'Off-Road Base adapter for soft terrain. Mount to bumper or rack.',
  },

  // ── STORAGE & CARGO (4) ──────────────────────────────────────────────────
  {
    id: 'st1', category: 'Storage & Cargo', brand: 'DECKED', name: 'Truck Drawer System',
    emoji: '📦', price: 2400, labor: 180, diff: 'med', pop: true,
    compat: ['tacoma', 'f150', 'tundra', 'ram1500', 'gladiator', 'colorado', 'frontier'],
    mission: ['utility', 'overland', 'camping', 'expedition'],
    note: 'Vehicle-specific fit. 2,000 lb payload capacity when closed.',
  },
  {
    id: 'st2', category: 'Storage & Cargo', brand: 'Pelican', name: 'V800 Vault Cases (Set of 4)',
    emoji: '📦', price: 960, labor: 0, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'expedition', 'tactical', 'camping'],
    note: 'Stackable, IP67 waterproof. MOLLE compatible.',
  },
  {
    id: 'st3', category: 'Storage & Cargo', brand: 'Overland Vehicle Systems', name: 'Cargo Box + MOLLE',
    emoji: '📦', price: 580, labor: 80, diff: 'easy',
    compat: ['tacoma', '4runner', 'colorado', 'frontier', 'gladiator', 'wrangler'],
    mission: ['overland', 'utility', 'camping'],
    note: 'Mounts to bed rails or roof rack crossbars.',
  },
  {
    id: 'st4', category: 'Storage & Cargo', brand: 'WeatherTech', name: 'CargoTech + Seat Back',
    emoji: '📦', price: 320, labor: 0, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['daily', 'utility', 'camping'],
    note: 'No-drill installation. Cargo containment + organizer system.',
  },

  // ── POWER & COMMS (5) ──────────────────────────────────────────────────
  {
    id: 'pc1', category: 'Power & Comms', brand: 'Goal Zero', name: 'Yeti 3000X Power Station',
    emoji: '⚡', price: 2800, labor: 0, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'camping', 'expedition', 'utility'],
    note: '3,032Wh. Charges via solar, wall, or 12V car outlet.',
  },
  {
    id: 'pc2', category: 'Power & Comms', brand: 'Renogy', name: '200W Flexible Solar Kit',
    emoji: '☀️', price: 380, labor: 120, diff: 'med',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'expedition', 'camping'],
    note: 'Mounts to roof rack. Requires charge controller (included).',
  },
  {
    id: 'pc3', category: 'Power & Comms', brand: 'Garmin', name: 'inReach Mini 2 Satellite',
    emoji: '📡', price: 450, labor: 0, diff: 'easy', pop: true,
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'expedition', 'recovery', 'offroad'],
    note: 'Two-way satellite messaging. SOS capability. Monthly plan required.',
  },
  {
    id: 'pc4', category: 'Power & Comms', brand: 'Midland', name: 'MXT575 GMRS Radio',
    emoji: '📻', price: 320, labor: 100, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['tactical', 'overland', 'offroad', 'recovery'],
    note: '50W GMRS. NOAA weather alerts. FCC license required.',
  },
  {
    id: 'pc5', category: 'Power & Comms', brand: 'Optima', name: 'YellowTop D34 Battery',
    emoji: '🔋', price: 280, labor: 80, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'utility', 'expedition', 'daily'],
    note: 'Dual-purpose AGM. 750 CCA. Handles heavy accessory loads.',
  },

  // ── CAMPING GEAR (4) ──────────────────────────────────────────────────
  {
    id: 'cg1', category: 'Camping Gear', brand: 'ARB', name: 'Elements Fridge 63QT',
    emoji: '❄️', price: 1100, labor: 80, diff: 'easy', pop: true,
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['overland', 'camping', 'expedition'],
    note: 'Dual zone capable. -8°F to 50°F range. 12/24V compatible.',
  },
  {
    id: 'cg2', category: 'Camping Gear', brand: 'Trail Kitchens', name: 'Overland Kitchen System',
    emoji: '🍳', price: 940, labor: 120, diff: 'med',
    compat: ['tacoma', 'f150', 'tundra', 'ram1500', 'gladiator', 'colorado', 'frontier'],
    mission: ['camping', 'overland', 'expedition'],
    note: 'Truck-bed slide-out system. Includes propane burner and workspace.',
  },
  {
    id: 'cg3', category: 'Camping Gear', brand: 'Overland Vehicle Systems', name: '270° Awning + Walls',
    emoji: '⛱️', price: 890, labor: 80, diff: 'easy',
    compat: ['tacoma', '4runner', 'bronco', 'gladiator', 'wrangler', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier'],
    mission: ['camping', 'overland', 'expedition'],
    note: 'Attaches to roof rack or bed rack side rail.',
  },
  {
    id: 'cg4', category: 'Camping Gear', brand: 'National Luna', name: 'Camp Shower + Table',
    emoji: '🚿', price: 480, labor: 60, diff: 'med',
    compat: ['tacoma', '4runner', 'bronco', 'f150', 'tundra', 'ram1500', 'colorado'],
    mission: ['camping', 'overland', 'expedition'],
    note: '12V solar shower pump. Fold-out aluminum table included.',
  },

  // ── ARMOR & PROTECTION (4) ──────────────────────────────────────────────
  {
    id: 'ap1', category: 'Armor & Protection', brand: 'Rough Country', name: 'HD Skid Plate Set',
    emoji: '🛡️', price: 640, labor: 240, diff: 'med',
    compat: ['tacoma', '4runner', 'tundra'], mission: ['offroad', 'overland', 'recovery'],
    note: '3/16" steel. Covers front diff, transfer case, and fuel tank.',
  },
  {
    id: 'ap2', category: 'Armor & Protection', brand: 'Smittybilt', name: 'XRC Rock Sliders',
    emoji: '🛡️', price: 480, labor: 280, diff: 'hard',
    compat: ['wrangler', 'gladiator'], mission: ['offroad', 'recovery', 'tactical'],
    note: 'Frame-mounted. 3/16" steel tube. Load-bearing design.',
  },
  {
    id: 'ap3', category: 'Armor & Protection', brand: 'Westin', name: 'HDX Bandit Bumper',
    emoji: '🛡️', price: 1200, labor: 450, diff: 'hard',
    compat: ['f150', 'tundra', 'ram1500'], mission: ['utility', 'offroad', 'daily'],
    note: 'Full-width steel bumper with integrated light mounts.',
  },
  {
    id: 'ap4', category: 'Armor & Protection', brand: 'Fishbone Offroad', name: 'Tailgate MOLLE Panel',
    emoji: '🛡️', price: 280, labor: 60, diff: 'easy',
    compat: ['tacoma', 'f150', 'tundra', 'ram1500', 'colorado', 'frontier', 'gladiator'],
    mission: ['utility', 'tactical', 'overland'],
    note: 'Direct fit to most truck tailgates. Powder coated steel.',
  },
]

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category)
}

export function getCompatibleProducts(vehicleId: string, missionId?: string): Product[] {
  return PRODUCTS.filter(p => {
    const vehicleOk = p.compat.includes(vehicleId)
    const missionOk = !missionId || p.mission.includes(missionId)
    return vehicleOk && missionOk
  })
}

export const CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'Suspension',       label: 'Suspension',      emoji: '🔩' },
  { id: 'Roof Racks',       label: 'Roof Racks',      emoji: '🔲' },
  { id: 'Rooftop Tents',    label: 'Rooftop Tents',   emoji: '⛺' },
  { id: 'Lighting',         label: 'Lighting',        emoji: '💡' },
  { id: 'Wheels & Tires',   label: 'Wheels & Tires',  emoji: '🛞' },
  { id: 'Recovery',         label: 'Recovery',        emoji: '🪝' },
  { id: 'Storage & Cargo',  label: 'Storage & Cargo', emoji: '📦' },
  { id: 'Power & Comms',    label: 'Power & Comms',   emoji: '⚡' },
  { id: 'Camping Gear',     label: 'Camping Gear',    emoji: '❄️' },
  { id: 'Armor & Protection', label: 'Armor',         emoji: '🛡️' },
]
