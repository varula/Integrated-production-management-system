"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { useLinesData, useTodayProductionByLine } from "@/hooks/useProductionData"
import { useFactory } from "@/lib/factory-context"
import { cn } from "@/lib/utils"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts"
import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react"

const HOURS = ["8-9AM", "9-10AM", "10-11AM", "11-12PM", "12-1PM", "1-2PM", "2-3PM", "3-4PM", "4-5PM", "5-6PM", "6-7PM"]
const PENDING_IDX = [9, 10]

export default function SewingPage() {
  const { factory } = useFactory()
  const factoryId = factory?.id
  const { lines, isLoading: ll } = useLinesData(factoryId)
  const { production: hourlyData, isLoading: hl } = useTodayProductionByLine(factoryId)
  const isLoading = !factoryId || ll || hl
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && hourlyData) {
      const chart = HOURS.map((hour, idx) => {
        const totalProduced = hourlyData
          ?.filter((h: any) => h.hour_index === idx && h.produced_qty)
          .reduce((sum: number, h: any) => sum + (h.produced_qty || 0), 0) || 0
        return { hour, output: totalProduced, target: 2400 }
      })
      setChartData(chart)
    }
  }, [hourlyData, isLoading])

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading sewing lines...</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  const sewingLines = lines?.filter((l: any) => l.line_type === "SEWING") || []
  const running = sewingLines.filter((l: any) => l.current_status === "RUNNING").length
  const warning = sewingLines.filter((l: any) => l.current_status === "WARNING").length
  const down = sewingLines.filter((l: any) => l.current_status === "DOWN").length
  const idle = sewingLines.filter((l: any) => l.current_status !== "RUNNING" && l.current_status !== "WARNING" && l.current_status !== "DOWN").length

  // Organize hourly data by line
  const hourlyByLine = sewingLines.map((line: any) => {
    const lineHours: any = { line: line.line_code, lineId: line.id, leader: line.line_leader_name }
    for (let i = 0; i < HOURS.length; i++) {
      const hourData = hourlyData?.find((h: any) => h.line_id === line.id && h.hour_index === i)
      lineHours[`h${i}`] = hourData?.produced_qty || null
    }
    return lineHours
  })

  return (
    <AppLayout>
      <PageContainer>
        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Running", value: running, icon: <CheckCircle2 size={18} />, color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
            { label: "Warning", value: warning, icon: <AlertTriangle size={18} />, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20" },
            { label: "Down", value: down, icon: <Clock size={18} />, color: "text-red-600 bg-red-100 dark:bg-red-900/20" },
            { label: "Idle / Maint.", value: idle, icon: <Wrench size={18} />, color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Hourly Output Table */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <SectionHeader 
            title="Sewing Lines — Hourly Output" 
            subtitle="08:00 AM – 07:00 PM (10 hr shift)"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                  <th className="text-left font-medium px-3 py-2 w-16">Line</th>
                  <th className="text-left font-medium px-3 py-2">Leader</th>
                  {HOURS.map((h, i) => (
                    <th 
                      key={h} 
                      className={cn("text-center font-medium px-2 py-2 whitespace-nowrap", PENDING_IDX.includes(i) && "text-muted-foreground/50")}
                    >
                      {h}
                    </th>
                  ))}
                  <th className="text-center font-medium px-3 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {hourlyByLine.map((row: any) => {
                  const vals = Array.from({ length: 11 }, (_, i) => row[`h${i}`])
                  const total = vals.reduce((s: number, v: any) => s + (v ? v : 0), 0)
                  return (
                    <tr key={row.lineId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-foreground">{row.line}</td>
                      <td className="px-3 py-2.5 text-muted-foreground truncate text-[10px]">{row.leader}</td>
                      {vals.map((v: any, i: number) => (
                        <td key={i} className={cn("px-2 py-2.5 text-center tabular-nums", PENDING_IDX.includes(i) ? "text-muted-foreground/30" : "text-foreground")}>
                          {v === null ? <span className="text-muted-foreground/30">—</span> : v}
                        </td>
                      ))}
                      <td className="px-3 py-2.5 text-center font-semibold">{total}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Hourly Production Output" subtitle="Factory total per hour" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} />
                <Bar dataKey="target" fill="oklch(0.577 0.245 27.325)" radius={[3, 3, 0, 0]} name="Target" />
                <Bar dataKey="output" fill="oklch(0.52 0.18 250)" radius={[3, 3, 0, 0]} name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line Efficiency Comparison" subtitle="All sewing lines" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sewingLines.slice(0, 10).map((l: any) => ({ line: l.line_code, efficiency: l.efficiency || 0 }))} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="line" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Efficiency"]} />
                <Bar dataKey="efficiency" radius={[3, 3, 0, 0]} fill="oklch(0.52 0.18 250)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Cards */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Sewing Lines Status" subtitle="Current performance metrics" />
          <div className="grid lg:grid-cols-2 gap-4">
            {sewingLines.map((line: any) => (
              <div key={line.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-foreground">{line.line_code}</p>
                    <p className="text-xs text-muted-foreground">{line.line_leader_name}</p>
                  </div>
                  <StatusBadge status={line.current_status || "IDLE"} size="sm" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-semibold">{(line.efficiency || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-semibold">{line.capacity_per_hour} pcs/hr</span>
                  </div>
                  <ProgressBar value={line.efficiency || 0} showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
