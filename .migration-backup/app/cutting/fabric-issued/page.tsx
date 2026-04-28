"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { cuttingData } from "@/lib/data"

export default function FabricIssuedPage() {
  const totalIssued = cuttingData.reduce((s, c) => s + c.issued, 0)
  const totalBalance = cuttingData.reduce((s, c) => s + c.balance, 0)
  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Cut", value: cuttingData.reduce((s, c) => s + c.cut, 0).toLocaleString(), color: "text-blue-600" },
            { label: "Total Issued to Sewing", value: totalIssued.toLocaleString(), color: "text-green-600" },
            { label: "Balance in Cutting", value: totalBalance.toLocaleString(), color: "text-orange-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Fabric Issued to Sewing" subtitle="Bundle-wise issuance tracking" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Cut ID", "Order", "Style", "Fabric", "Color", "Cut Qty", "Issued", "Balance", "Table", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cuttingData.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3 text-xs font-semibold text-primary">{c.id}</td>
                    <td className="px-3 py-3 text-xs font-medium">{c.order}</td>
                    <td className="px-3 py-3 text-xs max-w-[120px] truncate">{c.style}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[130px] truncate">{c.fabric}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.color}</td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{c.cut.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-green-600 font-medium">{c.issued.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-orange-600 font-medium">{c.balance.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs">{c.table}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.date}</td>
                    <td className="px-3 py-3"><StatusBadge status={c.status} size="sm" /></td>
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
