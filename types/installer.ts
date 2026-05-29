export interface Installer {
  id:        string
  name:      string
  city:      string
  state:     string
  lat:       number
  lng:       number
  distance?: number
  rating:    number
  reviews:   number
  leadTime:  string
  specialty: string[]
  services:  string[]
  verified:  boolean
  tier:      'standard' | 'certified' | 'elite'
  thumb:     string
  phone?:    string
}
