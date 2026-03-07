"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { sewingLines, lineEfficiency, weeklyOutput } from "@/lib/data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts"
import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react"

// 10-hour columns (8AM–7PM). Last 2 are pending (grey)
const HOURS = ["8–9AM","9–10AM","10–11AM","11–12PM","12–1PM","1–2PM","2–3PM","3–4PM","4–5PM","5–6PM","6–7PM"]
const PENDING_HOURS = new Set(["5–6PM", "6–7PM"])

// Simulated hourly output per sewing line (pcs per hour)
const hourlyByLine: Record<string, (number | null)[]> = {
  "L-01": [38, 42, 45, 44, 40, 43, 42, 41, 39, null, null],
  "L-02": [32, 35, 38, 36, 33, 36, 34, 35, 32, null, null],
  "L-03": [28, 31, 33, 30, 29, 31, 30, 29, 34, null, null],
  "L-04": [40, 44, 46, 45, 42, 44, 43, 42, 42, null, null],
  "L-05": [20, 22, 18, 20, 19, 21, 20, 21, 19, null, null],
  "L-06": [33, 36, 38, 37, 34, 36, 35, 34, 35, null, null],
  "L-07": [30, 33, 35, 34, 31, 34, 33, 34, 34, null, null],
  "L-08": [36, 40, 42, 41, 38, 40, 39, 38, 33, null, null],
  "L-09": [35, 38, 40, 39, 36, 39, 37, 36, 34, null, null],
  "L-10": [31, 34, 36, 35, 32, 35, 34, 33, 37, null, null],
  "L-11": [38, 42, 44, 43, 40, 42, 41, 42, 45, null, null],
  "L-12": [37, 41, 43, 42, 39, 41, 40, 41, 42, null, null],
  "F-01": [44, 48, 50, 49, 46, 48, 47, 46, 42, null, null],
  "F-02": [36, 40, 42, 41, 38, 40, 39, 38, 36, null, null],
  "F-03": [34, 38, 40, 39, 36, 38, 37, 36, 30, null, null],
}

export default function SewingPage() {
  const activeSewing = sewingLines.filter((l) => !["L-13", "L-14"].includes(l.line))
  const running     = activeSewing.filter((l) => l.status === "RUNNING").length
  const warning     = activeSewing.filter((l) => l.status === "WARNING").length
  const down        = activeSewing.filter((l) => l.status === "DOWN").length
  const maintenance = activeSewing.filter((l) => l.status === "MAINTENANCE").length

  return (
    <AppLayout>
      <PageContainer>
        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Running",     value: running,     icon: <CheckCircle2 size={18} />, color: "text-green-600  bg-green-50  dark:bg-green-900/20" },
            { label: "Warning",     value: warning,     icon: <AlertTriangle size={18} />,color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" },
            { label: "Down",        value: down,        icon: <Clock size={18} />,        color: "text-red-600    bg-red-50    dark:bg-red-900/20" },
            { label: "Maintenance", value: maintenance, icon: <Wrench size={18} />,       color: "text-gray-600   bg-gray-100  dark:bg-gray-800" },
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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line-wise Efficiency" subtitle="Today's performance — all 16 lines" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lineEfficiency} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="line" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Efficiency"]} />
                <Bar dataKey="efficiency" radius={[3, 3, 0, 0]} fill="oklch(0.52 0.18 250)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Weekly Output vs Target" subtitle="Last 6 days" />
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyOutput}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} />
                <Line type="monotone" dataKey="output" stroke="oklch(0.52 0.18 250)" strokeWidth={2} dot={{ r: 3 }} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="oklch(0.577 0.245 27.325)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10-Hour Hourly Output Table */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <SectionHeader title="Hourly Output by Line" subtitle="08:00 AM – 07:00 PM (10 hours) — grey columns are pending" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                  <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap sticky left-0 bg-muted/30">Line</th>
                  <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap sticky left-12 bg-muted/30">Style</th>
                  {HOURS.map((h) => (
                    <th
                      key={h}
                      className={`text-center font-medium px-2 py-2.5 whitespace-nowrap ${PENDING_HOURS.has(h) ? "text-muted-foreground/40" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                  <th className="text-center font-medium px-3 py-2.5 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeSewing.map((line) => {
                  const hrs = hourlyByLine[line.line] ?? Array(11).fill(null)
                  const total = hrs.reduce<number>((s, v) => s + (v ?? 0), 0)
                  return (
                    <tr key={line.line} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap sticky left-0 bg-card">{line.line}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap max-w-[110px] truncate sticky left-12 bg-card">{line.style !== "Idle" ? line.style : "—"}</td>
                      {HOURS.map((h, i) => {
                        const val = hrs[i]
                        const isPending = PENDING_HOURS.has(h)
                        return (
                          <td
                            key={h}
                            className={`px-2 py-2.5 text-center ${isPending ? "text-muted-foreground/30 bg-muted/20" : "text-foreground"}`}
                          >
                            {isPending ? "—" : (val ?? "—")}
                          </td>
                        )
                      })}
                      <td className="px-3 py-2.5 text-center font-semibold text-foreground">{total > 0 ? total : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Line Detail Table */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="All Lines Detail" subtitle="Real-time monitoring (L-01–L-12, F-01–F-04)" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Line","Order","Style","Status","Efficiency","Act / Tgt","Operators","Machines","Downtime","Supervisor","Alerts"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeSewing.map((line) => (
                  <tr key={line.line} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-bold text-foreground">{line.line}</td>
                    <td className="px-3 py-3 text-xs text-primary font-medium whitespace-nowrap">{line.order}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{line.style}</td>
                    <td className="px-3 py-3"><StatusBadge status={line.status} size="sm" /></td>
                    <td className="px-3 py-3 w-32"><ProgressBar value={line.efficiency} showLabel /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{line.actual} / {line.target}</td>
                    <td className="px-3 py-3 text-xs text-center">{line.operators}</td>
                    <td className="px-3 py-3 text-xs text-center">{line.machines}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {line.downtime > 0 ? <span className="text-red-500">{line.downtime} min</span> : <span className="text-green-500">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{line.supervisor}</td>
                    <td className="px-3 py-3 text-xs">
                      {line.alerts > 0
                        ? <span className="flex items-center gap-1 text-red-500 font-medium"><AlertTriangle size={12} /> {line.alerts}</span>
                        : <CheckCircle2 size={14} className="text-green-500" />
                      }
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
