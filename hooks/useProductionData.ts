import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

export function useLinesData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? `/api/data/lines?factory_id=${factoryId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )
  return { 
    lines: data?.data ?? [], 
    error, 
    isLoading, 
    mutate: () => {} 
  }
}

export function useProductionPlansData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? `/api/data/production-plans?factory_id=${factoryId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )
  return { 
    plans: data?.data ?? [], 
    error, 
    isLoading, 
    mutate: () => {} 
  }
}

export function useTodayProductionByLine(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? `/api/data/hourly-production?factory_id=${factoryId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )
  return { 
    production: data?.data ?? [], 
    error, 
    isLoading, 
    mutate: () => {} 
  }
}

export function useDowntimeData(factoryId: string | null | undefined) {
  const { data, error, isLoading } = useSWR(
    factoryId ? `/api/data/downtime?factory_id=${factoryId}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true }
  )
  return { 
    downtime: data?.data ?? [], 
    error, 
    isLoading, 
    mutate: () => {} 
  }
}
