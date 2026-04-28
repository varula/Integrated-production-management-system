"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { shipmentData } from "@/lib/data"
import { Ship, Package, Globe, FileCheck, MapPin } from "lucide-react"

export default function ShipmentPage() {
  const booked = shipmentData.filter((s) => s.status === "Booking Confirmed").length
  const totalQty = shipmentData.reduce((s, sh) => s + sh.qty, 0)
  const totalCartons = shipmentData.reduce((s, sh) => s + sh.cartons, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Shipments", value: shipmentData.length, icon: <Ship size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Total Quantity", value: `${totalQty.toLocaleString()} pcs`, icon: <Package size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Total Cartons", value: totalCartons.toLocaleString(), icon: <Package size={18} />, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
            { label: "Booking Confirmed", value: booked, icon: <FileCheck size={18} />, color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" },
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

        <div className="space-y-4">
          {shipmentData.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-primary">{s.id}</span>
                    <span className="text-xs text-muted-foreground">&bull;</span>
                    <span className="text-sm font-semibold text-foreground">{s.order}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{s.buyer} — {s.style}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Incoterm: <span className="font-medium text-foreground">{s.incoterm}</span></p>
                  <p className="text-xs text-muted-foreground">BL: <span className="font-medium text-foreground">{s.bl}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {[
                  { label: "Quantity", value: `${s.qty.toLocaleString()} pcs` },
                  { label: "Cartons", value: s.cartons.toString() },
                  { label: "Weight", value: s.weight },
                  { label: "Volume", value: s.volume },
                  { label: "Port", value: s.port },
                  { label: "Destination", value: s.destination },
                  { label: "ETD", value: s.etd },
                  { label: "ETA", value: s.eta },
                ].map((item) => (
                  <div key={item.label} className="bg-muted/40 rounded-lg p-2.5">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-xs font-semibold text-foreground leading-tight">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Ship size={13} />
                <span>Vessel: <span className="font-medium text-foreground">{s.vessel}</span></span>
                <MapPin size={13} className="ml-2" />
                <span>{s.port} → {s.destination}</span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </AppLayout>
  )
}
