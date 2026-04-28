"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { trimInventory } from "@/lib/data"

export default function TrimsPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Trim Store" subtitle="All accessories & trims inventory" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["ID", "Trim Name", "Type", "Supplier", "In Stock", "Reserved", "Available", "Unit", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trimInventory.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3 text-xs font-semibold text-primary">{t.id}</td>
                    <td className="px-3 py-3 text-xs font-medium">{t.name}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{t.type}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{t.supplier}</td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{t.inStock.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-orange-600">{t.reserved.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-green-600 font-medium">{t.available.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{t.unit}</td>
                    <td className="px-3 py-3"><StatusBadge status={t.status} size="sm" /></td>
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
