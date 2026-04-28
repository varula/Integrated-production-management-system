import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"
import { qualityData, defectTypes } from "@/lib/data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { ShieldCheck, AlertTriangle, XCircle, TrendingDown } from "lucide-react"

const COLORS = ["oklch(0.52 0.18 250)", "oklch(0.52 0.15 155)", "oklch(0.72 0.19 75)", "oklch(0.577 0.245 27.325)", "oklch(0.65 0.18 310)", "oklch(0.6 0.15 200)", "oklch(0.7 0.12 120)", "oklch(0.5 0.1 30)"]

export default function QualityPage() {
  const totalInspected = qualityData.reduce((s, q) => s + q.inspected, 0)
  const totalDefects = qualityData.reduce((s, q) => s + q.defects, 0)
  const pass = qualityData.filter((q) => q.status === "Pass").length
  const fail = qualityData.filter((q) => q.status === "Fail").length
  const avgDhu = qualityData.reduce((s, q, _, a) => s + q.dhu / a.length, 0)

  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Inspected", value: totalInspected.toLocaleString(), icon: <ShieldCheck size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Total Defects", value: totalDefects.toLocaleString(), icon: <AlertTriangle size={18} />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
            { label: "Pass / Fail", value: `${pass} / ${fail}`, icon: <XCircle size={18} />, color: "bg-red-100 dark:bg-red-900/20 text-red-600" },
            { label: "Avg DHU", value: `${avgDhu.toFixed(1)}%`, icon: <TrendingDown size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
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

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Defect Analysis" subtitle="Top defect types this week" />
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={defectTypes} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 240 / 0.5)" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [v, "Defects"]} />
                <Bar dataKey="count" radius={[0, 3, 3, 0]} fill="oklch(0.577 0.245 27.325)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Defect Distribution" subtitle="Percentage breakdown" />
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={defectTypes} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                  {defectTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Inspection Records" subtitle="All QC checkpoints" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["QC ID", "Order", "Style", "Line", "Inspector", "Type", "Inspected", "Passed", "Defects", "Defect %", "DHU", "Top Defect", "Date", "Result"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {qualityData.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 font-semibold text-primary text-xs whitespace-nowrap">{q.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{q.order}</td>
                    <td className="px-3 py-3 text-xs max-w-[120px] truncate">{q.style}</td>
                    <td className="px-3 py-3 text-xs font-medium">{q.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.inspector}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.inspectionType}</td>
                    <td className="px-3 py-3 text-xs text-right">{q.inspected}</td>
                    <td className="px-3 py-3 text-xs text-right text-green-600 font-medium">{q.passed}</td>
                    <td className="px-3 py-3 text-xs text-right text-red-500 font-medium">{q.defects}</td>
                    <td className="px-3 py-3 text-xs text-right">
                      <span className={q.defectRate > 8 ? "text-red-500 font-semibold" : q.defectRate > 5 ? "text-yellow-600 font-medium" : "text-green-600"}>
                        {q.defectRate}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-right text-muted-foreground">{q.dhu}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.topDefect}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{q.date}</td>
                    <td className="px-3 py-3"><StatusBadge status={q.status} size="sm" /></td>
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
