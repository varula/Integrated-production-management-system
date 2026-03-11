'use client'

/**
 * KPI Calculation Engine
 * Calculates performance metrics for production analysis
 */

export interface KPIMetrics {
  efficiency: number
  dhu: number // Defects per Hundred Units
  rft: number // Right First Time
  output: number
  downtime: number
  targetAchievement: number
}

export function calculateKPIs(
  produced: number,
  passed: number,
  defects: number,
  target: number,
  downMinutes: number = 0
): KPIMetrics {
  const total = produced || 1

  // Right First Time - Quality (%)
  const rft = produced > 0 ? (passed / produced) * 100 : 100

  // Defects per Hundred Units
  const dhu = produced > 0 ? (defects / produced) * 100 : 0

  // Efficiency - Actual vs Target (%)
  const efficiency = target > 0 ? (produced / target) * 100 : 0

  // Output - Raw production count
  const output = produced

  // Downtime - Minutes lost
  const downtime = downMinutes

  // Target Achievement - Against shift target (%)
  const targetAchievement = target > 0 ? Math.min((produced / target) * 100, 100) : 0

  return {
    efficiency: parseFloat(efficiency.toFixed(1)),
    dhu: parseFloat(dhu.toFixed(2)),
    rft: parseFloat(rft.toFixed(1)),
    output,
    downtime,
    targetAchievement: parseFloat(targetAchievement.toFixed(1)),
  }
}

/**
 * Calculate individual efficiency for a line
 */
export function calculateLineEfficiency(
  produced: number,
  target: number
): number {
  if (target === 0) return 0
  return Math.min((produced / target) * 100, 100)
}

/**
 * Calculate DHU for quality tracking
 */
export function calculateDHU(defects: number, produced: number): number {
  if (produced === 0) return 0
  return (defects / produced) * 100
}

/**
 * Calculate RFT percentage
 */
export function calculateRFT(passed: number, produced: number): number {
  if (produced === 0) return 100
  return (passed / produced) * 100
}

/**
 * Calculate target achievement percentage
 */
export function calculateTargetAchievement(actual: number, target: number): number {
  if (target === 0) return 0
  return Math.min((actual / target) * 100, 100)
}

export { calculateKPIs as default }
