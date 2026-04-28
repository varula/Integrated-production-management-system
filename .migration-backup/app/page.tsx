"use client"

// ============================================================================
// Dashboard - v2.1.0 (Fixed build cache)
// ============================================================================

import { AppLayout } from "@/components/app-layout"
import { SectionHeader, PageContainer, StatusBadge, ProgressBar } from "@/components/shared"
import { useFactory } from "@/lib/factory-context"
import {
  useLinesData,
  useProductionPlansData,
  useTodayProductionByLine,
} from "@/hooks/useProductionData"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"
import { Activity, AlertTriangle, CheckCircle2, TrendingUp, Zap, Package } from "lucide-react"

const HOUR_LABELS = ["8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM"]
const LINE_CAPACITY_PER_HOUR = 220 // avg pcs/hr per factory

export default function DashboardPage() {
  const { factory } = useFactory()
  const factoryId = factory?.id

  const { lines, isLoading: ll } = useLinesData(factoryId)
  const { plans: productionPlans, isLoading: pl } = useProductionPlansData(factoryId)
  const { production: hourlyData, isLoading: hl } = useTodayProductionByLine(factoryId)

  const isLoading = !factoryId || ll || pl || hl

  // ── KPI Calculations ──────────────────────────────────────────────────────
  const totalProduced   = hourlyData.reduce((s, h: any) => s + (h.produced_qty || 0), 0)
  const totalPassed     = hourlyData.reduce((s, h: any) => s + (h.passed_qty   || 0), 0)
  const totalDefect     = hourlyData.reduce((s, h: any) => s + (h.defect_qty   || 0), 0)
  const dhu             = totalProduced > 0 ? ((totalDefect / totalProduced) * 100).toFixed(2) : "0.00"
  const rft             = totalProduced > 0 ? ((totalPassed / totalProduced) * 100).toFixed(1) : "100.0"
  const sewingLines     = lines.filter((l: any) => l.line_type === "SEWING")
  const finishLines     = lines.filter((l: any) => l.line_type === "FINISHING")
  const runningCount    = lines.filter((l: any) => l.current_status === "RUNNING").length
  const downCount       = lines.filter((l: any) => l.current_status === "DOWN").length
  const totalTarget     = sewingLines.length * LINE_CAPACITY_PER_HOUR * 9
  const targetAch       = totalTarget > 0 ? Math.round((totalProduced / totalTarget) * 100) : 0

  // ── Chart Data ────────────────────────────────────────────────────────────
  const hourlyChartData = HOUR_LABELS.map((label, idx) => {
    const hrs = hourlyData.filter((h: any) => h.hour_index === idx)
    const actual = hrs.reduce((s: number, h: any) => s + (h.produced_qty || 0), 0)
    const target = sewingLines.length * LINE_CAPACITY_PER_HOUR
    return { hour: label, actual, target }
  })

  const qualityData = [
    { name: "Passed", value: totalPassed || 1, fill: "#10b981" },
    { name: "Defects", value: totalDefect || 0, fill: "#ef4444" },
  ]

  const lineEffData = sewingLines.slice(0, 10).map((l: any) => ({
    line: l.line_code,
    eff: parseFloat((l.efficiency || 75).toFixed(1)),
  }))

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading factory data...</p>
            </div>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>

        {/* Factory Banner */}
        <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-card border border-border rounded-xl">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-blue-600">
            {factory?.code}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{factory?.name}</p>
            <p className="text-xs text-muted-foreground">{factory?.location} · Integrated Production Management System</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Live
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "Today's Output",
              value: totalProduced.toLocaleString(),
              sub: `Target: ${totalTarget.toLocaleString()} pcs`,
              icon: <Package size={18} />,
              color: "bg-blue-100 text-blue-700",
              bar: targetAch,
            },
            {
              label: "RFT (Quality)",
              value: `${rft}%`,
              sub: "Right First Time",
              icon: <CheckCircle2 size={18} />,
              color: "bg-green-100 text-green-700",
              bar: parseFloat(rft as string),
            },
            {
              label: "DHU",
              value: `${dhu}%`,
              sub: `${totalDefect} defective pcs`,
              icon: <AlertTriangle size={18} />,
              color: "bg-red-100 text-red-700",
              bar: Math.max(0, 100 - parseFloat(dhu as string) * 5),
            },
            {
              label: "Lines Running",
              value: `${runningCount} / ${lines.length}`,
              sub: `${downCount} line${downCount !== 1 ? "s" : ""} down`,
              icon: <Activity size={18} />,
              color: "bg-purple-100 text-purple-700",
              bar: lines.length > 0 ? (runningCount / lines.length) * 100 : 0,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${kpi.color}`}>{kpi.icon}</div>
              </div>
              <div>
                <ProgressBar value={kpi.bar} showLabel={false} />
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">

          {/* Hourly Production */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Hourly Production" subtitle="Actual vs Target (today)" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourlyChartData} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.4)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend iconSize={10} />
                <Bar dataKey="target" name="Target" fill="oklch(0.88 0.01 240)" radius={[3,3,0,0]} />
                <Bar dataKey="actual" name="Actual" fill="oklch(0.52 0.18 250)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quality Pie */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Quality Split" subtitle="Passed vs Defective" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={qualityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {qualityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString()} />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Efficiency Chart */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Sewing Line Efficiency" subtitle="Top 10 lines" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lineEffData} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.4)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="line" type="category" tick={{ fontSize: 10 }} width={40} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="eff" name="Efficiency %" fill="oklch(0.52 0.18 250)" radius={[0,3,3,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Summary */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Active Orders" subtitle={`${productionPlans.length} production plans`} />
            <div className="space-y-2 overflow-y-auto max-h-48">
              {productionPlans.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders found</p>
              ) : productionPlans.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{p.order_id}</p>
                    <p className="text-muted-foreground truncate">{p.buyer_name} · {p.style}</p>
                  </div>
                  <StatusBadge status={p.status === "IN_PROGRESS" ? "In Production" : p.status === "COMPLETED" ? "Completed" : "Planning"} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Lines Quick Grid */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader
            title="Production Floor Status"
            subtitle={`${sewingLines.length} sewing + ${finishLines.length} finishing lines`}
          />
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {lines.map((line: any) => {
              const status = line.current_status || "IDLE"
              const color = status === "RUNNING" ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                : status === "DOWN" ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
              const dot = status === "RUNNING" ? "bg-green-500"
                : status === "DOWN" ? "bg-red-500"
                : "bg-yellow-400"
              return (
                <div key={line.id} className={`flex flex-col items-center gap-1 p-2 rounded-lg border ${color}`}>
                  <span className="text-[11px] font-bold text-foreground">{line.line_code}</span>
                  <div className={`w-2 h-2 rounded-full ${dot} ${status === "RUNNING" ? "animate-pulse" : ""}`} />
                  <span className="text-[9px] text-muted-foreground">{line.line_type === "FINISHING" ? "FIN" : "SEW"}</span>
                </div>
              )
            })}
          </div>
        </div>

      </PageContainer>
    </AppLayout>
  )
}
