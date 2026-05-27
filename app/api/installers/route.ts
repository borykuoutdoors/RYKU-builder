// TODO: Replace with Google Places API when GOOGLE_PLACES_API_KEY configured

import { NextRequest, NextResponse } from 'next/server'
import { MOCK_INSTALLERS } from '@/data/mockInstallers'
import type { Installer } from '@/types/installer'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const lat    = searchParams.get('lat')
  const lng    = searchParams.get('lng')
  const radius = searchParams.get('radius')
  const types  = searchParams.getAll('types[]')

  let installers: Installer[] = MOCK_INSTALLERS

  // Filter by service types if provided
  if (types.length > 0) {
    installers = installers.filter((inst) =>
      types.some((type) =>
        inst.tags.some(
          (tag) =>
            tag.toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }

  // TODO: When Google Places API is configured, use lat/lng/radius to query
  // the Places API for nearby shops with the relevant types, then merge or
  // replace MOCK_INSTALLERS with live results.
  // Example:
  //   const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
  //     ?location=${lat},${lng}&radius=${Number(radius) * 1609}
  //     &type=car_repair&key=${process.env.GOOGLE_PLACES_API_KEY}`
  //   const placesRes = await fetch(placesUrl)
  //   const placesData = await placesRes.json()
  //   ...transform placesData.results into Installer[]

  return NextResponse.json({ installers })
}
