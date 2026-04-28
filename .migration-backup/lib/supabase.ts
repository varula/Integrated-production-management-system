import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
