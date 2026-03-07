"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge, ProgressBar } from "@/components/shared"
import { operators, attendanceSummary } from "@/lib/data"
import { Users, UserCheck, UserX, Clock, Star } from "lucide-react"
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
            <SectionHeader title="Attendance Overview" subtitle={`${attendanceSummary.presentRate}% attendance rate`} />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={attData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false} >
                  {attData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Skill Distribution" subtitle="Operator grades today" />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[
                { grade: "A+", count: 3, color: "bg-green-500" },
                { grade: "A", count: 5, color: "bg-green-400" },
                { grade: "B+", count: 4, color: "bg-blue-400" },
                { grade: "B", count: 3, color: "bg-yellow-400" },
              ].map((g) => (
                <div key={g.grade} className="text-center p-3 rounded-lg bg-muted/40">
                  <div className={`w-8 h-8 rounded-full ${g.color} flex items-center justify-center text-white font-bold text-xs mx-auto mb-2`}>{g.grade}</div>
                  <p className="text-lg font-bold text-foreground">{g.count}</p>
                  <p className="text-xs text-muted-foreground">Grade {g.grade}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Overall Efficiency Distribution</p>
              <ProgressBar value={attendanceSummary.presentRate} showLabel colorClass="bg-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="Operator Records" subtitle="Today's workforce status" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["Emp ID", "Name", "Line", "Role", "Skill", "Grade", "Attendance", "Efficiency", "Experience", "Shift"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {operators.map((op) => (
                  <tr key={op.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-3 py-3 text-xs font-semibold text-primary whitespace-nowrap">{op.id}</td>
                    <td className="px-3 py-3 text-xs font-medium whitespace-nowrap">{op.name}</td>
                    <td className="px-3 py-3 text-xs font-medium">{op.line}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{op.role}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{op.skill}</td>
                    <td className="px-3 py-3 text-xs">
                      <span className={`flex items-center gap-1 font-semibold ${op.grade.includes("+") ? "text-green-600" : op.grade === "A" ? "text-blue-600" : "text-orange-600"}`}>
                        <Star size={10} /> {op.grade}
                      </span>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={op.attendance} size="sm" /></td>
                    <td className="px-3 py-3 w-28">
                      {op.efficiency > 0 ? (
                        <ProgressBar value={op.efficiency} showLabel />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{op.experience}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{op.shift}</td>
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
