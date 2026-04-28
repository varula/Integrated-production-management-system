import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import { useFactory } from '@/lib/factory-context'

const hasRealSupabase = () =>
  !!(import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.startsWith('https://xyzxyz'))

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId && hasRealSupabase() ? ['lines', factoryId] : null,
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
  return { lines: data ?? [], error, isLoading: factoryId ? isLoading : false, mutate }
}

export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId && hasRealSupabase() ? ['production_plans', factoryId] : null,
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
    factoryId && hasRealSupabase() ? ['hourly_production', factoryId, today] : null,
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
    factoryId && hasRealSupabase() ? ['downtime', factoryId] : null,
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
