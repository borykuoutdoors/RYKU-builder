export type MissionId =
  | 'overland'
  | 'camping'
  | 'tactical'
  | 'expedition'
  | 'recovery'
  | 'daily'
  | 'offroad'
  | 'utility'

export interface Mission {
  id: MissionId
  name: string
  description: string
  icon: string
}
