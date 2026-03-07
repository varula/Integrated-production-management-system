"use client"

import { useEffect, useRef } from "react"
import { AppLayout } from "@/components/app-layout"
import { KpiCard, ProgressBar, SectionHeader, PageContainer, StatusBadge } from "@/components/shared"
import {
  sewingLines, hourlyTrend, lineEfficiency, orders,
  defectTypes, downtimeReasons,
} from "@/lib/data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts"
import {
  Package, Activity, AlertTriangle, CheckCircle2,
  Zap, ShieldCheck, Layers, TrendingUp,
} from "lucide-react"

// ── Canvas Hourly Trend Chart ─────────────────────────────────────────────
function HourlyTrendCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const padL = 42, padR = 16, padT = 16, padB = 30
    const chartW = W - padL - padR
    const chartH = H - padT - padB

    const allVals = hourlyTrend.flatMap((d) => [d.target, d.actual ?? 0])
    const maxVal = Math.ceil(Math.max(...allVals) / 500) * 500

    // Grid lines
    ctx.strokeStyle = "rgba(148,163,184,0.18)"
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke()
      ctx.fillStyle = "rgba(148,163,184,0.7)"
      ctx.font = "10px Inter, system-ui"
      ctx.textAlign = "right"
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padL - 5, y + 4)
    }

    const n = hourlyTrend.length
    const getX = (i: number) => padL + (i / (n - 1)) * chartW
    const getY = (v: number) => padT + chartH - (v / maxVal) * chartH

    // Target line (dashed orange)
    ctx.setLineDash([6, 4])
    ctx.strokeStyle = "rgba(251,146,60,0.85)"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    hourlyTrend.forEach((d, i) => {
      i === 0 ? ctx.moveTo(getX(i), getY(d.target)) : ctx.lineTo(getX(i), getY(d.target))
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Actual area fill
    const actualPoints = hourlyTrend.filter((d) => d.actual !== null)
    const lastActualIdx = hourlyTrend.reduce((acc, d, i) => (d.actual !== null ? i : acc), -1)

    if (lastActualIdx >= 0) {
      const gradient = ctx.createLinearGradient(0, padT, 0, padT + chartH)
      gradient.addColorStop(0, "rgba(79,130,241,0.35)")
      gradient.addColorStop(1, "rgba(79,130,241,0.02)")
      ctx.beginPath()
      ctx.moveTo(getX(0), padT + chartH)
      for (let i = 0; i <= lastActualIdx; i++) {
        const v = hourlyTrend[i].actual ?? 0
        i === 0 ? ctx.lineTo(getX(i), getY(v)) : ctx.lineTo(getX(i), getY(v))
      }
      ctx.lineTo(getX(lastActualIdx), padT + chartH)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Actual line (blue)
      ctx.strokeStyle = "rgba(79,130,241,1)"
      ctx.lineWidth = 2.5
      ctx.lineJoin = "round"
      ctx.beginPath()
      for (let i = 0; i <= lastActualIdx; i++) {
        const v = hourlyTrend[i].actual ?? 0
        i === 0 ? ctx.moveTo(getX(i), getY(v)) : ctx.lineTo(getX(i), getY(v))
      }
      ctx.stroke()

      // Dots for actual
      for (let i = 0; i <= lastActualIdx; i++) {
        const v = hourlyTrend[i].actual ?? 0
        ctx.beginPath()
        ctx.arc(getX(i), getY(v), 3.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(79,130,241,1)"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    // Pending dots (grey)
    for (let i = lastActualIdx + 1; i < n; i++) {
      ctx.beginPath()
      ctx.arc(getX(i), getY(hourlyTrend[i].target), 4, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(148,163,184,0.35)"
      ctx.fill()
    }

    // X-axis labels
    ctx.fillStyle = "rgba(148,163,184,0.8)"
    ctx.font = "9.5px Inter, system-ui"
    ctx.textAlign = "center"
    hourlyTrend.forEach((d, i) => {
      ctx.fillText(d.hour, getX(i), H - padB + 16)
    })

    // Legend
    ctx.font = "10px Inter, system-ui"
    ctx.textAlign = "left"
    ctx.fillStyle = "rgba(79,130,241,1)";  ctx.fillRect(padL, 4, 16, 3)
    ctx.fillStyle = "rgba(100,116,139,0.7)"; ctx.fillText("Actual", padL + 20, 9)
    ctx.setLineDash([4, 3])
    ctx.strokeStyle = "rgba(251,146,60,0.85)"; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(padL + 80, 6); ctx.lineTo(padL + 96, 6); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "rgba(100,116,139,0.7)"; ctx.fillText("Target", padL + 100, 9)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 210 }}
    />
  )
}

// ── Downtime Pareto ───────────────────────────────────────────────────────
const PARETO_COLORS = ["#EF4444", "#F97316", "#EAB308", "#3B82F6", "#8B5CF6", "#6B7280"]

// ── Doughnut Defect Chart ─────────────────────────────────────────────────
const DONUT_COLORS = ["#EF4444", "#3B82F6", "#EAB308", "#8B5CF6", "#10B981", "#F97316", "#6B7280", "#94A3B8"]

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-muted-foreground">{payload[0].value} pcs &mdash; {payload[0].payload.percentage}%</p>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const totalOutput = sewingLines.reduce((s, l) => s + l.actual, 0)
  const avgEff = Math.round(
    sewingLines
      .filter((l) => l.status !== "IDLE" && l.status !== "MAINTENANCE" && l.efficiency > 0)
      .reduce((s, l, _, a) => s + l.efficiency / a.length, 0) * 10
  ) / 10
  const criticalAlerts = sewingLines.reduce((s, l) => s + l.alerts, 0)
  const activeLines = sewingLines.filter((l) => l.status === "RUNNING").length
  const dhu = 2.2
  const rft = 97.8

  const maxDowntime = Math.max(...downtimeReasons.map((d) => d.minutes))

  return (
    <AppLayout>
      <PageContainer>
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-5">
          <KpiCard title="Total Output" value={`${totalOutput.toLocaleString()} pcs`} target="35,000" change="+4.2%" trend="up" icon={<Package size={17} className="text-blue-600" />} color="bg-blue-100 dark:bg-blue-900/30" />
          <KpiCard title="Factory Efficiency" value={`${avgEff}%`} target="80.0%" change="-1.1%" trend="down" trendPositive={false} icon={<Activity size={17} className="text-purple-600" />} color="bg-purple-100 dark:bg-purple-900/30" />
          <KpiCard title="Active Lines" value={`${activeLines} / 16`} target="80% active" change="+2" trend="up" icon={<Zap size={17} className="text-green-600" />} color="bg-green-100 dark:bg-green-900/30" />
          <KpiCard title="DHU" value={`${dhu}`} target="< 2.5" change="-0.3" trend="down" trendPositive={true} icon={<ShieldCheck size={17} className="text-emerald-600" />} color="bg-emerald-100 dark:bg-emerald-900/30" />
          <KpiCard title="Right First Time" value={`${rft}%`} target="98.0%" change="-0.2%" trend="down" trendPositive={false} icon={<TrendingUp size={17} className="text-orange-600" />} color="bg-orange-100 dark:bg-orange-900/30" />
          <KpiCard title="Critical Alerts" value={`${criticalAlerts} alerts`} target="0" change={`+${criticalAlerts}`} trend="up" trendPositive={false} icon={<AlertTriangle size={17} className="text-red-600" />} color="bg-red-100 dark:bg-red-900/30" />
        </div>

        {/* DHU + RFT highlight cards */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <ShieldCheck size={22} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wide">DHU — Defects per 100 Units</p>
              <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 leading-tight">{dhu}</p>
              <p className="text-[11px] text-emerald-600/70 dark:text-emerald-500 mt-0.5">Target: {"<"} 2.5 &bull; Today inline inspections</p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <CheckCircle2 size={22} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold uppercase tracking-wide">Right-First-Time (RFT)</p>
              <p className="text-3xl font-black text-blue-700 dark:text-blue-300 leading-tight">{rft}%</p>
              <p className="text-[11px] text-blue-600/70 dark:text-blue-500 mt-0.5">Target: 98.0% &bull; All denim lines combined</p>
            </div>
          </div>
        </div>

        {/* Charts row 1 */}
        <div className="grid lg:grid-cols-2 gap-4 mb-5">
          {/* Canvas trend chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Hourly Production Trend" subtitle="Actual vs Target — 8AM to 7PM (10 hrs)" />
            <HourlyTrendCanvas />
          </div>

          {/* Downtime Pareto */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Downtime Pareto" subtitle="Top 6 reasons today (minutes)" />
            <div className="space-y-2.5 mt-1">
              {downtimeReasons.map((d, i) => (
                <div key={d.reason} className="flex items-center gap-3">
                  <span className="w-32 text-xs text-muted-foreground truncate shrink-0">{d.reason}</span>
                  <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{
                        width: `${(d.minutes / maxDowntime) * 100}%`,
                        backgroundColor: PARETO_COLORS[i],
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-12 text-right shrink-0">{d.minutes} min</span>
                  <span className="text-[10px] text-muted-foreground w-12 text-right shrink-0">{d.lines} lines</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid lg:grid-cols-5 gap-4 mb-5">
          {/* Defect Doughnut */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Denim Defect Distribution" subtitle="By defect type today" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={defectTypes}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="name"
                >
                  {defectTypes.map((_, idx) => (
                    <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CUSTOM_TOOLTIP />} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(v) => <span className="text-[10px] text-muted-foreground">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Line Status Quick View */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line Status Quick View" subtitle="All 16 lines — L1–L12 + F1–F4" />
            <div className="grid grid-cols-4 gap-2">
              {sewingLines.map((line) => {
                const eff = line.efficiency
                const barColor = eff >= 80 ? "bg-green-500" : eff >= 60 ? "bg-yellow-500" : eff > 0 ? "bg-red-500" : "bg-gray-300 dark:bg-gray-700"
                const statusDot =
                  line.status === "RUNNING" ? "bg-green-500" :
                  line.status === "WARNING" ? "bg-yellow-500" :
                  line.status === "DOWN" ? "bg-red-500" :
                  "bg-gray-400"
                return (
                  <div key={line.line} className="rounded-lg border border-border bg-muted/20 px-2.5 py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-foreground">{line.line}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                      <div className={`h-full rounded-full ${barColor}`} style={{ width: `${eff}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{eff > 0 ? `${eff}%` : line.status}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Orders at Risk + AI Insights */}
        <div className="grid lg:grid-cols-3 gap-4 mb-5">
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <SectionHeader title="AI Production Insights" subtitle="Smart recommendations" />
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Prediction</p>
              <p className="text-xs text-muted-foreground">L-05 predicted to miss daily target by ~15% due to J-Stitch machine breakdown. Escalate to maintenance.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Recommendation</p>
              <p className="text-xs text-muted-foreground">Transfer 2 floater operators from L-08 to L-03 to balance WIP accumulation on Cargo Denim line.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Alert</p>
              <p className="text-xs text-muted-foreground">ORD-9962 (Tommy Hilfiger) at risk for Mar 30 ship date. Shade sorting delay contributing to L-05 downtime.</p>
            </div>
            <button className="w-full bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
              Apply Recommendations
            </button>
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Active Orders Status" subtitle="Ship date vs. production progress" />
            <div className="space-y-3">
              {orders.slice(0, 7).map((order) => {
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
                    <div className="w-16 shrink-0 text-right">
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
          <SectionHeader title="Line Performance" subtitle="Live tracking — all 16 lines (L-01 to L-12 + F-01 to F-04)" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-xs text-muted-foreground">
                  {["Line", "Style / Order", "Status", "Efficiency", "Act / Tgt", "Operators", "Alerts"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sewingLines.map((line) => (
                  <tr key={line.line} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-foreground text-sm">{line.line}</td>
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-medium text-foreground truncate max-w-[140px]">{line.style}</p>
                      <p className="text-[10px] text-muted-foreground">{line.order}</p>
                    </td>
                    <td className="px-3 py-2.5"><StatusBadge status={line.status} size="sm" /></td>
                    <td className="px-3 py-2.5 w-36"><ProgressBar value={line.efficiency} showLabel /></td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{line.actual} / {line.target}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{line.operators}</td>
                    <td className="px-3 py-2.5 text-xs">
                      {line.alerts > 0 ? (
                        <span className="flex items-center gap-1 text-red-500 font-medium"><AlertTriangle size={11} />{line.alerts}</span>
                      ) : (
                        <CheckCircle2 size={13} className="text-green-500" />
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
