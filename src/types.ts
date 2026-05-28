export type StrainState = 'good' | 'meh' | 'sore'

export type StrainDimension = 'eyes' | 'neck' | 'mind'

export type StrainCheckIn = Record<StrainDimension, StrainState>

export type Activity = {
  id: number
  name: string
  description: string | null
  helps_eyes: boolean
  helps_neck: boolean
  helps_mind: boolean
  screen_free: boolean
  icon: string | null
  created_at: string
}

export type Break = {
  id: number
  eyes_state: StrainState
  neck_state: StrainState
  mind_state: StrainState
  suggested_activity_id: number | null
  did_activity: boolean | null
  helped: boolean | null
  created_at: string
}

export type SessionStrainFlags = {
  eyes: boolean
  neck: boolean
}

export type MockUser = {
  name: string
  contacts: string[]
  pet: string | null
  spots: string[]
  hobbies: string[]
  favoriteActivityIds: number[]
  somethingNewIds: number[]
}
