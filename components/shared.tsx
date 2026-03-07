"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  target: string
  change: string
  trend: "up" | "down" | "neutral"
  trendPositive?: boolean
  icon: React.ReactNode
  color: string
}

export function KpiCard({ title, value, target, change, trend, trendPositive, icon, color }: KpiCardProps) {
  const isGood = trendPositive !== undefined ? trendPositive : trend === "up"
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        </div>
        <div className={cn("p-2.5 rounded-lg", color)}>
          {icon}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Target: {target}</span>
        <span className={cn(
          "flex items-center gap-1 font-medium",
          isGood ? "text-green-600 dark:text-green-400" : "text-red-500"
        )}>
          {trend === "up" ? <TrendingUp size={12} /> : trend === "down" ? <TrendingDown size={12} /> : <Minus size={12} />}
          {change}
        </span>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: string
  size?: "sm" | "default"
}

const statusConfig: Record<string, { label: string; className: string }> = {
  RUNNING: { label: "Running", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  WARNING: { label: "Warning", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  DOWN: { label: "Down", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  IDLE: { label: "Idle", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  MAINTENANCE: { label: "Maintenance", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  Pass: { label: "Pass", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Fail: { label: "Fail", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Warning: { label: "Warning", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "In Production": { label: "In Production", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "On Track": { label: "On Track", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "Sampling": { label: "Sampling", className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "PP Inspection": { label: "PP Inspection", className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  Completed: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "In Progress": { label: "In Progress", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  Adequate: { label: "Adequate", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Low: { label: "Low", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  Critical: { label: "Critical", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Running: { label: "Running", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Breakdown: { label: "Breakdown", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Present: { label: "Present", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Absent: { label: "Absent", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Late: { label: "Late", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  High: { label: "High", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  Medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  Low2: { label: "Low", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Critical2: { label: "Critical", className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "Booking Confirmed": { label: "Booking Confirmed", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  "Docs Pending": { label: "Docs Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "Under Stuffing": { label: "Under Stuffing", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  Planning: { label: "Planning", className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
}

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600" }
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
      config.className
    )}>
      {config.label}
    </span>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  colorClass?: string
}

export function ProgressBar({ value, max = 100, showLabel = true, colorClass }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100)
  const auto = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", colorClass ?? auto)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-muted-foreground w-9 text-right">{Math.round(pct)}%</span>}
    </div>
  )
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-4 md:p-6 max-w-screen-2xl mx-auto", className)}>
      {children}
    </div>
  )
}
