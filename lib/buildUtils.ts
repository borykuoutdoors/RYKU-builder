import type { Product } from '@/types/product'
import type { Vehicle } from '@/types/vehicle'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function groupByCategory(items: Record<string, Product>): Record<string, Product[]> {
  const groups: Record<string, Product[]> = {}
  Object.values(items).forEach(p => {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category].push(p)
  })
  return groups
}

export function checkCompatibility(
  items: Record<string, Product>,
  vehicleId: string
): { compatible: string[]; incompatible: string[] } {
  const compatible: string[] = []
  const incompatible: string[] = []
  Object.values(items).forEach(p => {
    if (p.compat.includes(vehicleId)) compatible.push(p.id)
    else incompatible.push(p.id)
  })
  return { compatible, incompatible }
}

export function getBuildWarnings(
  items: Record<string, Product>,
  mission: string | null
): string[] {
  const warnings: string[] = []
  const vals = Object.values(items)
  const hasRack = vals.some(p => p.category === 'Roof Racks')
  const hasRTT  = vals.some(p => p.category === 'Rooftop Tents')
  const hasShelter = hasRTT || vals.some(p => p.category === 'Camping' && p.id === 'cg3')
  const hasWinch = vals.some(p => ['rc1', 'rc2'].includes(p.id))

  if (hasRTT && !hasRack) warnings.push('RTT requires a roof rack to mount.')
  if (!hasShelter && mission && ['overland', 'camping', 'expedition'].includes(mission)) {
    warnings.push('No shelter selected — recommended for this mission.')
  }
  if (!hasWinch && mission === 'recovery') {
    warnings.push('No winch selected — critical for recovery missions.')
  }
  return warnings
}

export function generateQuoteText(
  vehicle: Vehicle | null,
  year: string,
  trim: string,
  buildName: string,
  items: Record<string, Product>,
  gearTotal: number,
  laborTotal: number,
  budget: number
): string {
  const lines: string[] = []
  lines.push('═══════════════════════════════════════════════════')
  lines.push('  BŌRYKU BUILD QUOTE')
  lines.push('═══════════════════════════════════════════════════')
  lines.push(`  Build: ${buildName}`)
  if (vehicle) lines.push(`  Vehicle: ${year} ${vehicle.name} ${trim}`)
  lines.push(`  Generated: ${new Date().toLocaleDateString()}`)
  lines.push('───────────────────────────────────────────────────')

  const grouped = groupByCategory(items)
  Object.entries(grouped).forEach(([cat, products]) => {
    lines.push(`\n  ${cat.toUpperCase()}`)
    products.forEach(p => {
      lines.push(`    ${p.brand} ${p.name}`)
      lines.push(`      Parts: $${p.price.toLocaleString()}  |  Est. Labor: $${p.labor.toLocaleString()}`)
    })
  })

  lines.push('\n───────────────────────────────────────────────────')
  lines.push(`  GEAR SUBTOTAL:  $${gearTotal.toLocaleString()}`)
  lines.push(`  EST. LABOR:     $${laborTotal.toLocaleString()}`)
  lines.push(`  TOTAL BUILD:    $${(gearTotal + laborTotal).toLocaleString()}`)
  lines.push(`  BUDGET:         $${budget.toLocaleString()}`)
  const rem = budget - gearTotal - laborTotal
  lines.push(`  REMAINING:      ${rem >= 0 ? '$' + rem.toLocaleString() : '-$' + Math.abs(rem).toLocaleString()}`)
  lines.push('═══════════════════════════════════════════════════')
  lines.push('  BŌRYKU / RYKU — CONTROL THE CHAOS')
  lines.push('  boryku.com')
  lines.push('═══════════════════════════════════════════════════')
  return lines.join('\n')
}
