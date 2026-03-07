"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { orders } from "@/lib/data"
import { Search, Filter, Download, PlusCircle } from "lucide-react"
import { useState } from "react"

export default function OrdersPage() {
  const [search, setSearch] = useState("")
  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase()) ||
      o.style.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: orders.length,
    inProd: orders.filter((o) => o.status === "In Production").length,
    warning: orders.filter((o) => o.status === "Warning").length,
    completed: orders.filter((o) => o.shipped > 0).length,
  }

  return (
    <AppLayout>
      <PageContainer>
        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Orders", value: stats.total, color: "text-blue-600" },
            { label: "In Production", value: stats.inProd, color: "text-green-600" },
            { label: "At Risk", value: stats.warning, color: "text-yellow-600" },
            { label: "Partially Shipped", value: stats.completed, color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <SectionHeader title="Order Management" subtitle={`${filtered.length} orders found`} />
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="pl-8 pr-3 py-1.5 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary w-48"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-muted transition-colors">
                <Filter size={13} /> Filter
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:opacity-90 transition-opacity">
                <PlusCircle size={13} /> New Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground bg-muted/30">
                  {["Order ID", "Buyer", "Style", "Color", "Size", "Total Qty", "Shipped", "Balance", "Ship Date", "Line", "Priority", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-semibold text-primary text-xs whitespace-nowrap">{o.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{o.buyer}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{o.style}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.color}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{o.size}</td>
                    <td className="px-3 py-3 text-xs font-medium text-right whitespace-nowrap">{o.qty.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-green-600 font-medium text-right whitespace-nowrap">{o.shipped.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-orange-600 font-medium text-right whitespace-nowrap">{o.balance.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.shipDate}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{o.line}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={o.priority === "Low" ? "Low2" : o.priority === "Critical" ? "Critical2" : o.priority} size="sm" />
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={o.status} size="sm" /></td>
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
