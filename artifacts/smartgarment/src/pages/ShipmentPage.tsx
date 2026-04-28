import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { shipmentData } from "@/lib/data"
import { Ship, Package, CheckCircle2, Clock } from "lucide-react"

export default function ShipmentPage() {
  const confirmed = shipmentData.filter((s) => s.status === "Booking Confirmed").length
  const pending = shipmentData.filter((s) => s.status === "Docs Pending").length
  const totalQty = shipmentData.reduce((s, sh) => s + sh.qty, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Shipments", value: shipmentData.length, icon: <Ship size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Total Qty", value: totalQty.toLocaleString(), icon: <Package size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Confirmed", value: confirmed, icon: <CheckCircle2 size={18} />, color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" },
            { label: "Docs Pending", value: pending, icon: <Clock size={18} />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
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
          <SectionHeader title="Shipment Tracker" subtitle="All shipment records" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["SHP ID", "Order", "Buyer", "Style", "Qty", "Cartons", "Port", "Destination", "ETD", "ETA", "Vessel", "B/L", "Incoterm", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shipmentData.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{s.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{s.order}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.buyer}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{s.style}</td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{s.qty.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right">{s.cartons}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.port}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.destination}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.etd}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.eta}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.vessel}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.bl}</td>
                    <td className="px-3 py-3 text-xs font-medium">{s.incoterm}</td>
                    <td className="px-3 py-3"><StatusBadge status={s.status} size="sm" /></td>
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
