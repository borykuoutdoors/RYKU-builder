import type { Vehicle } from './vehicle'
import type { Product } from './product'

export interface BuildItem {
  product: Product
  addedAt: number
}

export interface SavedBuild {
  id: string
  userId: string
  name: string
  vehicleId: string
  vehicleYear: string
  vehicleTrim: string
  vehicleDrive: string
  mission: string
  budget: number
  items: Record<string, Product>
  gearTotal: number
  laborTotal: number
  buildTotal: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface BuildStep {
  number: 1 | 2 | 3 | 4
  label: string
}
