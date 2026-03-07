"use client"

import { useRef, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { KpiCard, ProgressBar, SectionHeader, PageContainer, StatusBadge } from "@/components/shared"
import {
  sewingLines, hourlyTrend, lineEfficiency, orders, defectTypes, downtimePareto,
} from "@/lib/data"
import {
  Package, Activity, AlertTriangle, CheckCircle2,
  TrendingUp, Layers, Zap, ShieldCheck, Target,
} from "lucide-react"

// ─── Canvas: Hourly Trend (10 hours, hand-drawn) ──────────────────────────
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

    const padL = 44, padR = 12, padT = 16, padB = 40
    const chartW = W - padL - padR
    const chartH = H - padT - padB

    const isDark = document.documentElement.classList.contains("dark")
    const gridColor = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"
    const textColor = isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"
    const actualColor = "#3b82f6"
    const targetColor = "#ef4444"
    const pendingColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"

    const maxVal = 2800
    const points = hourlyTrend

    const xStep = chartW / (points.length - 1)
    const yScale = (v: number) => padT + chartH - (v / maxVal) * chartH

    // Background
    ctx.clearRect(0, 0, W, H)

    // Grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke()
      const label = Math.round(maxVal - (maxVal / 4) * i)
      ctx.fillStyle = textColor
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(label.toString(), padL - 6, y + 4)
    }

    // Shade pending region (last 2 hours)
    const pendingStart = points.findIndex((p) => p.actual === null)
    if (pendingStart !== -1) {
      const px = padL + pendingStart * xStep
      ctx.fillStyle = pendingColor
      ctx.fillRect(px, padT, padL + chartW - px, chartH)
    }

    // Actual gradient fill
    const actualPts = points.filter((p) => p.actual !== null)
    if (actualPts.length > 1) {
      const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH)
      grad.addColorStop(0, "rgba(59,130,246,0.28)")
      grad.addColorStop(1, "rgba(59,130,246,0.0)")
      ctx.beginPath()
      actualPts.forEach((p, i) => {
        const x = padL + i * xStep
        const y = yScale(p.actual as number)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })
      ctx.lineTo(padL + (actualPts.length - 1) * xStep, padT + chartH)
      ctx.lineTo(padL, padT + chartH)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()
    }

    // Target dashed line (full width)
    ctx.setLineDash([5, 4])
    ctx.strokeStyle = targetColor
    ctx.lineWidth = 1.5
    ctx.beginPath()
    points.forEach((p, i) => {
      const x = padL + i * xStep
      const y = yScale(p.target)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Actual solid line
    ctx.strokeStyle = actualColor
    ctx.lineWidth = 2.5
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.beginPath()
    let first = true
    points.forEach((p, i) => {
      if (p.actual === null) return
      const x = padL + i * xStep
      const y = yScale(p.actual as number)
      first ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      first = false
    })
    ctx.stroke()

    // Dots on actual
    points.forEach((p, i) => {
      if (p.actual === null) return
      const x = padL + i * xStep
      const y = yScale(p.actual as number)
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = p.actual >= p.target ? "#22c55e" : actualColor
      ctx.fill()
      ctx.strokeStyle = "white"
      ctx.lineWidth = 1.5
      ctx.stroke()
    })

    // X labels
    ctx.fillStyle = textColor
    ctx.font = "9.5px Inter, sans-serif"
    ctx.textAlign = "center"
    points.forEach((p, i) => {
      const x = padL + i * xStep
      ctx.fillText(p.hour, x, padT + chartH + 16)
    })

    // Pending labels
    points.forEach((p, i) => {
      if (p.actual !== null) return
      const x = padL + i * xStep
      const y = padT + chartH / 2
      ctx.fillStyle = textColor
      ctx.font = "9px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("—", x, y)
    })

    // Legend
    ctx.setLineDash([])
    const legendY = padT - 2
    ctx.fillStyle = actualColor; ctx.beginPath(); ctx.arc(padL + 2, legendY, 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = textColor; ctx.font = "9px Inter, sans-serif"; ctx.textAlign = "left"; ctx.fillText("Actual", padL + 9, legendY + 3)
    ctx.setLineDash([4, 3]); ctx.strokeStyle = targetColor; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(padL + 60, legendY); ctx.lineTo(padL + 74, legendY); ctx.stroke()
    ctx.setLineDash([]); ctx.fillStyle = textColor; ctx.fillText("Target", padL + 77, legendY + 3)
  }, [])

  return <canvas ref={canvasRef} style={{ width: "100%", height: "210px" }} />
}

