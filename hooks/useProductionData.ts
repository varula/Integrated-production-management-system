'use client'

import useSWR from 'swr'
import { createClient } from '@supabase/supabase-js'
import { useFactory } from '@/lib/factory-context'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Individual Data Hooks ──────────────────────────────────────────────────

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['lines', factoryId] : null,
    async () => {
      const { data: rows, error } = await supabase
        .from('lines')
        .select('*')
        .eq('factory_id', factoryId!)
        .order('line_code')
      if (error) throw error
      return rows || []
    },
    { revalidateOnFocus: false }
  )
  return { lines: data ?? [], error, isLoading, mutate }
}

export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['production_plans', factoryId] : null,
    async () => {
      const { data: rows, error } = await supabase
        .from('production_plans')
        .select('*')
        .eq('factory_id', factoryId!)
        .order('created_at', { ascending: false })
      if (error) throw error
      return rows || []
    },
    { revalidateOnFocus: false }
  )
  return { plans: data ?? [], error, isLoading, mutate }
}

export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['hourly_production', factoryId, today] : null,
    async () => {
      const { data: rows, error } = await supabase
        .from('hourly_production')
        .select('*')
        .eq('factory_id', factoryId!)
        .eq('date', today)
        .order('hour_index')
      if (error) throw error
      return rows || []
    },
    { revalidateOnFocus: false }
  )
  return { production: data ?? [], error, isLoading, mutate }
}

export function useDowntimeData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['downtime', factoryId] : null,
    async () => {
      const { data: rows, error } = await supabase
        .from('downtime')
        .select('*')
        .eq('factory_id', factoryId!)
        .order('start_time', { ascending: false })
      if (error) throw error
      return rows || []
    },
    { revalidateOnFocus: false }
  )
  return { downtime: data ?? [], error, isLoading, mutate }
}

// ─── Composite Hook (used by all pages) ────────────────────────────────────

export function useProductionData() {
  const { factory } = useFactory()
  const factoryId = factory?.id ?? null

  const { lines, isLoading: ll } = useLinesData(factoryId)
  const { plans: productionPlans, isLoading: pl } = useProductionPlansData(factoryId)
  const { production: hourlyData, isLoading: hl } = useTodayProductionByLine(factoryId)
  const { downtime, isLoading: dl } = useDowntimeData(factoryId)

  return {
    lines: lines ?? [],
    productionPlans: productionPlans ?? [],
    hourlyData: hourlyData ?? [],
    downtime: downtime ?? [],
    factory,
    isLoading: !factoryId || ll || pl || hl || dl,
  }
}

// ─── CRUD helpers ──────────────────────────────────────────────────────────

export async function createProductionPlan(plan: {
  factory_id: string
  order_id: string
  buyer_name: string
  style: string
  color?: string
  size_range?: string
  planned_qty: number
  target_end_date: string
}) {
  const { data, error } = await supabase
    .from('production_plans')
    .insert([{ ...plan, status: 'NOT_STARTED' }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProductionPlan(id: string, updates: Partial<{
  order_id: string
  buyer_name: string
  style: string
  color: string
  size_range: string
  planned_qty: number
  target_end_date: string
  status: string
}>) {
  const { data, error } = await supabase
    .from('production_plans')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProductionPlan(id: string) {
  const { error } = await supabase
    .from('production_plans')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function upsertHourlyProduction(entry: {
  factory_id: string
  line_id: string
  production_plan_id: string
  hour_slot: string
  hour_index: number
  produced_qty: number
  passed_qty: number
  defect_qty: number
  date: string
}) {
  const { data, error } = await supabase
    .from('hourly_production')
    .upsert([entry], { onConflict: 'factory_id,line_id,date,hour_index' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function createDowntime(entry: {
  factory_id: string
  line_id: string
  start_time: string
  end_time: string
  duration_minutes: number
  reason: string
}) {
  const { data, error } = await supabase
    .from('downtime')
    .insert([entry])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDowntime(id: string) {
  const { error } = await supabase
    .from('downtime')
    .delete()
    .eq('id', id)
  if (error) throw error
}
