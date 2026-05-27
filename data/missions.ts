import type { Mission } from '@/types/mission'

export const MISSIONS: Mission[] = [
  {
    id: 'overland',
    name: 'OVERLAND',
    description: 'Long-range self-supported travel across remote terrain',
    icon: '🗺️',
  },
  {
    id: 'camping',
    name: 'CAMPING',
    description: 'Basecamp setup, comfort, shelter, and cooking systems',
    icon: '⛺',
  },
  {
    id: 'tactical',
    name: 'TACTICAL',
    description: 'Stealth, utility, and mission-ready load-out configuration',
    icon: '🎯',
  },
  {
    id: 'expedition',
    name: 'EXPEDITION',
    description: 'Multi-week backcountry missions requiring full self-sufficiency',
    icon: '🧭',
  },
  {
    id: 'recovery',
    name: 'RECOVERY',
    description: 'Winching, traction recovery, and extraction operations',
    icon: '🪝',
  },
  {
    id: 'daily',
    name: 'DAILY ADV',
    description: 'Street to trail — maximum capability with daily driver livability',
    icon: '🛣️',
  },
  {
    id: 'offroad',
    name: 'OFF-ROAD',
    description: 'Rock crawling, trail running, and technical terrain mastery',
    icon: '🪨',
  },
  {
    id: 'utility',
    name: 'UTILITY',
    description: 'Work-ready platform with cargo, towing, and hauling focus',
    icon: '🔧',
  },
]

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id)
}
