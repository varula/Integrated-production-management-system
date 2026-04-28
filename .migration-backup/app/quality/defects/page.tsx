"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { qualityData, defectTypes } from "@/lib/data"

export default function DefectsPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <SectionHeader title="Defect Analysis" subtitle="Detailed defect breakdown by type" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {defectTypes.map((d) => (
              <div key={d.name} className="border border-border rounded-lg p-3">
                <p className="text-sm font-semibold text-foreground">{d.name}</p>
                <p className="text-2xl font-bold text-destructive mt-1">{d.count}</p>
                <p className="text-xs text-muted-foreground">{d.percentage}% of total defects</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Defect Records" subtitle="Per inspection record" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["QC ID", "Order", "Line", "Type", "Defects", "Defect %", "DHU", "Top Defect", "Result"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {qualityData.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3 text-xs font-semibold text-primary">{q.id}</td>
                    <td className="px-3 py-3 text-xs font-medium">{q.order}</td>
                    <td className="px-3 py-3 text-xs">{q.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{q.inspectionType}</td>
                    <td className="px-3 py-3 text-xs text-right text-red-500 font-medium">{q.defects}</td>
                    <td className="px-3 py-3 text-xs text-right">
                      <span className={q.defectRate > 8 ? "text-red-500 font-semibold" : q.defectRate > 5 ? "text-yellow-600" : "text-green-600"}>{q.defectRate}%</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-right text-muted-foreground">{q.dhu}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{q.topDefect}</td>
                    <td className="px-3 py-3"><StatusBadge status={q.status} size="sm" /></td>
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
