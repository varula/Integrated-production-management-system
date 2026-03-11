import useSWR from 'swr'
import { supabase } from '@/lib/supabase'

// Fetcher function for SWR
async function fetcher(query: () => Promise<any>) {
  const result = await query()
  if (result.error) throw result.error
  return result.data
}

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['lines', factoryId] : null,
    () => supabase
      .from('lines')
      .select('*')
      .eq('factory_id', factoryId!)
      .order('line_code'),
    { revalidateOnFocus: false }
  )

  return {
    lines: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['production_plans', factoryId] : null,
    () => supabase
      .from('production_plans')
      .select('*')
      .eq('factory_id', factoryId!)
      .order('created_at', { ascending: false }),
    { revalidateOnFocus: false }
  )

  return {
    plans: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useHourlyProductionData(
  factoryId: string | null | undefined,
  lineId: string | null | undefined,
  date: string | null | undefined
) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId && lineId && date ? ['hourly_production', factoryId, lineId, date] : null,
    () => {
      let query = supabase
        .from('hourly_production')
        .select('*')
        .eq('factory_id', factoryId!)
        .eq('line_id', lineId!)
        .eq('date', date!)

      return query
    },
    { revalidateOnFocus: false }
  )

  return {
    hourly: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useDowntimeData(
  factoryId: string | null | undefined,
  lineId: string | null | undefined,
  startDate: string | null | undefined,
  endDate: string | null | undefined
) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId && startDate && endDate ? ['downtime', factoryId, lineId, startDate, endDate] : null,
    async () => {
      let query = supabase
        .from('downtime')
        .select('*')
        .eq('factory_id', factoryId!)
        .gte('start_time', `${startDate}T00:00:00`)
        .lte('end_time', `${endDate}T23:59:59`)

      if (lineId) {
        query = query.eq('line_id', lineId!)
      }

      return query.order('start_time', { ascending: false })
    },
    { revalidateOnFocus: false }
  )

  return {
    downtime: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useAllLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['all_lines', factoryId] : null,
    async () => {
      const { data: lines } = await supabase
        .from('lines')
        .select('*')
        .eq('factory_id', factoryId!)
        .order('line_code')

      return lines || []
    },
    { revalidateOnFocus: false }
  )

  return {
    lines: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['today_production', factoryId] : null,
    async () => {
      const { data: production } = await supabase
        .from('hourly_production')
        .select(`
          *,
          lines:line_id(line_code, line_name, capacity_per_hour)
        `)
        .eq('factory_id', factoryId!)
        .eq('date', today)

      return production || []
    },
    { revalidateOnFocus: false }
  )

  return {
    production: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}
