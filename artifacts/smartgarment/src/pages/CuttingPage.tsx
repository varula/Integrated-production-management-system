import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { cuttingData } from "@/lib/data"
import { Scissors, CheckCircle2, Clock, TrendingUp } from "lucide-react"

export default function CuttingPage() {
  const completed = cuttingData.filter((c) => c.status === "Completed").length
  const inProgress = cuttingData.filter((c) => c.status === "In Progress").length
  const totalCut = cuttingData.reduce((s, c) => s + c.cut, 0)
  const avgEff = cuttingData.reduce((s, c, _, a) => s + c.efficiency / a.length, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Cut Pcs", value: totalCut.toLocaleString(), icon: <Scissors size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Completed", value: completed, icon: <CheckCircle2 size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "In Progress", value: inProgress, icon: <Clock size={18} />, color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600" },
            { label: "Avg Efficiency", value: `${avgEff.toFixed(1)}%`, icon: <TrendingUp size={18} />, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
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
          <SectionHeader title="Cutting Plans" subtitle="All cutting lot details" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Cut ID", "Order", "Style", "Fabric", "Color", "Plies", "Cut Qty", "Issued", "Balance", "Table", "Marker", "Efficiency", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cuttingData.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-semibold text-primary text-xs whitespace-nowrap">{c.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{c.order}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{c.style}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{c.fabric}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.color}</td>
                    <td className="px-3 py-3 text-xs text-center">{c.plies}</td>
                    <td className="px-3 py-3 text-xs font-medium text-right whitespace-nowrap">{c.cut.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-green-600 font-medium text-right whitespace-nowrap">{c.issued.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-orange-600 font-medium text-right whitespace-nowrap">{c.balance.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-center">{c.table}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{c.marker}</td>
                    <td className="px-3 py-3 w-32">
                      <ProgressBar value={c.efficiency} showLabel />
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.date}</td>
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
