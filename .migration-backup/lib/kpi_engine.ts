/**
 * KPI Engine — All production metric calculations
 */

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface FactoryMetrics {
  totalProduced: number
  totalPassed: number
  totalDefect: number
  efficiency: number
  dhu: number
  rft: number
  downtimeMinutes: number
}

// ─── Main composite KPI function ────────────────────────────────────────────

export function calculateKPIs(data: {
  hourlyData: any[]
  lines: any[]
  productionPlans: any[]
}): FactoryMetrics {
  const hourly = data.hourlyData ?? []
  const lines = data.lines ?? []

  const totalProduced = hourly.reduce((s: number, h: any) => s + (h.produced_qty || 0), 0)
  const totalPassed = hourly.reduce((s: number, h: any) => s + (h.passed_qty || 0), 0)
  const totalDefect = hourly.reduce((s: number, h: any) => s + (h.defect_qty || 0), 0)
  const avgEff = lines.length > 0
    ? lines.reduce((s: number, l: any) => s + (l.efficiency || 0), 0) / lines.length
    : 0

  return {
    totalProduced,
    totalPassed,
    totalDefect,
    efficiency: avgEff,
    dhu: calculateDHU(totalDefect, totalProduced),
    rft: calculateRFT(totalPassed, totalProduced),
    downtimeMinutes: 0,
  }
}

// ─── Utility metric functions ────────────────────────────────────────────────

export function calculateDHU(defectQty: number, producedQty: number): number {
  if (producedQty === 0) return 0
  return (defectQty / producedQty) * 100
}

export function calculateRFT(passedQty: number, producedQty: number): number {
  if (producedQty === 0) return 100
  return (passedQty / producedQty) * 100
}

export function calculateLineEfficiency(actual: number, capacity: number, hours = 1): number {
  const expected = capacity * hours
  if (expected === 0) return 0
  return (actual / expected) * 100
}

export function calculateDefectRate(defectQty: number, producedQty: number): number {
  if (producedQty === 0) return 0
  return (defectQty / producedQty) * 100
}

export function calculateTargetAchievement(actual: number, target: number): number {
  if (target === 0) return 0
  return (actual / target) * 100
}
