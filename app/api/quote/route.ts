import { NextRequest, NextResponse } from 'next/server'
import { generateQuoteText } from '@/lib/buildUtils'
import type { Vehicle } from '@/types/vehicle'
import type { Product } from '@/types/product'

interface QuoteRequest {
  buildId?:   string          // optional — for future DB lookup
  buildName:  string
  vehicle:    Vehicle | null
  year:       string
  trim:       string
  items:      Record<string, Product>
  gearTotal:  number
  laborTotal: number
  budget:     number
}

export async function POST(req: NextRequest) {
  const body: QuoteRequest = await req.json()

  const {
    buildName,
    vehicle,
    year,
    trim,
    items,
    gearTotal,
    laborTotal,
    budget,
  } = body

  const quote = generateQuoteText(
    vehicle,
    year ?? '',
    trim  ?? '',
    buildName ?? 'MY BUILD',
    items     ?? {},
    gearTotal  ?? 0,
    laborTotal ?? 0,
    budget     ?? 0,
  )

  return NextResponse.json({ quote })
}
