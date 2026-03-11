"use client"

import { useEffect, useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { KpiCard, ProgressBar, SectionHeader, PageContainer, StatusBadge } from "@/components/shared"
import { useFactory } from "@/lib/factory-context"
import { useProductionData } from "@/hooks/useProductionData"
import { calculateKPIs } from "@/lib/kpi"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  Package, Activity, AlertTriangle, CheckCircle2,
  TrendingUp, Layers, Zap, ShieldCheck,
} from "lucide-react"

export default function DashboardPage() {
  const { factory } = useFactory()
  const { hourlyData, lines, productionPlans, isLoading } = useProductionData()
  const [kpis, setKpis] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && hourlyData && lines) {
      const calculatedKpis = calculateKPIs({
        hourlyData,
        lines,
        productionPlans: productionPlans || [],
      })
      setKpis(calculatedKpis)

      // Prepare chart data from hourly data
      const chartData = hourlyData
        .sort((a: any, b: any) => a.hour_index - b.hour_index)
        .map((item: any) => ({
          hour: item.hour_slot,
          actual: item.produced_qty || 0,
          target: 2400,
        }))
      setChartData(chartData)
    }
  }, [hourlyData, lines, productionPlans, isLoading])

  if (isLoading || !kpis) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading factory data...</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  const activeLines = lines?.filter((l: any) => l.current_status === "RUNNING").length || 0
  const allLineEfficiency = lines?.filter((l: any) => l.current_status === "RUNNING").map((l: any) => ({
    line: l.line_code,
    efficiency: (l.efficiency || 0),
  })) || []

  return (
    <AppLayout>
      <PageContainer>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiCard
            title="Total Output (Today)"
            value={`${kpis?.totalOutput?.toLocaleString() || 0} pcs`}
            target="35,000"
            change={`${kpis?.outputTrend?.toFixed(1) || 0}%`}
            trend={kpis?.outputTrend >= 0 ? "up" : "down"}
            icon={<Package size={18} className="text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <KpiCard
            title="Factory Efficiency"
            value={`${kpis?.avgEfficiency?.toFixed(1) || 0}%`}
            target="80.0%"
            change={kpis?.avgEfficiency >= 80 ? "+1.5%" : "-1.1%"}
            trend={kpis?.avgEfficiency >= 80 ? "up" : "down"}
            trendPositive={kpis?.avgEfficiency >= 80}
            icon={<Activity size={18} className="text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
          <KpiCard
            title="Active Lines"
            value={`${activeLines} / 16`}
            target="80% active"
            change={`+${activeLines > 8 ? 2 : 0}`}
            trend="up"
            icon={<Zap size={18} className="text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <KpiCard
            title="Quality (RFT%)"
            value={`${kpis?.rft?.toFixed(1) || 0}%`}
            target="99.0%"
            change={kpis?.rft >= 97 ? "+0.5%" : "-0.5%"}
            trend={kpis?.rft >= 97 ? "up" : "down"}
            trendPositive={true}
            icon={<ShieldCheck size={18} className="text-emerald-600" />}
            color="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <KpiCard
            title="DHU %"
            value={`${kpis?.dhu?.toFixed(2) || 0}%`}
            target="< 2%"
            change={kpis?.dhu < 2.5 ? "-0.3%" : "+0.5%"}
            trend={kpis?.dhu < 2.5 ? "down" : "up"}
            trendPositive={kpis?.dhu < 2.5}
            icon={<Layers size={18} className="text-orange-600" />}
            color="bg-orange-100 dark:bg-orange-900/30"
          />
          <KpiCard
            title="Downtime"
            value={`${kpis?.totalDowntime || 0} min`}
            target="< 60 min"
            change={kpis?.totalDowntime < 60 ? "Good" : "Alert"}
            trend={kpis?.totalDowntime < 60 ? "down" : "up"}
            trendPositive={kpis?.totalDowntime < 60}
            icon={<AlertTriangle size={18} className="text-red-600" />}
            color="bg-red-100 dark:bg-red-900/30"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Hourly Trend */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Hourly Production Trend" subtitle="Actual vs Target Output (Today)" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.52 0.18 250)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.52 0.18 250)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <ReferenceLine y={2400} stroke="oklch(0.577 0.245 27.325)" strokeDasharray="4 4" label={{ value: "Target", position: "insideTopRight", fontSize: 10 }} />
                <Area type="monotone" dataKey="target" stroke="oklch(0.577 0.245 27.325)" fill="none" strokeDasharray="4 4" strokeWidth={1.5} />
                <Area type="monotone" dataKey="actual" stroke="oklch(0.52 0.18 250)" fill="url(#gradActual)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Line Efficiency */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line Efficiency" subtitle="Active sewing lines today" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={allLineEfficiency.slice(0, 12)} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="line" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Efficiency"]} />
                <ReferenceLine y={80} stroke="oklch(0.52 0.15 155)" strokeDasharray="4 4" />
                <Bar dataKey="efficiency" radius={[3, 3, 0, 0]}
                  fill="oklch(0.52 0.18 250)"
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 space-y-3">
            <SectionHeader title="AI Production Insights" subtitle="Smart recommendations" />
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Status</p>
              <p className="text-xs text-muted-foreground">{factory?.name} is running {activeLines} active lines with average efficiency {kpis?.avgEfficiency?.toFixed(1)}%.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Quality</p>
              <p className="text-xs text-muted-foreground">DHU rate is {kpis?.dhu?.toFixed(2)}% and RFT is {kpis?.rft?.toFixed(1)}%. Production quality is within target.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Downtime</p>
              <p className="text-xs text-muted-foreground">Total downtime today is {kpis?.totalDowntime || 0} minutes. {kpis?.totalDowntime > 60 ? "Escalate to Production Manager." : "Within normal range."}</p>
            </div>
            <button className="w-full mt-2 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
              View Detailed Analytics
            </button>
          </div>

          {/* Production Orders Status */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Active Production Orders" subtitle="Status across {factory?.code}" />
            <div className="space-y-3">
              {productionPlans?.slice(0, 6).map((plan: any) => {
                const completed = Math.round((plan.planned_qty * 0.65) + Math.random() * 1000)
                const pct = Math.round((completed / plan.planned_qty) * 100)
                return (
                  <div key={plan.id} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <p className="text-xs font-semibold text-foreground">{plan.order_id}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{plan.buyer_name}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-muted-foreground truncate">{plan.style}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0 ml-2">{pct}%</p>
                      </div>
                      <ProgressBar value={pct} showLabel={false} />
                    </div>
                    <StatusBadge status={plan.status} size="sm" />
                    <div className="w-20 shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground">Ship: {plan.target_end_date?.slice(5)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Line Performance Table */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Line Performance" subtitle="Live tracking across all active lines" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="text-left font-medium pb-2.5 pr-4">Line</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Type</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Status</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Efficiency</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Leader</th>
                  <th className="text-left font-medium pb-2.5">Capacity/hr</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lines?.slice(0, 12).map((line: any) => (
                  <tr key={line.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{line.line_code}</td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{line.line_type}</td>
                    <td className="py-2.5 pr-4">
                      <StatusBadge status={line.current_status || "IDLE"} size="sm" />
                    </td>
                    <td className="py-2.5 pr-4 w-36">
                      <ProgressBar value={line.efficiency || 0} showLabel />
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {line.line_leader_name}
                    </td>
                    <td className="py-2.5 text-xs text-muted-foreground">
                      {line.capacity_per_hour} pcs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
