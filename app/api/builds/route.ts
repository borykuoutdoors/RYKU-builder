// TODO: Replace with Supabase builds table when configured

import { NextRequest, NextResponse } from 'next/server'
import type { SavedBuild } from '@/types/build'

// In-memory store for development
const buildsStore: SavedBuild[] = []

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function GET() {
  return NextResponse.json({ builds: buildsStore })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const now = new Date().toISOString()
  const newBuild: SavedBuild = {
    id:           generateUUID(),
    userId:       body.userId        ?? 'anonymous',
    name:         body.name          ?? 'MY BUILD',
    vehicleId:    body.vehicleId     ?? '',
    vehicleYear:  body.vehicleYear   ?? '',
    vehicleTrim:  body.vehicleTrim   ?? '',
    vehicleDrive: body.vehicleDrive  ?? '',
    mission:      body.mission       ?? '',
    budget:       body.budget        ?? 0,
    items:        body.items         ?? {},
    gearTotal:    body.gearTotal     ?? 0,
    laborTotal:   body.laborTotal    ?? 0,
    buildTotal:   body.buildTotal    ?? 0,
    isPublic:     body.isPublic      ?? false,
    createdAt:    now,
    updatedAt:    now,
  }

  buildsStore.push(newBuild)

  return NextResponse.json(newBuild, { status: 201 })
}
