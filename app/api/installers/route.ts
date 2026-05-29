import { NextRequest, NextResponse } from 'next/server'
import { installers as CATALOG_INSTALLERS } from '@/lib/catalog'
import type { Installer } from '@/types/installer'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const types = searchParams.getAll('types[]')

  let results: Installer[] = CATALOG_INSTALLERS

  if (types.length > 0) {
    results = results.filter((inst) =>
      types.some((type) =>
        inst.specialty.some(
          (s) =>
            s.toLowerCase().includes(type.toLowerCase()) ||
            type.toLowerCase().includes(s.toLowerCase())
        )
      )
    )
  }

  return NextResponse.json({ installers: results })
}
