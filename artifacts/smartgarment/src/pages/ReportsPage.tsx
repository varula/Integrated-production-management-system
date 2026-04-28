import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader } from "@/components/shared"
import { orders, weeklyOutput, lineEfficiency } from "@/lib/data"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts"

const orderByBuyer = orders.reduce((acc: Record<string, number>, o) => {
  acc[o.buyer] = (acc[o.buyer] || 0) + o.qty
  return acc
}, {})
const buyerData = Object.entries(orderByBuyer).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

const COLORS = ["oklch(0.52 0.18 250)", "oklch(0.52 0.15 155)", "oklch(0.72 0.19 75)", "oklch(0.577 0.245 27.325)", "oklch(0.65 0.18 310)", "oklch(0.6 0.15 200)", "oklch(0.7 0.12 120)", "oklch(0.5 0.1 30)", "oklch(0.68 0.14 60)", "oklch(0.55 0.2 285)"]

export default function ReportsPage() {
  const totalOrderQty = orders.reduce((s, o) => s + o.qty, 0)
  const totalShipped = orders.reduce((s, o) => s + o.shipped, 0)
  const totalBalance = orders.reduce((s, o) => s + o.balance, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Order Qty", value: totalOrderQty.toLocaleString(), color: "text-blue-600" },
            { label: "Total Shipped", value: totalShipped.toLocaleString(), color: "text-green-600" },
            { label: "Balance", value: totalBalance.toLocaleString(), color: "text-orange-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Weekly Production Output" subtitle="Actual vs Target" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyOutput} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconSize={10} />
                <Bar dataKey="output" name="Actual" fill="oklch(0.52 0.18 250)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="oklch(0.88 0.01 240)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Order Volume by Buyer" subtitle="Total pieces" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={buyerData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {buyerData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [v.toLocaleString(), "Pcs"]} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Line Efficiency Comparison" subtitle="Today" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={lineEfficiency} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                <YAxis dataKey="line" type="category" tick={{ fontSize: 10 }} width={35} />
                <Tooltip formatter={(v: number) => [`${v}%`, "Efficiency"]} />
                <Bar dataKey="efficiency" radius={[0, 3, 3, 0]} fill="oklch(0.52 0.15 155)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Order Progress Summary" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    {["Order", "Buyer", "Total", "Shipped", "Balance", "%Done"].map((h) => (
                      <th key={h} className="text-left font-medium pb-2.5 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((o) => {
                    const pct = Math.round(((o.qty - o.balance) / o.qty) * 100)
                    return (
                      <tr key={o.id} className="hover:bg-muted/40">
                        <td className="py-2 pr-3 font-semibold text-primary whitespace-nowrap">{o.id}</td>
                        <td className="py-2 pr-3 text-muted-foreground whitespace-nowrap">{o.buyer}</td>
                        <td className="py-2 pr-3 font-medium">{o.qty.toLocaleString()}</td>
                        <td className="py-2 pr-3 text-green-600 font-medium">{o.shipped.toLocaleString()}</td>
                        <td className="py-2 pr-3 text-orange-600 font-medium">{o.balance.toLocaleString()}</td>
                        <td className="py-2">
                          <span className={`font-semibold ${pct >= 50 ? "text-green-600" : "text-orange-600"}`}>{pct}%</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
