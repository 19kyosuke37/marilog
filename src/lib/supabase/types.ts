export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string
          gender: '男性' | '女性' | 'その他' | null
          age: number | null
          user_type: 'married' | 'before'
          trust_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname: string
          gender?: '男性' | '女性' | 'その他' | null
          age?: number | null
          user_type: 'married' | 'before'
          trust_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          nickname?: string
          gender?: '男性' | '女性' | 'その他' | null
          age?: number | null
          user_type?: 'married' | 'before'
          trust_points?: number
          updated_at?: string
        }
      }
      senpai_profiles: {
        Row: {
          id: string
          user_id: string
          age_at_marriage: number | null
          partner_age_at_marriage: number | null
          income_at_marriage: number | null
          saving_at_marriage: number | null
          area: string | null
          dating_period: string | null
          marriage_triggers: string[]
          satisfaction: number | null
          current_status: string | null
          reflection: string | null
          message_to_undecided: string | null
          engagement_ring: number | null
          wedding_ring: number | null
          wedding_cost: number | null
          honeymoon_cost: number | null
          has_kids: 'yes' | 'no' | 'plan' | null
          kids_count: number | null
          first_child_year: number | null
          first_child_saving: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age_at_marriage?: number | null
          partner_age_at_marriage?: number | null
          income_at_marriage?: number | null
          saving_at_marriage?: number | null
          area?: string | null
          dating_period?: string | null
          marriage_triggers?: string[]
          satisfaction?: number | null
          current_status?: string | null
          reflection?: string | null
          message_to_undecided?: string | null
          engagement_ring?: number | null
          wedding_ring?: number | null
          wedding_cost?: number | null
          honeymoon_cost?: number | null
          has_kids?: 'yes' | 'no' | 'plan' | null
          kids_count?: number | null
          first_child_year?: number | null
          first_child_saving?: number | null
          created_at?: string
        }
        Update: {
          age_at_marriage?: number | null
          partner_age_at_marriage?: number | null
          income_at_marriage?: number | null
          saving_at_marriage?: number | null
          area?: string | null
          dating_period?: string | null
          marriage_triggers?: string[]
          satisfaction?: number | null
          current_status?: string | null
          reflection?: string | null
          message_to_undecided?: string | null
          engagement_ring?: number | null
          wedding_ring?: number | null
          wedding_cost?: number | null
          honeymoon_cost?: number | null
          has_kids?: 'yes' | 'no' | 'plan' | null
          kids_count?: number | null
          first_child_year?: number | null
          first_child_saving?: number | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          post_type: 'married' | 'before'
          concern_tags: string[]
          body: string
          anxiety_level: number | null
          needed_savings: number | null
          ring_budget: number | null
          work_plan: string | null
          kids_plan: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_type: 'married' | 'before'
          concern_tags?: string[]
          body: string
          anxiety_level?: number | null
          needed_savings?: number | null
          ring_budget?: number | null
          work_plan?: string | null
          kids_plan?: string | null
          created_at?: string
        }
        Update: {
          concern_tags?: string[]
          body?: string
          anxiety_level?: number | null
          needed_savings?: number | null
          ring_budget?: number | null
          work_plan?: string | null
          kids_plan?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          body: string
          created_at?: string
        }
        Update: {
          body?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: Record<string, never>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
