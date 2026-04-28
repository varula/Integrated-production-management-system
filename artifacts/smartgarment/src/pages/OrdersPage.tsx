import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { useProductionPlansData } from "@/hooks/useProductionData"
import { useFactory } from "@/lib/factory-context"
import { Search, Filter, PlusCircle } from "lucide-react"

export default function OrdersPage() {
  const { factory } = useFactory()
  const { plans: productionPlans, isLoading } = useProductionPlansData(factory?.id)
  const [search, setSearch] = useState("")

  const filtered = productionPlans?.filter(
    (p: any) =>
      p.order_id.toLowerCase().includes(search.toLowerCase()) ||
      p.buyer_name.toLowerCase().includes(search.toLowerCase()) ||
      p.style.toLowerCase().includes(search.toLowerCase())
  ) || []

  const stats = {
    total: productionPlans?.length || 0,
    inProd: productionPlans?.filter((p: any) => p.status === "IN_PROGRESS").length || 0,
    notStarted: productionPlans?.filter((p: any) => p.status === "NOT_STARTED").length || 0,
    completed: productionPlans?.filter((p: any) => p.status === "COMPLETED").length || 0,
  }

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Orders", value: stats.total, color: "text-blue-600" },
            { label: "In Production", value: stats.inProd, color: "text-green-600" },
            { label: "Not Started", value: stats.notStarted, color: "text-yellow-600" },
            { label: "Completed", value: stats.completed, color: "text-purple-600" },
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
                  {["Order ID", "Buyer", "Style", "Color", "Size", "Planned Qty", "Target Date", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p: any) => (
                  <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-semibold text-primary text-xs whitespace-nowrap">{p.order_id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{p.buyer_name}</td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{p.style}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{p.color}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{p.size_range}</td>
                    <td className="px-3 py-3 text-xs font-medium text-right whitespace-nowrap">{p.planned_qty?.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{p.target_end_date?.slice(5)}</td>
                    <td className="px-3 py-3"><StatusBadge status={p.status} size="sm" /></td>
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
