// TODO: Replace with OpenAI GPT-4o call when OPENAI_API_KEY is configured

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/data/products'
import type { Product } from '@/types/product'

interface RecommendationRequest {
  vehicleId:     string
  missionId:     string
  budget:        number
  selectedItems: string[]   // array of product IDs already selected
}

export async function POST(req: NextRequest) {
  const body: RecommendationRequest = await req.json()
  const { vehicleId, missionId, budget, selectedItems } = body

  // Filter: compatible with vehicle + mission, not already selected
  const candidates = PRODUCTS.filter(p => {
    const vehicleOk  = vehicleId ? p.compat.includes(vehicleId) : true
    const missionOk  = missionId ? p.mission.includes(missionId) : true
    const notSelected = !selectedItems?.includes(p.id)
    return vehicleOk && missionOk && notSelected
  })

  // Score: prefer popular items, then by price-to-budget fit
  const scored = candidates.map(p => ({
    product: p,
    score:
      (p.pop ? 10 : 0) +
      (p.price + p.labor <= budget ? 5 : 0) +
      (p.diff === 'easy' ? 2 : p.diff === 'med' ? 1 : 0),
  }))

  scored.sort((a, b) => b.score - a.score)

  const recommendations: Product[] = scored.slice(0, 5).map(s => s.product)

  // Compatibility notes keyed by product ID
  const compatibilityNotes: Record<string, string> = {}
  recommendations.forEach(p => {
    if (p.note) compatibilityNotes[p.id] = p.note
  })

  return NextResponse.json({ recommendations, compatibilityNotes })
}
