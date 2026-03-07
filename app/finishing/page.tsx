"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { finishingData } from "@/lib/data"
import { Shirt, Package, CheckCircle2, Clock } from "lucide-react"

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
