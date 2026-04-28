import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { orders } from "@/lib/data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const trackingData = orders.map((o) => ({
  id: o.id,
  done: o.qty - o.balance,
  balance: o.balance,
  total: o.qty,
}))

export default function OrderTrackingPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <SectionHeader title="Order Tracking" subtitle="Production vs. balance by order" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={trackingData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
              <XAxis dataKey="id" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="done" name="Produced" fill="oklch(0.52 0.15 155)" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="balance" name="Balance" fill="oklch(0.577 0.245 27.325)" stackId="a" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Delivery Schedule" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Order ID", "Buyer", "Style", "Total Qty", "Produced", "Balance", "Ship Date", "Line", "SMV", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{o.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{o.buyer}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{o.style}</td>
                    <td className="px-3 py-3 text-xs text-right">{o.qty.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-green-600 font-medium">{o.shipped.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-right text-orange-600 font-medium">{o.balance.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.shipDate}</td>
                    <td className="px-3 py-3 text-xs font-medium">{o.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{o.smv}</td>
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
