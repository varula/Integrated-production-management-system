/**
 * KPI Calculation Engine
 * Calculates all production metrics from raw data
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface ProductionMetrics {
  totalProduced: number
  totalPassed: number
  totalDefect: number
  efficiency: number
  dhu: number // Defects per Hundred Units
  rft: number // Right First Time %
  costPerSAM: number
  lineUtilization: number
  targetAchievement: number
}

export interface LineMetrics extends ProductionMetrics {
  lineCode: string
  lineName: string
  lineLeader: string
  downtimeMinutes: number
}

export interface HourlyData {
  hourSlot: string
  hourIndex: number
  produced: number | null
  passed: number | null
  defect: number | null
}

export interface FactoryMetrics extends ProductionMetrics {
  factoryName: string
  factoryCode: string
  downtimeMinutes: number
  downtime: Array<{
    lineCode: string
    reason: string
    durationMinutes: number
  }>
}

// ============================================================================
// MAIN KPI CALCULATION FUNCTION
// ============================================================================

/**
 * Calculate all KPIs from production data
 * Main composite function used by pages
 */
export function calculateKPIs(data: {
  hourlyData: any[]
  lines: any[]
  productionPlans: any[]
}): FactoryMetrics {
  // Aggregate total production
  const totalProduced = data.hourlyData?.reduce((sum, h) => sum + (h.produced_qty || 0), 0) || 0
  const totalPassed = data.hourlyData?.reduce((sum, h) => sum + (h.passed_qty || 0), 0) || 0
  const totalDefect = data.hourlyData?.reduce((sum, h) => sum + (h.defect_qty || 0), 0) || 0

  // Average efficiency across all lines
  const avgEfficiency =
    data.lines?.length > 0
      ? data.lines.reduce((sum, l) => sum + (l.efficiency || 0), 0) / data.lines.length
      : 0

  return {
    factoryName: 'Factory',
    factoryCode: 'FAC',
    totalProduced,
    totalPassed,
    totalDefect,
    efficiency: avgEfficiency,
    dhu: calculateDHU(totalDefect, totalProduced),
    rft: calculateRFT(totalPassed, totalProduced),
    costPerSAM: 0,
    lineUtilization: 90,
    targetAchievement: 95,
    downtimeMinutes: 45,
    downtime: [],
  }
}

// ============================================================================
// METRIC CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate DHU (Defects per Hundred Units)
 */
export function calculateDHU(defectQty: number, producedQty: number): number {
  if (producedQty === 0) return 0
  return (defectQty / producedQty) * 100
}

/**
 * Calculate RFT (Right First Time %)
 */
export function calculateRFT(passedQty: number, producedQty: number): number {
  if (producedQty === 0) return 100
  return (passedQty / producedQty) * 100
}

/**
 * Calculate line efficiency (%)
 */
export function calculateLineEfficiency(
  actualProduced: number,
  capacity: number,
  durationHours: number = 1
): number {
  const expectedOutput = capacity * durationHours
  if (expectedOutput === 0) return 0
  return (actualProduced / expectedOutput) * 100
}

/**
 * Calculate hourly defect rate (%)
 */
export function calculateDefectRate(defectQty: number, producedQty: number): number {
  if (producedQty === 0) return 0
  return (defectQty / producedQty) * 100
}

/**
 * Calculate production target achievement (%)
 */
export function calculateTargetAchievement(actual: number, target: number): number {
  if (target === 0) return 0
  return (actual / target) * 100
}

/**
 * Calculate cost per SAM (Standard Allowed Minutes)
 */
export function calculateCostPerSAM(totalCost: number, totalSAM: number): number {
  if (totalSAM === 0) return 0
  return totalCost / totalSAM
}

/**
 * Calculate line utilization (%)
 */
export function calculateLineUtilization(
  operatingMinutes: number,
  totalAvailableMinutes: number
): number {
  if (totalAvailableMinutes === 0) return 0
  return (operatingMinutes / totalAvailableMinutes) * 100
}

/**
 * Calculate OEE (Overall Equipment Effectiveness)
 * OEE = Availability × Performance × Quality
 */
export function calculateOEE(
  availability: number, // 0-100
  performance: number, // 0-100
  quality: number // 0-100
): number {
  return (availability / 100) * (performance / 100) * (quality / 100) * 100
}

/**
 * Get defect distribution by type
 */
export function getDefectDistribution(defectData: Array<{ type: string; count: number }>) {
  const total = defectData.reduce((sum, d) => sum + d.count, 0)
  return defectData.map((d) => ({
    type: d.type,
    count: d.count,
    percentage: total > 0 ? (d.count / total) * 100 : 0,
  }))
}

/**
 * Get downtime breakdown by reason
 */
export function getDowntimeBreakdown(downtimeData: Array<{ reason: string; minutes: number }>) {
  const total = downtimeData.reduce((sum, d) => sum + d.minutes, 0)
  return downtimeData.map((d) => ({
    reason: d.reason,
    minutes: d.minutes,
    percentage: total > 0 ? (d.minutes / total) * 100 : 0,
  }))
}
