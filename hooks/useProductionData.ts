import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import { useFactory } from '@/lib/factory-context'

/**
 * Composite hook that combines lines, production plans, and hourly data
 * This is the main hook used by pages
 */
export function useProductionData() {
  try {
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
      factory,
    }
  } catch (err) {
    console.log('[v0] useProductionData hook error:', err)
    return {
      lines: [],
      productionPlans: [],
      hourlyData: [],
      isLoading: true,
      factory: null,
    }
  }
}

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['lines', factoryId] : null,
    () =>
      supabase
        .from('lines')
        .select('*')
        .eq('factory_id', factoryId!)
        .then((res) => res.data),
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
    () =>
      supabase
        .from('production_plans')
        .select('*')
        .eq('factory_id', factoryId!)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  return {
    plans: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}

export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const today = new Date().toISOString().split('T')[0]

  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['today_production', factoryId] : null,
    () =>
      supabase
        .from('hourly_production')
        .select('*')
        .eq('factory_id', factoryId!)
        .eq('date', today)
        .then((res) => res.data),
    { revalidateOnFocus: false }
  )

  return {
    production: (data as any) || [],
    error,
    isLoading,
    mutate,
  }
}
