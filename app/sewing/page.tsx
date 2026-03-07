"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { sewingLines, lineEfficiency, weeklyOutput } from "@/lib/data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from "recharts"
import { AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react"

export default function SewingPage() {
  const running = sewingLines.filter((l) => l.status === "RUNNING").length
  const warning = sewingLines.filter((l) => l.status === "WARNING").length
  const down = sewingLines.filter((l) => l.status === "DOWN").length
  const idle = sewingLines.filter((l) => l.status === "IDLE" || l.status === "MAINTENANCE").length

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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line-wise Efficiency" subtitle="Today's performance" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={lineEfficiency} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="line" tick={{ fontSize: 10 }} />
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

        {/* Line Detail Table */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="All Sewing Lines" subtitle="Real-time line monitoring" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Line", "Order", "Style", "Status", "Efficiency", "Act / Tgt", "Operators", "Machines", "Downtime", "Supervisor", "Alerts"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sewingLines.map((line) => (
                  <tr key={line.line} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-bold text-foreground">{line.line}</td>
                    <td className="px-3 py-3 text-xs text-primary font-medium whitespace-nowrap">{line.order}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{line.style}</td>
                    <td className="px-3 py-3"><StatusBadge status={line.status} size="sm" /></td>
                    <td className="px-3 py-3 w-32">
                      <ProgressBar value={line.efficiency} showLabel />
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {line.actual} / {line.target}
                    </td>
                    <td className="px-3 py-3 text-xs text-center">{line.operators}</td>
                    <td className="px-3 py-3 text-xs text-center">{line.machines}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      {line.downtime > 0 ? (
                        <span className="text-red-500">{line.downtime} min</span>
                      ) : (
                        <span className="text-green-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{line.supervisor}</td>
                    <td className="px-3 py-3 text-xs">
                      {line.alerts > 0 ? (
                        <span className="flex items-center gap-1 text-red-500 font-medium">
                          <AlertTriangle size={12} /> {line.alerts}
                        </span>
                      ) : (
                        <CheckCircle2 size={14} className="text-green-500" />
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
