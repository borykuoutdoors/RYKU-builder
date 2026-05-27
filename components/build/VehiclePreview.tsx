'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBuildStore } from '@/store/buildStore'

// ─── SVG Builder (string concatenation — no ternaries inside template literals) ───

function buildSVGString(
  hasRack: boolean,
  hasRTT: boolean,
  hasLights: boolean,
  hasWinch: boolean,
  hasArmor: boolean,
  hasSusp: boolean,
  hasWheels: boolean,
  vehicleName: string
): string {
  const liftY = hasSusp ? -8 : 0
  const orange = '#FF551F'

  let svg = ''
  svg += '<svg viewBox="0 15 500 182" xmlns="http://www.w3.org/2000/svg">'
  svg += '<defs>'
  svg += '<linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="100%" stop-color="#111"/></linearGradient>'
  svg += '<linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a3a4a" stop-opacity="0.9"/><stop offset="100%" stop-color="#0a1a22" stop-opacity="0.7"/></linearGradient>'

  // glow filter if hasLights
  if (hasLights) {
    svg += '<filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
  }
  svg += '</defs>'

  // Ground shadow
  svg += '<ellipse cx="250" cy="185" rx="200" ry="8" fill="rgba(0,0,0,0.4)"/>'

  // Lift label if suspension
  if (hasSusp) {
    svg += '<text x="250" y="30" text-anchor="middle" fill="' + orange + '" font-size="9" font-family="monospace" letter-spacing="2">LIFT +2.5"</text>'
  }

  // --- BODY GROUP (lifted if suspension) ---
  svg += '<g transform="translate(0,' + liftY + ')">'

  // Truck bed
  svg += '<rect x="60" y="110" width="130" height="55" rx="2" fill="url(#bodyGrad)" stroke="#333" stroke-width="1"/>'
  svg += '<rect x="60" y="110" width="130" height="8" rx="1" fill="#333"/>'
  svg += '<line x1="185" y1="118" x2="185" y2="165" stroke="#333" stroke-width="2"/>'

  // Cab body
  svg += '<path d="M185 165 L185 95 Q185 88 192 85 L280 75 Q310 72 330 85 L360 110 L360 165 Z" fill="url(#bodyGrad)" stroke="#333" stroke-width="1"/>'

  // Cab roof
  svg += '<path d="M200 95 Q200 78 210 75 L280 68 Q310 66 330 78 L355 95 Z" fill="#1e1e1e" stroke="#2a2a2a" stroke-width="1"/>'

  // Windshield
  svg += '<path d="M205 93 Q206 79 214 76 L278 70 Q308 68 326 79 L348 93 Z" fill="url(#glassGrad)" stroke="#1a3a4a" stroke-width="0.5"/>'

  // Rear window
  svg += '<rect x="192" y="90" width="20" height="35" rx="1" fill="url(#glassGrad)" stroke="#1a3a4a" stroke-width="0.5"/>'

  // Hood
  svg += '<path d="M360 110 L360 130 L420 140 L430 125 L400 105 Z" fill="url(#bodyGrad)" stroke="#333" stroke-width="1"/>'

  // Front bumper — armor or plain
  if (hasArmor) {
    svg += '<rect x="420" y="120" width="30" height="32" rx="2" fill="#1a1a1a" stroke="' + orange + '" stroke-width="1.5"/>'
    svg += '<rect x="424" y="123" width="22" height="6" rx="1" fill="' + orange + '" opacity="0.6"/>'
    svg += '<rect x="424" y="133" width="22" height="6" rx="1" fill="' + orange + '" opacity="0.4"/>'
  } else {
    svg += '<rect x="420" y="125" width="25" height="22" rx="2" fill="#222" stroke="#333" stroke-width="1"/>'
  }

  // Winch
  if (hasWinch) {
    svg += '<rect x="425" y="138" width="15" height="8" rx="1" fill="#111" stroke="#555" stroke-width="0.5"/>'
    svg += '<rect x="426" y="140" width="13" height="4" rx="0.5" fill="#333"/>'
    svg += '<line x1="440" y1="142" x2="460" y2="142" stroke="#888" stroke-width="1"/>'
  }

  // LED light bar
  if (hasLights) {
    svg += '<rect x="358" y="78" width="50" height="7" rx="1" fill="#FF9900" stroke="#CC7700" stroke-width="0.5" filter="url(#glow)"/>'
    svg += '<rect x="360" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<rect x="367" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<rect x="374" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<rect x="381" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<rect x="388" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<rect x="395" y="79" width="4" height="5" rx="0.3" fill="#FFCC00" opacity="0.8"/>'
    svg += '<ellipse cx="430" cy="130" rx="8" ry="8" fill="rgba(255,200,0,0.06)" filter="url(#glow)"/>'
  }

  // Roof rack
  if (hasRack) {
    svg += '<rect x="195" y="64" width="155" height="6" rx="1" fill="#444" stroke="#555" stroke-width="0.5"/>'
    svg += '<rect x="200" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="220" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="240" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="260" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="280" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="300" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="320" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<rect x="340" y="58" width="4" height="10" rx="1" fill="#555"/>'
    svg += '<line x1="198" y1="67" x2="351" y2="67" stroke="' + orange + '" stroke-width="0.5" opacity="0.4"/>'
  }

  // RTT on rack
  if (hasRTT && hasRack) {
    svg += '<path d="M210 64 L210 36 L290 30 L340 36 L340 64 Z" fill="#2a2a2a" stroke="#444" stroke-width="1"/>'
    svg += '<path d="M210 64 L290 30 L340 36" fill="none" stroke="#555" stroke-width="0.5"/>'
    svg += '<rect x="215" y="40" width="120" height="24" rx="1" fill="#1a1a1a" stroke="#333" stroke-width="0.5"/>'
    svg += '<text x="275" y="55" text-anchor="middle" fill="' + orange + '" font-size="7" font-family="monospace" letter-spacing="1">RTT</text>'
  }

  // RTT warning (no rack)
  if (hasRTT && !hasRack) {
    svg += '<rect x="195" y="45" width="155" height="20" rx="2" fill="rgba(248,113,113,0.15)" stroke="rgba(248,113,113,0.5)" stroke-width="0.5"/>'
    svg += '<text x="273" y="58" text-anchor="middle" fill="#f87171" font-size="7" font-family="monospace" letter-spacing="1">ADD RACK FOR RTT</text>'
  }

  // Body accent stripe
  svg += '<line x1="186" y1="138" x2="360" y2="138" stroke="' + orange + '" stroke-width="0.5" opacity="0.25"/>'

  // Door handles
  svg += '<rect x="230" y="128" width="16" height="4" rx="2" fill="#444"/>'
  svg += '<rect x="290" y="128" width="16" height="4" rx="2" fill="#444"/>'

  // Headlight — build color string separately to avoid ternary inside template literal
  const headlightFill = hasLights ? '#FFE066' : '#333'
  const headlightFilter = hasLights ? ' filter="url(#glow)"' : ''
  svg += '<path d="M415 108 L430 104 L440 115 L425 120 Z" fill="' + headlightFill + '" stroke="#444" stroke-width="0.5"' + headlightFilter + '/>'

  // Taillight
  svg += '<rect x="58" y="125" width="4" height="18" rx="1" fill="rgba(220,38,38,0.7)"/>'

  // Wheels
  const spokeColor = hasWheels ? orange : '#555'

  // Rear wheel
  svg += '<circle cx="130" cy="168" r="22" fill="#111" stroke="#444" stroke-width="2"/>'
  svg += '<circle cx="130" cy="168" r="15" fill="#0a0a0a" stroke="#333" stroke-width="1"/>'
  svg += '<circle cx="130" cy="168" r="5" fill="#222" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="130" y1="153" x2="130" y2="163" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="130" y1="173" x2="130" y2="183" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="115" y1="168" x2="125" y2="168" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="135" y1="168" x2="145" y2="168" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="119" y1="157" x2="126" y2="164" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="134" y1="172" x2="141" y2="179" stroke="' + spokeColor + '" stroke-width="1.5"/>'

  // Front wheel
  svg += '<circle cx="390" cy="168" r="22" fill="#111" stroke="#444" stroke-width="2"/>'
  svg += '<circle cx="390" cy="168" r="15" fill="#0a0a0a" stroke="#333" stroke-width="1"/>'
  svg += '<circle cx="390" cy="168" r="5" fill="#222" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="390" y1="153" x2="390" y2="163" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="390" y1="173" x2="390" y2="183" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="375" y1="168" x2="385" y2="168" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="395" y1="168" x2="405" y2="168" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="379" y1="157" x2="386" y2="164" stroke="' + spokeColor + '" stroke-width="1.5"/>'
  svg += '<line x1="394" y1="172" x2="401" y2="179" stroke="' + spokeColor + '" stroke-width="1.5"/>'

  svg += '</g>' // end body group

  // Vehicle name label
  if (vehicleName) {
    svg += '<text x="250" y="198" text-anchor="middle" fill="#6A6A6A" font-size="8" font-family="monospace" letter-spacing="2">' + vehicleName.toUpperCase() + '</text>'
  }

  // Scan line animation
  svg += '<line x1="0" y1="0" x2="0" y2="200" stroke="rgba(255,85,31,0.3)" stroke-width="1">'
  svg += '<animateTransform attributeName="transform" type="translate" from="-10 0" to="510 0" dur="6s" repeatCount="indefinite"/>'
  svg += '</line>'

  svg += '</svg>'
  return svg
}

