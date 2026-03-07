"use client"

import { AppLayout } from "@/components/app-layout"
import { KpiCard, ProgressBar, SectionHeader, PageContainer, StatusBadge } from "@/components/shared"
import {
  factory,
  sewingLines,
  hourlyTrend,
  lineEfficiency,
  orders,
} from "@/lib/data"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts"
import {
  Package, Activity, AlertTriangle, CheckCircle2,
  TrendingUp, Layers, Zap, ShieldCheck,
} from "lucide-react"

export default function DashboardPage() {
  const totalOutput = sewingLines.reduce((s, l) => s + l.actual, 0)
  const avgEff = sewingLines.filter(l => l.status !== "IDLE" && l.status !== "MAINTENANCE").reduce((s, l, _, a) => s + l.efficiency / a.length, 0)
  const criticalAlerts = sewingLines.filter(l => l.alerts > 0).reduce((s, l) => s + l.alerts, 0)
  const activeLines = sewingLines.filter(l => l.status === "RUNNING").length
  const qualityPass = 98.2

  return (
    <AppLayout>
      <PageContainer>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiCard
            title="Total Output"
            value={`${totalOutput.toLocaleString()} pcs`}
            target="35,000"
            change="+4.2%"
            trend="up"
            icon={<Package size={18} className="text-blue-600" />}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <KpiCard
            title="Factory Efficiency"
            value={`${avgEff.toFixed(1)}%`}
            target="80.0%"
            change="-1.1%"
            trend="down"
            trendPositive={false}
            icon={<Activity size={18} className="text-purple-600" />}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
          <KpiCard
            title="Active Lines"
            value={`${activeLines} / ${factory.totalLines}`}
            target="80% active"
            change="+2"
            trend="up"
            icon={<Zap size={18} className="text-green-600" />}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <KpiCard
            title="Quality Pass"
            value={`${qualityPass}%`}
            target="99.0%"
            change="-0.3%"
            trend="down"
            trendPositive={false}
            icon={<ShieldCheck size={18} className="text-emerald-600" />}
            color="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <KpiCard
            title="WIP Inventory"
            value="8,920 pcs"
            target="< 10k"
            change="-12%"
            trend="down"
            trendPositive={true}
            icon={<Layers size={18} className="text-orange-600" />}
            color="bg-orange-100 dark:bg-orange-900/30"
          />
          <KpiCard
            title="Critical Alerts"
            value={`${criticalAlerts} critical`}
            target="0"
            change={`+2`}
            trend="up"
            trendPositive={false}
            icon={<AlertTriangle size={18} className="text-red-600" />}
            color="bg-red-100 dark:bg-red-900/30"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Hourly Trend */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Hourly Production Trend" subtitle="Actual vs Target Output" />
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyTrend}>
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
              <BarChart data={lineEfficiency} barSize={16}>
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
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Prediction</p>
              <p className="text-xs text-muted-foreground">Line L-05 is predicted to miss daily target by ~15% due to machine downtime on J-Stitch station.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Recommendation</p>
              <p className="text-xs text-muted-foreground">Transfer 2 Floater Operators from L-08 to L-03 to balance current WIP accumulation in Cargo Denim line.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Alert</p>
              <p className="text-xs text-muted-foreground">ORD-9962 (Tommy Hilfiger) is at risk for March 30 ship date. Escalate to Production Manager.</p>
            </div>
            <button className="w-full mt-2 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
              Apply Recommendations
            </button>
          </div>

          {/* Orders at Risk */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Active Orders Status" subtitle="Ship date vs. progress" />
            <div className="space-y-3">
              {orders.slice(0, 6).map((order) => {
                const pct = Math.round(((order.qty - order.balance) / order.qty) * 100)
                return (
                  <div key={order.id} className="flex items-center gap-3">
                    <div className="w-24 shrink-0">
                      <p className="text-xs font-semibold text-foreground">{order.id}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{order.buyer}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-muted-foreground truncate">{order.style}</p>
                        <p className="text-[10px] text-muted-foreground shrink-0 ml-2">{pct}%</p>
                      </div>
                      <ProgressBar value={pct} showLabel={false} />
                    </div>
                    <StatusBadge status={order.status} size="sm" />
                    <div className="w-20 shrink-0 text-right">
                      <p className="text-[10px] text-muted-foreground">Ship: {order.shipDate.slice(5)}</p>
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
                  <th className="text-left font-medium pb-2.5 pr-4">Style / Order</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Status</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Efficiency</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Output (Act/Tgt)</th>
                  <th className="text-left font-medium pb-2.5 pr-4">Operators</th>
                  <th className="text-left font-medium pb-2.5">Alerts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sewingLines.slice(0, 12).map((line) => (
                  <tr key={line.line} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">{line.line}</td>
                    <td className="py-2.5 pr-4">
                      <p className="text-xs font-medium text-foreground truncate max-w-[140px]">{line.style}</p>
                      <p className="text-[10px] text-muted-foreground">{line.order}</p>
                    </td>
                    <td className="py-2.5 pr-4"><StatusBadge status={line.status} size="sm" /></td>
                    <td className="py-2.5 pr-4 w-36">
                      <ProgressBar value={line.efficiency} showLabel />
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">
                      {line.actual} / {line.target}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{line.operators}</td>
                    <td className="py-2.5 text-xs">
                      {line.alerts > 0 ? (
                        <span className="flex items-center gap-1 text-red-500">
                          <AlertTriangle size={12} />
                          {line.alerts}
                        </span>
                      ) : (
                        <span className="text-green-500">
                          <CheckCircle2 size={12} />
                        </span>
                      )}
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
