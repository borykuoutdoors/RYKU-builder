export type ProductCategory =
  | 'Suspension'
  | 'Roof Racks'
  | 'Rooftop Tents'
  | 'Lighting'
  | 'Wheels & Tires'
  | 'Recovery'
  | 'Storage & Cargo'
  | 'Power Systems'
  | 'Water Systems'
  | 'Camping'
  | 'Communications'
  | 'Interior Upgrades'
  | 'Armor'

export type Difficulty = 'easy' | 'med' | 'hard'

export interface Product {
  id:       string
  category: ProductCategory
  brand:    string
  name:     string
  emoji:    string
  price:    number           // USD
  labor:    number           // Estimated install labor USD
  diff:     Difficulty
  compat:   string[]        // Vehicle IDs
  mission:  string[]        // Mission IDs
  note:     string
  img?:     string
  pop?:     boolean
}
