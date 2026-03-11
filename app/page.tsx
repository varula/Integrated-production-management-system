"use client"

import { AppLayout } from "@/components/app-layout"
import { SectionHeader, PageContainer } from "@/components/shared"
import { useFactory } from "@/lib/factory-context"
import { useLinesData, useProductionPlansData, useTodayProductionByLine } from "@/hooks/useProductionData"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Zap, AlertTriangle, CheckCircle2, Package } from "lucide-react"

export default function DashboardPage() {
  const { factory } = useFactory()
  const { lines, isLoading: linesLoading } = useLinesData(factory?.id)
  const { plans: productionPlans, isLoading: plansLoading } = useProductionPlansData(factory?.id)
  const { production: hourlyData, isLoading: hourlyLoading } = useTodayProductionByLine(factory?.id)

  // Quick calculations without waiting
  const totalProduced = hourlyData?.reduce((sum: number, h: any) => sum + (h.produced_qty || 0), 0) || 0
  const totalDefects = hourlyData?.reduce((sum: number, h: any) => sum + (h.defect_qty || 0), 0) || 0
  const totalPassed = totalProduced - totalDefects
  const efficiency = totalProduced > 0 ? ((totalPassed / totalProduced) * 100).toFixed(1) : 0
  const dhu = totalProduced > 0 ? ((totalDefects / totalProduced) * 100).toFixed(2) : 0

  const runningLines = lines?.filter((l: any) => l.current_status === "RUNNING").length || 0
  const downLines = lines?.filter((l: any) => l.current_status === "DOWN").length || 0

  const hourlyChartData = hourlyData
    ?.sort((a: any, b: any) => a.hour_index - b.hour_index)
    .map((item: any) => ({
      hour: item.hour_slot?.split('-')[0] || `${item.hour_index}h`,
      actual: item.produced_qty || 0,
      target: 2400,
    })) || []

  const defectData = [
    { name: "Passed", value: totalPassed, fill: "#10b981" },
    { name: "Defects", value: totalDefects, fill: "#ef4444" },
  ]

  if (linesLoading || plansLoading || hourlyLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground animate-pulse">Loading factory dashboard...</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Production</p>
            <p className="text-2xl font-bold text-foreground">{totalProduced.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">pcs today</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Efficiency</p>
            <p className="text-2xl font-bold text-foreground">{efficiency}%</p>
            <p className="text-xs text-blue-600 mt-1">Right First Time</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Quality</p>
            <p className="text-2xl font-bold text-foreground">{dhu}%</p>
            <p className="text-xs text-red-600 mt-1">Defect Rate</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Lines</p>
            <p className="text-2xl font-bold text-foreground">{runningLines}/{lines?.length || 0}</p>
            <p className="text-xs text-yellow-600 mt-1">Running</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Hourly Output */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
            <SectionHeader title="Hourly Production" subtitle="Today's output by hour" />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="target" fill="oklch(0.577 0.245 27.325)" radius={[3, 3, 0, 0]} name="Target" />
                <Bar dataKey="actual" fill="oklch(0.52 0.18 250)" radius={[3, 3, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quality Distribution */}
          <div className="bg-card border border-border rounded-lg p-5">
            <SectionHeader title="Quality" subtitle="Passed vs Defects" />
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={defectData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                  {defectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Status */}
        <div className="bg-card border border-border rounded-lg p-5">
          <SectionHeader title="Production Lines Status" subtitle="All 16 lines" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {lines?.map((line: any) => (
              <div key={line.id} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <span className={`text-xs font-bold ${line.current_status === 'RUNNING' ? 'text-green-600' : line.current_status === 'DOWN' ? 'text-red-600' : 'text-yellow-600'}`}>
                  {line.line_code}
                </span>
                <div className={`w-2 h-2 rounded-full ${line.current_status === 'RUNNING' ? 'bg-green-500' : line.current_status === 'DOWN' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
