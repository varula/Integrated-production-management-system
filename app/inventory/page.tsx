"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { fabricInventory, trimInventory } from "@/lib/data"
import { Warehouse, Package, AlertTriangle, TrendingDown } from "lucide-react"
import { useState } from "react"

export default function InventoryPage() {
  const [tab, setTab] = useState<"fabric" | "trim">("fabric")

  const critFabric = fabricInventory.filter((f) => f.status === "Critical" || f.status === "Low").length
  const critTrim = trimInventory.filter((t) => t.status === "Critical" || t.status === "Low").length
  const totalFabricAvail = fabricInventory.reduce((s, f) => s + f.available, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Fabric SKUs", value: fabricInventory.length, icon: <Warehouse size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Available Fabric", value: `${(totalFabricAvail / 1000).toFixed(0)}k m`, icon: <TrendingDown size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Low / Critical Fabric", value: critFabric, icon: <AlertTriangle size={18} />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
            { label: "Trim SKUs Alert", value: critTrim, icon: <Package size={18} />, color: "bg-red-100 dark:bg-red-900/20 text-red-600" },
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
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title="Inventory Management" subtitle="Fabric & Trim store" />
            <div className="flex rounded-lg overflow-hidden border border-border text-xs">
              {(["fabric", "trim"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-1.5 capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  {t === "fabric" ? "Fabric Store" : "Trim Store"}
                </button>
              ))}
            </div>
          </div>

          {tab === "fabric" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                    {["ID", "Fabric Name", "Supplier", "Color", "In Stock (m)", "Reserved (m)", "Available (m)", "Location", "Reorder Point", "Status"].map((h) => (
                      <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fabricInventory.map((f) => (
                    <tr key={f.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{f.id}</td>
                      <td className="px-3 py-3 text-xs font-medium max-w-[160px] truncate">{f.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{f.supplier}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{f.color}</td>
                      <td className="px-3 py-3 text-xs text-right font-medium">{f.inStock.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-right text-orange-600">{f.reserved.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-right text-green-600 font-medium">{f.available.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{f.location}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground text-right">{f.reorderPoint.toLocaleString()}</td>
                      <td className="px-3 py-3"><StatusBadge status={f.status} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
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
                    <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{t.id}</td>
                      <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{t.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">{t.type}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{t.supplier}</td>
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
          )}
        </div>
      </PageContainer>
    </AppLayout>
  )
}
