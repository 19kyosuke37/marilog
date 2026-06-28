export type Comment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  nickname: string
  trust_points: number
  likes_count: number
  liked_by_me: boolean
}

export type Post = {
  id: string
  user_id: string
  post_type: 'married' | 'before'
  concern_tags: string[]
  body: string
  anxiety_level: number | null
  created_at: string
  nickname: string
  age: number | null
  area: string | null
  satisfaction: number | null
  comments: Comment[]
}

export type Profile = {
  id: string
  nickname: string
  age: number | null
  gender: string | null
  user_type: 'married' | 'before'
  trust_points: number
}
