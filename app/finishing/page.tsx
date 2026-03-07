"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { finishingData } from "@/lib/data"
import { Shirt, Package, CheckCircle2 } from "lucide-react"

// 10-hour columns (8AM–7PM). Last 2 are pending (grey)
const HOURS = ["8–9AM","9–10AM","10–11AM","11–12PM","12–1PM","1–2PM","2–3PM","3–4PM","4–5PM","5–6PM","6–7PM"]
const PENDING_HOURS = new Set(["5–6PM", "6–7PM"])

// Finishing line hourly output data
const finishingHourly: { line: string; style: string; hrs: (number|null)[] }[] = [
  { line: "F-01", style: "Slim Fit Jeans",    hrs: [44,48,50,49,46,48,47,46,42,null,null] },
  { line: "F-02", style: "Jogger Denim",      hrs: [36,40,42,41,38,40,39,38,36,null,null] },
  { line: "F-03", style: "Tapered Fit Jeans", hrs: [34,38,40,39,36,38,37,36,30,null,null] },
  { line: "F-04", style: "Bootcut (Maint.)",  hrs: [null,null,null,null,null,null,null,null,null,null,null] },
]

export default function FinishingPage() {
  const totalReceived = finishingData.reduce((s, f) => s + f.received, 0)
  const totalPacked = finishingData.reduce((s, f) => s + f.packed, 0)
  const totalCartons = finishingData.reduce((s, f) => s + f.cartons, 0)
  const completed = finishingData.filter((f) => f.status === "Completed").length

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Received", value: totalReceived.toLocaleString(), icon: <Shirt size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Total Packed", value: totalPacked.toLocaleString(), icon: <Package size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Cartons Ready", value: totalCartons.toLocaleString(), icon: <Package size={18} />, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
            { label: "Completed", value: completed, icon: <CheckCircle2 size={18} />, color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 10-Hour Finishing Hourly Output Table */}
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <SectionHeader title="Hourly Finishing Output by Line" subtitle="08:00 AM – 07:00 PM (10 hours) — grey columns are pending" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                  <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap">Line</th>
                  <th className="text-left font-medium px-3 py-2.5 whitespace-nowrap">Style</th>
                  {HOURS.map((h) => (
                    <th key={h} className={`text-center font-medium px-2 py-2.5 whitespace-nowrap ${PENDING_HOURS.has(h) ? "text-muted-foreground/40" : ""}`}>{h}</th>
                  ))}
                  <th className="text-center font-medium px-3 py-2.5 whitespace-nowrap">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {finishingHourly.map((row) => {
                  const total = row.hrs.reduce<number>((s, v) => s + (v ?? 0), 0)
                  return (
                    <tr key={row.line} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-foreground">{row.line}</td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap max-w-[110px] truncate">{row.style}</td>
                      {HOURS.map((h, i) => {
                        const val = row.hrs[i]
                        const isPending = PENDING_HOURS.has(h)
                        return (
                          <td key={h} className={`px-2 py-2.5 text-center ${isPending ? "text-muted-foreground/30 bg-muted/20" : "text-foreground"}`}>
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

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Finishing & Packing Status" subtitle="Order-wise finishing progress" />
          <div className="space-y-4">
            {finishingData.map((f) => {
              const stages = [
                { label: "Received", value: f.received },
                { label: "Ironed", value: f.ironed },
                { label: "Tagged", value: f.tagged },
                { label: "Packed", value: f.packed },
              ]
              return (
                <div key={f.id} className="border border-border rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{f.order} — {f.style}</p>
                      <p className="text-xs text-muted-foreground">Pack: {f.packMethod} &bull; {f.cartons} cartons</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Completion</p>
                        <p className="text-sm font-bold text-foreground">{f.completionRate}%</p>
                      </div>
                      <StatusBadge status={f.status} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {stages.map((stage) => (
                      <div key={stage.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{stage.label}</span>
                          <span className="font-medium text-foreground">{stage.value.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={stage.value} max={f.received} showLabel={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
