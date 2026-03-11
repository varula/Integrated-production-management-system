/**
 * KPI Calculation Engine
 * Calculates all production metrics from raw data
 */

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
export function calculateRFT(passed: number, produced: number): number {
  if (produced === 0) return 100
  return (passed / produced) * 100
}

/**
 * Calculate Line Efficiency (%)
 * Efficiency = (Actual Output / Target Output) * 100
 */
export function calculateEfficiency(
  produced: number,
  capacityPerHour: number,
  hoursWorked: number
): number {
  const targetOutput = capacityPerHour * hoursWorked
  if (targetOutput === 0) return 0
  return (produced / targetOutput) * 100
}

/**
 * Calculate Line Utilization (%)
 * Based on downtime
 */
export function calculateLineUtilization(downtimeMinutes: number): number {
  const totalMinutes = 10 * 60 // 10 hour shift
  if (totalMinutes === 0) return 100
  return Math.max(0, ((totalMinutes - downtimeMinutes) / totalMinutes) * 100)
}

/**
 * Calculate Cost per SAM
 * SAM = Standard Allowed Minutes per unit
 * Assumes 1.5 SAM per unit for denim pants
 */
export function calculateCostPerSAM(
  totalCost: number,
  producedQty: number,
  samPerUnit: number = 1.5
): number {
  const totalSAM = producedQty * samPerUnit
  if (totalSAM === 0) return 0
  return totalCost / totalSAM
}

/**
 * Calculate Target Achievement (%)
 * Achievement = (Actual Qty / Planned Qty) * 100
 */
export function calculateTargetAchievement(
  actualQty: number,
  plannedQty: number
): number {
  if (plannedQty === 0) return 0
  return (actualQty / plannedQty) * 100
}

/**
 * Aggregate metrics from hourly data
 */
export function aggregateHourlyData(hourlyData: HourlyData[]): {
  totalProduced: number
  totalPassed: number
  totalDefect: number
  completedHours: number
} {
  let totalProduced = 0
  let totalPassed = 0
  let totalDefect = 0
  let completedHours = 0

  hourlyData.forEach((h) => {
    if (h.produced !== null) {
      totalProduced += h.produced
      totalPassed += h.passed || 0
      totalDefect += h.defect || 0
      completedHours++
    }
  })

  return {
    totalProduced,
    totalPassed,
    totalDefect,
    completedHours,
  }
}

/**
 * Calculate all metrics for a line
 */
export function calculateLineMetrics(
  lineCode: string,
  lineName: string,
  lineLeader: string,
  capacityPerHour: number,
  hourlyData: HourlyData[],
  downtimeMinutes: number,
  plannedQty: number
): LineMetrics {
  const { totalProduced, totalPassed, totalDefect, completedHours } =
    aggregateHourlyData(hourlyData)

  const efficiency = calculateEfficiency(totalProduced, capacityPerHour, completedHours || 1)
  const dhu = calculateDHU(totalDefect, totalProduced)
  const rft = calculateRFT(totalPassed, totalProduced)
  const lineUtilization = calculateLineUtilization(downtimeMinutes)
  const targetAchievement = calculateTargetAchievement(totalProduced, plannedQty)

  return {
    lineCode,
    lineName,
    lineLeader,
    totalProduced,
    totalPassed,
    totalDefect,
    efficiency,
    dhu,
    rft,
    costPerSAM: 0, // Would need cost data
    lineUtilization,
    targetAchievement,
    downtimeMinutes,
  }
}

/**
 * Calculate all metrics for a factory
 */
export function calculateFactoryMetrics(
  factoryName: string,
  factoryCode: string,
  lineMetrics: LineMetrics[],
  downtime: Array<{ lineCode: string; reason: string; durationMinutes: number }>
): FactoryMetrics {
  const totalProduced = lineMetrics.reduce((sum, l) => sum + l.totalProduced, 0)
  const totalPassed = lineMetrics.reduce((sum, l) => sum + l.totalPassed, 0)
  const totalDefect = lineMetrics.reduce((sum, l) => sum + l.totalDefect, 0)
  const totalDowntime = lineMetrics.reduce((sum, l) => sum + l.downtimeMinutes, 0)

  const avgEfficiency = lineMetrics.length > 0 
    ? lineMetrics.reduce((sum, l) => sum + l.efficiency, 0) / lineMetrics.length 
    : 0

  const avgLineUtilization = lineMetrics.length > 0
    ? lineMetrics.reduce((sum, l) => sum + l.lineUtilization, 0) / lineMetrics.length
    : 0

  return {
    factoryName,
    factoryCode,
    totalProduced,
    totalPassed,
    totalDefect,
    efficiency: avgEfficiency,
    dhu: calculateDHU(totalDefect, totalProduced),
    rft: calculateRFT(totalPassed, totalProduced),
    costPerSAM: 0,
    lineUtilization: avgLineUtilization,
    targetAchievement: 0,
    downtimeMinutes: totalDowntime,
    downtime,
  }
}

/**
 * Get defect breakdown (for charts)
 */
export function getDefectBreakdown(defects: Array<{ type: string; count: number }>) {
  const total = defects.reduce((sum, d) => sum + d.count, 0)
  return defects.map((d) => ({
    ...d,
    percentage: total > 0 ? (d.count / total) * 100 : 0,
  }))
}

/**
 * Get downtime breakdown by reason
 */
export function getDowntimeBreakdown(downtime: Array<{ reason: string; durationMinutes: number }>) {
  const grouped = downtime.reduce(
    (acc, d) => {
      const existing = acc.find((x) => x.reason === d.reason)
      if (existing) {
        existing.durationMinutes += d.durationMinutes
      } else {
        acc.push({ ...d })
      }
      return acc
    },
    [] as typeof downtime
  )

  const total = grouped.reduce((sum, d) => sum + d.durationMinutes, 0)
  return grouped
    .map((d) => ({
      ...d,
      percentage: total > 0 ? (d.durationMinutes / total) * 100 : 0,
    }))
    .sort((a, b) => b.durationMinutes - a.durationMinutes)
}
