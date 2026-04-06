import useSWR from 'swr'
import { useFactory } from '@/lib/factory-context'

// Mock data for demo mode
const MOCK_LINES = [
  { id: 'l1', factory_id: 'f1', line_code: 'SEW-01', line_name: 'Sewing Line 1', line_type: 'SEWING', line_leader_name: 'Ahmed Khan', capacity_per_hour: 220, current_status: 'RUNNING', efficiency: 85 },
  { id: 'l2', factory_id: 'f1', line_code: 'SEW-02', line_name: 'Sewing Line 2', line_type: 'SEWING', line_leader_name: 'Fatima Ali', capacity_per_hour: 220, current_status: 'RUNNING', efficiency: 88 },
]

const MOCK_PLANS = [
  { id: 'p1', factory_id: 'f1', order_id: 'ORD-001', buyer_name: 'GAP', style: 'T-Shirt', color: 'Blue', size_range: 'XS-XL', planned_qty: 5000, target_end_date: '2026-04-10', status: 'IN_PROGRESS' },
]

const MOCK_PRODUCTION = [
  { id: 'hp1', factory_id: 'f1', line_id: 'l1', production_plan_id: 'p1', hour_slot: '8-9AM', hour_index: 0, produced_qty: 220, passed_qty: 215, defect_qty: 5, date: new Date().toISOString().split('T')[0] },
  { id: 'hp2', factory_id: 'f1', line_id: 'l1', production_plan_id: 'p1', hour_slot: '9-10AM', hour_index: 1, produced_qty: 210, passed_qty: 208, defect_qty: 2, date: new Date().toISOString().split('T')[0] },
]

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? ['lines', factoryId] : null,
    async () => MOCK_LINES.filter(l => l.factory_id === factoryId),
    { revalidateOnFocus: false }
  )
  return { lines: data ?? [], error, isLoading, mutate: () => {} }
}

export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? ['production_plans', factoryId] : null,
    async () => MOCK_PLANS.filter(p => p.factory_id === factoryId),
    { revalidateOnFocus: false }
  )
  return { plans: data ?? [], error, isLoading, mutate: () => {} }
}

export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? ['today_production', factoryId] : null,
    async () => MOCK_PRODUCTION.filter(p => p.factory_id === factoryId),
    { revalidateOnFocus: false }
  )
  return { production: data ?? [], error, isLoading, mutate: () => {} }
}

export function useDowntimeData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? ['downtime', factoryId] : null,
    async () => [],
    { revalidateOnFocus: false }
  )
  return { downtime: data ?? [], error, isLoading, mutate: () => {} }
}
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

// ─── COMPOSITE HOOK - DEPRECATED (Pages should use individual hooks instead) ────

// export function useProductionData() {
//   const { factory } = useFactory()
//   const factoryId = factory?.id ?? null
//   const { lines, isLoading: ll } = useLinesData(factoryId)
//   const { plans: productionPlans, isLoading: pl } = useProductionPlansData(factoryId)
//   const { production: hourlyData, isLoading: hl } = useTodayProductionByLine(factoryId)
//   const { downtime, isLoading: dl } = useDowntimeData(factoryId)
//   return {
//     lines: lines ?? [],
//     productionPlans: productionPlans ?? [],
//     hourlyData: hourlyData ?? [],
//     downtime: downtime ?? [],
//     factory,
//     isLoading: !factoryId || ll || pl || hl || dl,
//   }
// }

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
