"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { machines } from "@/lib/data"
import { Wrench, AlertTriangle, CheckCircle2, Settings, Clock } from "lucide-react"

export default function MachinesPage() {
  const running = machines.filter((m) => m.status === "Running").length
  const breakdown = machines.filter((m) => m.status === "Breakdown").length

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Machines", value: machines.length, icon: <Settings size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Running", value: running, icon: <CheckCircle2 size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Breakdown", value: breakdown, icon: <AlertTriangle size={18} />, color: "bg-red-100 dark:bg-red-900/20 text-red-600" },
            { label: "Overdue Service", value: 1, icon: <Clock size={18} />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
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
          <SectionHeader title="Machine Registry" subtitle="All production equipment" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Machine ID", "Type", "Brand", "Model", "Line", "Station", "Status", "Last Service", "Next Service"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {machines.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{m.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{m.type}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{m.brand}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{m.model}</td>
                    <td className="px-3 py-3 text-xs font-medium">{m.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{m.station}</td>
                    <td className="px-3 py-3"><StatusBadge status={m.status} size="sm" /></td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{m.lastService}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">
                      <span className={m.nextService === "OVERDUE" ? "text-red-500 font-semibold" : "text-muted-foreground"}>{m.nextService}</span>
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
