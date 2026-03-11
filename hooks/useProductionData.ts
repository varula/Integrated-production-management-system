import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import { useFactory } from '@/lib/factory-context'

// Fetcher function for SWR
async function fetcher(query: () => Promise<any>) {
  const result = await query()
  if (result.error) throw result.error
  return result.data
}

/**
 * Composite hook that combines lines, production plans, and hourly data
 * This is the main hook used by pages
 */
export function useProductionData() {
  const { factory } = useFactory()
  const factoryId = factory?.id

  const { lines } = useLinesData(factoryId)
  const { plans: productionPlans } = useProductionPlansData(factoryId)
  const { production: hourlyData } = useTodayProductionByLine(factoryId)

  const isLoading = !factoryId || !lines || !productionPlans || !hourlyData

  return {
    lines: lines || [],
    productionPlans: productionPlans || [],
    hourlyData: hourlyData || [],
    isLoading,
  }
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

