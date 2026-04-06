import useSWR from 'swr'

// Mock data for demo mode
const MOCK_LINES = [
  { id: 'l1', factory_id: 'f1', line_code: 'SEW-01', line_name: 'Sewing Line 1', line_type: 'SEWING', line_leader_name: 'Ahmed Khan', capacity_per_hour: 220, current_status: 'RUNNING', efficiency: 85 },
  { id: 'l2', factory_id: 'f1', line_code: 'SEW-02', line_name: 'Sewing Line 2', line_type: 'SEWING', line_leader_name: 'Fatima Ali', capacity_per_hour: 220, current_status: 'RUNNING', efficiency: 88 },
  { id: 'l3', factory_id: 'f1', line_code: 'FIN-01', line_name: 'Finishing Line 1', line_type: 'FINISHING', line_leader_name: 'Hassan Ali', capacity_per_hour: 200, current_status: 'DOWN', efficiency: 70 },
]

const MOCK_PLANS = [
  { id: 'p1', factory_id: 'f1', order_id: 'ORD-001', buyer_name: 'GAP', style: 'T-Shirt', color: 'Blue', size_range: 'XS-XL', planned_qty: 5000, target_end_date: '2026-04-10', status: 'IN_PROGRESS' },
  { id: 'p2', factory_id: 'f1', order_id: 'ORD-002', buyer_name: 'H&M', style: 'Polo', color: 'Red', size_range: 'S-XXL', planned_qty: 3000, target_end_date: '2026-04-15', status: 'IN_PROGRESS' },
]

const MOCK_PRODUCTION = [
  { id: 'hp1', factory_id: 'f1', line_id: 'l1', production_plan_id: 'p1', hour_slot: '8-9AM', hour_index: 0, produced_qty: 220, passed_qty: 215, defect_qty: 5, date: new Date().toISOString().split('T')[0] },
  { id: 'hp2', factory_id: 'f1', line_id: 'l1', production_plan_id: 'p1', hour_slot: '9-10AM', hour_index: 1, produced_qty: 210, passed_qty: 208, defect_qty: 2, date: new Date().toISOString().split('T')[0] },
  { id: 'hp3', factory_id: 'f1', line_id: 'l2', production_plan_id: 'p2', hour_slot: '8-9AM', hour_index: 0, produced_qty: 215, passed_qty: 212, defect_qty: 3, date: new Date().toISOString().split('T')[0] },
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
