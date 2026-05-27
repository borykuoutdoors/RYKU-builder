import type { Vehicle } from '@/types/vehicle'

export const VEHICLES: Vehicle[] = [
  {
    id: 'tacoma',
    name: 'Toyota Tacoma',
    sub: 'Midsize Truck',
    emoji: '🛻',
    trims: ['TRD Pro', 'TRD Off-Road', 'Trail Edition', 'SR5 Premium', 'Limited'],
    drives: ['4WD Manual', '4WD Automatic', '2WD'],
  },
  {
    id: '4runner',
    name: 'Toyota 4Runner',
    sub: 'Body-on-Frame SUV',
    emoji: '🚙',
    trims: ['TRD Pro', 'TRD Off-Road', 'SR5 Premium', 'Venture Edition', 'Limited'],
    drives: ['4WD Part-Time', '4WD Full-Time', '2WD'],
  },
  {
    id: 'bronco',
    name: 'Ford Bronco',
    sub: 'Off-Road SUV',
    emoji: '🐴',
    trims: ['Raptor', 'Badlands', 'Wildtrak', 'Outer Banks', 'Big Bend', 'Base'],
    drives: ['4WD Manual', '4WD Automatic'],
  },
  {
    id: 'gladiator',
    name: 'Jeep Gladiator',
    sub: 'Off-Road Pickup',
    emoji: '⚔️',
    trims: ['Rubicon', 'Mojave', 'Overland', 'Sport S', 'Farout'],
    drives: ['4WD 6-Speed Manual', '4WD 8-Speed Auto'],
  },
  {
    id: 'wrangler',
    name: 'Jeep Wrangler',
    sub: 'Off-Road SUV',
    emoji: '🏔️',
    trims: ['Rubicon 392', 'Rubicon 4xe', 'Rubicon', 'Sahara', 'Willys', 'Sport'],
    drives: ['4WD Manual', '4WD Automatic'],
  },
  {
    id: 'f150',
    name: 'Ford F-150',
    sub: 'Full-Size Truck',
    emoji: '🚛',
    trims: ['Raptor R', 'Raptor', 'Tremor', 'FX4 Off-Road', 'Lariat', 'XLT'],
    drives: ['4WD Automatic', '2WD'],
  },
  {
    id: 'tundra',
    name: 'Toyota Tundra',
    sub: 'Full-Size Truck',
    emoji: '🦬',
    trims: ['TRD Pro', 'Capstone', 'Platinum', 'SR5 Premium', 'Limited'],
    drives: ['4WD Automatic', '2WD'],
  },
  {
    id: 'ram1500',
    name: 'Ram 1500 TRX',
    sub: 'Full-Size Truck',
    emoji: '🐏',
    trims: ['TRX Launch Ed.', 'TRX Level 2', 'TRX', 'Rebel', 'Limited'],
    drives: ['4WD Automatic'],
  },
  {
    id: 'colorado',
    name: 'Colorado ZR2',
    sub: 'Midsize Truck',
    emoji: '⛰️',
    trims: ['ZR2 Bison', 'ZR2', 'Z71', 'LT', 'WT'],
    drives: ['4WD Automatic', '2WD'],
  },
  {
    id: 'frontier',
    name: 'Nissan Frontier',
    sub: 'Midsize Truck',
    emoji: '🌵',
    trims: ['Pro-4X', 'SV', 'S', 'Desert Runner'],
    drives: ['4WD Manual', '4WD Auto', '2WD'],
  },
]

export function getVehicleById(id: string): Vehicle | undefined {
  return VEHICLES.find(v => v.id === id)
}
