'use client'

import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import { useFactory } from '@/lib/factory-context'

// Hook for fetching all lines for a factory
export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['lines', factoryId] : null,
    async () => {
      if (!factoryId) return []
      const { data: lines, error } = await supabase
        .from('lines')
        .select('*')
        .eq('factory_id', factoryId)
      if (error) throw error
      return lines || []
    },
    { revalidateOnFocus: false }
  )
  return { lines: data || [], error, isLoading, mutate }
}

// Hook for fetching all production plans for a factory
export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['production_plans', factoryId] : null,
    async () => {
      if (!factoryId) return []
      const { data: plans, error } = await supabase
        .from('production_plans')
        .select('*')
        .eq('factory_id', factoryId)
      if (error) throw error
      return plans || []
    },
    { revalidateOnFocus: false }
  )
  return { plans: data || [], error, isLoading, mutate }
}

// Hook for fetching today's hourly production
export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const today = new Date().toISOString().split('T')[0]
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['today_production', factoryId, today] : null,
    async () => {
      if (!factoryId) return []
      const { data: production, error } = await supabase
        .from('hourly_production')
        .select('*')
        .eq('factory_id', factoryId)
        .eq('date', today)
      if (error) throw error
      return production || []
    },
    { revalidateOnFocus: false }
  )
  return { production: data || [], error, isLoading, mutate }
}

// Hook for fetching downtime records
export function useDowntimeData(factoryId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR(
    factoryId ? ['downtime', factoryId] : null,
    async () => {
      if (!factoryId) return []
      const { data: downtime, error } = await supabase
        .from('downtime')
        .select('*')
        .eq('factory_id', factoryId)
        .order('start_time', { ascending: false })
      if (error) throw error
      return downtime || []
    },
    { revalidateOnFocus: false }
  )
  return { downtime: data || [], error, isLoading, mutate }
}

// Hook for fetching a single production plan
export function useProductionPlan(planId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    planId ? ['production_plan', planId] : null,
    async () => {
      if (!planId) return null
      const { data: plan, error } = await supabase
        .from('production_plans')
        .select('*')
        .eq('id', planId)
        .single()
      if (error) throw error
      return plan
    },
    { revalidateOnFocus: false }
  )
  return { plan: data, error, isLoading, mutate }
}

// Hook for fetching a single line
export function useLine(lineId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    lineId ? ['line', lineId] : null,
    async () => {
      if (!lineId) return null
      const { data: line, error } = await supabase
        .from('lines')
        .select('*')
        .eq('id', lineId)
        .single()
      if (error) throw error
      return line
    },
    { revalidateOnFocus: false }
  )
  return { line: data, error, isLoading, mutate }
}

// Composite hook - Main hook used by all pages
export function useProductionData() {
  try {
    const { factory } = useFactory()
    const factoryId = factory?.id

    const { lines, isLoading: linesLoading } = useLinesData(factoryId)
    const { plans: productionPlans, isLoading: plansLoading } = useProductionPlansData(factoryId)
    const { production: hourlyData, isLoading: hourlyLoading } = useTodayProductionByLine(factoryId)
    const { downtime, isLoading: downtimeLoading } = useDowntimeData(factoryId)

    const isLoading = !factoryId || linesLoading || plansLoading || hourlyLoading

    return {
      lines: lines || [],
      productionPlans: productionPlans || [],
      hourlyData: hourlyData || [],
      downtime: downtime || [],
      factory,
      isLoading,
    }
  } catch (err) {
    console.error('[v0] useProductionData error:', err)
    return {
      lines: [],
      productionPlans: [],
      hourlyData: [],
      downtime: [],
      factory: null,
      isLoading: true,
    }
  }
}
