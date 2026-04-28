import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://xyzxyzxyzxyzxyz.supabase.co'
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5enh5enh5enh5enh5eiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDB9.abcdefghijklmnopqrstuvwxyz'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      factories: {
        Row: {
          id: string
          name: string
          code: string
          location: string
          created_at: string
          updated_at: string
        }
      }
      lines: {
        Row: {
          id: string
          factory_id: string
          line_code: string
          line_name: string
          line_type: 'SEWING' | 'FINISHING'
          line_leader_name: string | null
          capacity_per_hour: number
          created_at: string
          updated_at: string
        }
      }
      production_plans: {
        Row: {
          id: string
          factory_id: string
          order_id: string
          buyer_name: string
          style: string
          color: string | null
          size_range: string | null
          planned_qty: number
          target_end_date: string
          status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
          created_at: string
          updated_at: string
        }
      }
      hourly_production: {
        Row: {
          id: string
          factory_id: string
          line_id: string
          production_plan_id: string
          hour_slot: string
          hour_index: number
          produced_qty: number
          passed_qty: number
          defect_qty: number
          date: string
          created_at: string
          updated_at: string
        }
      }
      downtime: {
        Row: {
          id: string
          factory_id: string
          line_id: string
          start_time: string
          end_time: string
          duration_minutes: number
          reason: 'MECHANICAL' | 'ELECTRICAL' | 'MATERIAL' | 'SKILL' | 'POWER' | 'OTHER'
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