// ─── Layer tag config ────────────────────────────────────────────────────────

interface LayerTag {
  key: string
  label: string
  active: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VehiclePreview() {
  const hasRack   = useBuildStore(s => s.hasRack())
  const hasRTT    = useBuildStore(s => s.hasRTT())
  const hasLights = useBuildStore(s => s.hasLights())
  const hasWinch  = useBuildStore(s => s.hasWinch())
  const hasArmor  = useBuildStore(s => s.hasArmor())
  const hasSusp   = useBuildStore(s => s.hasSusp())
  const hasWheels = useBuildStore(s => s.hasWheels())
  const vehicle   = useBuildStore(s => s.vehicle)

  const vehicleName = vehicle ? vehicle.name : ''

  const svgString = useMemo(
    () => buildSVGString(hasRack, hasRTT, hasLights, hasWinch, hasArmor, hasSusp, hasWheels, vehicleName),
    [hasRack, hasRTT, hasLights, hasWinch, hasArmor, hasSusp, hasWheels, vehicleName]
  )

  const layers: LayerTag[] = [
    { key: 'rack',     label: 'RACK',     active: hasRack   },
    { key: 'rtt',      label: 'RTT',      active: hasRTT    },
    { key: 'lighting', label: 'LIGHTING', active: hasLights },
    { key: 'lifted',   label: 'LIFTED',   active: hasSusp   },
    { key: 'wheels',   label: 'WHEELS',   active: hasWheels },
    { key: 'winch',    label: 'WINCH',    active: hasWinch  },
    { key: 'armor',    label: 'ARMOR',    active: hasArmor  },
  ]

  return (
    <div style={{ width: '100%', padding: '6px 12px 8px' }}>
      {/* SVG Preview — compact */}
      <div
        style={{ background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,85,31,0.10)', borderRadius: 4, padding: '4px 8px' }}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />

      {/* Active layer badges — only show items that are installed */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 5, justifyContent: 'center', minHeight: 0 }}>
        <AnimatePresence>
          {layers.filter(l => l.active).map(layer => (
            <motion.div
              key={layer.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 8,
                letterSpacing: '0.13em',
                padding: '1px 6px',
                borderRadius: 2,
                border: '1px solid rgba(255,85,31,0.5)',
                color: '#FF551F',
                background: 'rgba(255,85,31,0.08)',
              }}
            >
              {layer.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
