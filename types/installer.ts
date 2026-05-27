export interface Installer {
  id: string
  name: string
  tags: string[]
  address: string
  rating: number
  reviewCount: number
  distance: string
  placeId?: string
  phone?: string
  hours?: string
  website?: string
}
