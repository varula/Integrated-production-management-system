import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { operators, attendanceSummary } from "@/lib/data"
import { Users, UserCheck, UserX, Clock } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const attData = [
  { name: "Present", value: attendanceSummary.present, fill: "oklch(0.52 0.15 155)" },
  { name: "Absent", value: attendanceSummary.absent, fill: "oklch(0.577 0.245 27.325)" },
  { name: "Late", value: attendanceSummary.late, fill: "oklch(0.72 0.19 75)" },
]

export default function HRPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Workers", value: attendanceSummary.total, icon: <Users size={18} />, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
            { label: "Present Today", value: attendanceSummary.present, icon: <UserCheck size={18} />, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
            { label: "Absent", value: attendanceSummary.absent, icon: <UserX size={18} />, color: "bg-red-100 dark:bg-red-900/20 text-red-600" },
            { label: "Late Arrival", value: attendanceSummary.late, icon: <Clock size={18} />, color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600" },
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

        <div className="grid lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Attendance Overview" subtitle="Today's summary" />
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={attData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75}>
                  {attData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {attData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Attendance Rate" subtitle={`${attendanceSummary.presentRate}% present rate`} />
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Present Rate</span>
                  <span className="font-semibold text-green-600">{attendanceSummary.presentRate}%</span>
                </div>
                <ProgressBar value={attendanceSummary.presentRate} colorClass="bg-green-500" showLabel={false} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Absent Rate</span>
                  <span className="font-semibold text-red-500">{((attendanceSummary.absent / attendanceSummary.total) * 100).toFixed(1)}%</span>
                </div>
                <ProgressBar value={(attendanceSummary.absent / attendanceSummary.total) * 100} colorClass="bg-red-500" showLabel={false} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Late Rate</span>
                  <span className="font-semibold text-yellow-600">{((attendanceSummary.late / attendanceSummary.total) * 100).toFixed(1)}%</span>
                </div>
                <ProgressBar value={(attendanceSummary.late / attendanceSummary.total) * 100} colorClass="bg-yellow-500" showLabel={false} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Workforce Directory" subtitle={`${operators.length} operators listed`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["ID", "Name", "Line", "Role", "Skill", "Grade", "Attendance", "Efficiency", "Experience"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {operators.map((o) => (
                  <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 text-xs text-primary font-semibold">{o.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{o.name}</td>
                    <td className="px-3 py-3 text-xs text-center">{o.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.role}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{o.skill}</td>
                    <td className="px-3 py-3 text-xs font-semibold text-center">{o.grade}</td>
                    <td className="px-3 py-3"><StatusBadge status={o.attendance} size="sm" /></td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{o.efficiency > 0 ? `${o.efficiency}%` : "—"}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{o.experience}</td>
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
