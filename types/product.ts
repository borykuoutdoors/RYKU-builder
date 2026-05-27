export type ProductCategory =
  | 'Suspension'
  | 'Roof Racks'
  | 'Rooftop Tents'
  | 'Lighting'
  | 'Wheels & Tires'
  | 'Recovery'
  | 'Storage & Cargo'
  | 'Power & Comms'
  | 'Camping Gear'
  | 'Armor & Protection'

export type Difficulty = 'easy' | 'med' | 'hard'

export interface Product {
  id: string
  category: ProductCategory
  brand: string
  name: string
  emoji: string
  price: number           // USD
  labor: number           // Estimated install labor USD
  diff: Difficulty
  compat: string[]        // Vehicle IDs
  mission: string[]       // Mission IDs
  note: string
  img?: string          // Product image URL — replace with real manufacturer photo
  pop?: boolean
}