// ─── Downtime Pareto (animated bars) ─────────────────────────────────────
function DowntimePareto() {
  const max = Math.max(...downtimePareto.map((d) => d.minutes))
  return (
    <div className="space-y-2.5">
      {downtimePareto.map((d) => (
        <div key={d.reason}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-foreground font-medium truncate max-w-[150px]">{d.reason}</span>
            <span className="text-xs text-muted-foreground ml-2 shrink-0">{d.minutes} min</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.minutes / max) * 100}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Doughnut Chart (Canvas) — Denim Defect Distribution ─────────────────
function DefectDoughnut() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const colors = ["#3b82f6", "#ef4444", "#f97316", "#eab308", "#8b5cf6", "#22c55e", "#6b7280"]
  const total = defectTypes.reduce((s, d) => s + d.count, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const SIZE = canvas.offsetWidth
    canvas.width = SIZE * dpr
    canvas.height = SIZE * dpr
    ctx.scale(dpr, dpr)

    const cx = SIZE / 2, cy = SIZE / 2
    const outerR = SIZE * 0.42
    const innerR = SIZE * 0.26
    let startAngle = -Math.PI / 2

    defectTypes.forEach((d, i) => {
      const slice = (d.count / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, outerR, startAngle, startAngle + slice)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
      ctx.strokeStyle = "var(--color-card, white)"
      ctx.lineWidth = 2
      ctx.stroke()
      startAngle += slice
    })

    // Inner hole
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    const isDark = document.documentElement.classList.contains("dark")
    ctx.fillStyle = isDark ? "#1c1c2e" : "#ffffff"
    ctx.fill()

    // Center label
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)"
    ctx.font = `bold ${SIZE * 0.12}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total.toString(), cx, cy - 6)
    ctx.font = `${SIZE * 0.075}px Inter, sans-serif`
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
    ctx.fillText("defects", cx, cy + SIZE * 0.07)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <canvas ref={canvasRef} style={{ width: "110px", height: "110px", flexShrink: 0 }} />
      <div className="flex-1 min-w-0 space-y-1.5">
        {defectTypes.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-xs text-foreground truncate flex-1">{d.name}</span>
            <span className="text-xs text-muted-foreground shrink-0">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Line Status Quick View ───────────────────────────────────────────────
function LineStatusGrid() {
  const statusColor: Record<string, string> = {
    RUNNING: "bg-green-500",
    WARNING: "bg-yellow-500",
    DOWN: "bg-red-500",
    IDLE: "bg-gray-400",
    MAINTENANCE: "bg-purple-500",
  }
  const lines = sewingLines.filter((l) => !["L-13", "L-14"].includes(l.line))

  return (
    <div className="grid grid-cols-4 gap-2">
      {lines.map((l) => (
        <div
          key={l.line}
          className="bg-muted/40 rounded-lg p-2 border border-border"
          title={`${l.line}: ${l.style} — ${l.efficiency}% eff`}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className={`w-2 h-2 rounded-full ${statusColor[l.status] ?? "bg-gray-400"}`} />
            <span className="text-[10px] font-bold text-foreground">{l.line}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${l.efficiency >= 80 ? "bg-green-500" : l.efficiency >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${l.efficiency}%` }}
            />
          </div>
          <p className="text-[9px] text-muted-foreground mt-1 text-right">{l.efficiency > 0 ? `${l.efficiency}%` : l.status}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const totalOutput = sewingLines.reduce((s, l) => s + l.actual, 0)
  const activeSewing = sewingLines.filter((l) => l.status === "RUNNING" || l.status === "WARNING")
  const avgEff = activeSewing.reduce((s, l, _, a) => s + l.efficiency / a.length, 0)
  const criticalAlerts = sewingLines.reduce((s, l) => s + l.alerts, 0)
  const activeLines = sewingLines.filter((l) => l.status === "RUNNING").length
  const dhu = 2.2
  const rft = 97.8

  return (
    <AppLayout>
      <PageContainer>
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          <KpiCard title="Today's Output"     value={`${totalOutput.toLocaleString()} pcs`} target="35,000"  change="+4.2%"  trend="up"   icon={<Package      size={18} className="text-blue-600"    />} color="bg-blue-50   dark:bg-blue-900/30"   />
          <KpiCard title="Avg. Efficiency"    value={`${avgEff.toFixed(1)}%`}                target="80.0%"   change="-1.1%"  trend="down" trendPositive={false} icon={<Activity   size={18} className="text-purple-600"  />} color="bg-purple-50 dark:bg-purple-900/30" />
          <KpiCard title="Active Lines"       value={`${activeLines} / 16`}                  target="80% on"  change="+2"     trend="up"   icon={<Zap          size={18} className="text-green-600"   />} color="bg-green-50  dark:bg-green-900/30"  />
          <KpiCard title="DHU"                value={`${dhu} DHU`}                           target="< 2.0"   change="+0.2"   trend="up"   trendPositive={false} icon={<ShieldCheck size={18} className="text-emerald-600"/>} color="bg-emerald-50 dark:bg-emerald-900/30" />
          <KpiCard title="WIP Inventory"      value="8,920 pcs"                               target="< 10k"   change="-12%"   trend="down" trendPositive={true}  icon={<Layers     size={18} className="text-orange-600"  />} color="bg-orange-50 dark:bg-orange-900/30" />
          <KpiCard title="Critical Alerts"    value={`${criticalAlerts} alerts`}             target="0"       change={`+2`}   trend="up"   trendPositive={false} icon={<AlertTriangle size={18} className="text-red-600" />} color="bg-red-50    dark:bg-red-900/30"    />
        </div>

        {/* DHU + RFT Highlight */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-emerald-600 dark:bg-emerald-700 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">Defects Per 100 Units</p>
              <p className="text-white text-4xl font-extrabold">{dhu}</p>
              <p className="text-emerald-200 text-xs mt-1">Target: &lt; 2.0 DHU</p>
            </div>
            <ShieldCheck size={48} className="text-emerald-300 opacity-60" />
          </div>
          <div className="bg-blue-600 dark:bg-blue-700 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">Right First Time</p>
              <p className="text-white text-4xl font-extrabold">{rft}%</p>
              <p className="text-blue-200 text-xs mt-1">Target: &gt; 98.5%</p>
            </div>
            <Target size={48} className="text-blue-300 opacity-60" />
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Canvas Hourly Trend */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader
              title="Hourly Production Trend"
              subtitle="Actual vs Target — 08:00 AM to 07:00 PM (10 hrs)"
            />
            <HourlyTrendCanvas />
          </div>

          {/* Downtime Pareto */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Downtime Pareto" subtitle="Top 6 downtime reasons today" />
            <DowntimePareto />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Line Status Quick View */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line Status Quick View" subtitle="All 16 lines (L-01–L-12, F-01–F-04)" />
            <LineStatusGrid />
          </div>

          {/* Defect Doughnut */}
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Denim Defect Distribution" subtitle="Inline + end-line QC today" />
            <DefectDoughnut />
          </div>
        </div>

        {/* AI Insights + Order Status */}
        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-1 bg-card border border-border rounded-xl p-5 space-y-3">
            <SectionHeader title="AI Production Insights" subtitle="Smart recommendations" />
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Prediction</p>
              <p className="text-xs text-muted-foreground">L-05 (Straight Leg Jeans) will miss daily target by ~22% due to J-Stitch machine breakdown. Escalate to maintenance.</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Recommendation</p>
              <p className="text-xs text-muted-foreground">Transfer 2 floater operators from L-09 to L-03 to reduce WIP accumulation on Cargo Denim line.</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Alert</p>
              <p className="text-xs text-muted-foreground">ORD-9962 (Tommy Hilfiger) is at risk for Mar 30 ship date. 9,000 pcs balance, 0 shipped. Escalate immediately.</p>
            </div>
            <button className="w-full mt-2 bg-primary text-primary-foreground text-xs font-medium py-2 rounded-lg hover:opacity-90 transition-opacity">
              Apply Recommendations
            </button>
          </div>

          {/* Orders Status */}
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
                  {["Line", "Style / Order", "Status", "Efficiency", "Output (Act/Tgt)", "Operators", "Alerts"].map((h) => (
                    <th key={h} className="text-left font-medium pb-2.5 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sewingLines.filter((l) => l.status !== "IDLE").map((line) => (
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
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{line.actual} / {line.target}</td>
                    <td className="py-2.5 pr-4 text-xs text-muted-foreground">{line.operators}</td>
                    <td className="py-2.5 text-xs">
                      {line.alerts > 0 ? (
                        <span className="flex items-center gap-1 text-red-500">
                          <AlertTriangle size={12} />{line.alerts}
                        </span>
                      ) : (
                        <CheckCircle2 size={12} className="text-green-500" />
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
