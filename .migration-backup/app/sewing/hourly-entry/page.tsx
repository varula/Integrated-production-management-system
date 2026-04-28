"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader } from "@/components/shared"
import { useFactory } from "@/lib/factory-context"
import { useLinesData, useProductionPlansData } from "@/hooks/useProductionData"
import { supabase } from "@/lib/supabase"
import { Plus, Save, AlertCircle } from "lucide-react"

const HOURS = [
  { slot: "8-9AM", index: 0 },
  { slot: "9-10AM", index: 1 },
  { slot: "10-11AM", index: 2 },
  { slot: "11-12PM", index: 3 },
  { slot: "12-1PM", index: 4 },
  { slot: "1-2PM", index: 5 },
  { slot: "2-3PM", index: 6 },
  { slot: "3-4PM", index: 7 },
  { slot: "4-5PM", index: 8 },
  { slot: "5-6PM", index: 9 },
  { slot: "6-7PM", index: 10 },
]

export default function HourlyEntryPage() {
  const { factory } = useFactory()
  const { lines, isLoading: ll } = useLinesData(factory?.id)
  const { plans: productionPlans, isLoading: pl } = useProductionPlansData(factory?.id)
  const isLoading = !factory?.id || ll || pl
  const [selectedLine, setSelectedLine] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [hourlyData, setHourlyData] = useState<Record<number, { produced: number; passed: number; defects: number }>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const sewingLines = lines?.filter((l: any) => l.line_type === "SEWING") || []

  const handleHourChange = (index: number, field: "produced" | "passed" | "defects", value: number) => {
    setHourlyData((prev) => ({
      ...prev,
      [index]: {
        ...prev[index] || { produced: 0, passed: 0, defects: 0 },
        [field]: value,
      },
    }))
  }

  const handleSave = async () => {
    if (!selectedLine || !selectedPlan) {
      setMessage({ type: "error", text: "Please select Line and Production Plan" })
      return
    }

    setSaving(true)
    try {
      const line = sewingLines.find((l: any) => l.id === selectedLine)
      const plan = productionPlans?.find((p: any) => p.id === selectedPlan)

      const records = Object.entries(hourlyData)
        .filter(([_, data]) => data.produced > 0)
        .map(([hourIndex, data]) => ({
          factory_id: factory?.id,
          line_id: selectedLine,
          production_plan_id: selectedPlan,
          hour_slot: HOURS[parseInt(hourIndex)].slot,
          hour_index: parseInt(hourIndex),
          produced_qty: data.produced,
          passed_qty: data.passed,
          defect_qty: data.defects,
          date: new Date().toISOString().split("T")[0],
        }))

      const { error } = await supabase
        .from("hourly_production")
        .insert(records)

      if (error) throw error

      setMessage({ type: "success", text: `Saved ${records.length} hourly records successfully!` })
      setHourlyData({})
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save data" })
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </PageContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
            title="Hourly Production Entry" 
            subtitle="Record sewing line output by hour"
          />

          {/* Selection Cards */}
          <div className="grid lg:grid-cols-2 gap-4 mb-6">
            {/* Line Selection */}
            <div className="bg-card border border-border rounded-xl p-5">
              <label className="text-sm font-semibold text-foreground mb-3 block">Select Sewing Line</label>
              <select
                value={selectedLine}
                onChange={(e) => setSelectedLine(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a line...</option>
                {sewingLines.map((line: any) => (
                  <option key={line.id} value={line.id}>
                    {line.line_code} — {line.line_leader_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Production Plan Selection */}
            <div className="bg-card border border-border rounded-xl p-5">
              <label className="text-sm font-semibold text-foreground mb-3 block">Select Order</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose an order...</option>
                {productionPlans?.map((plan: any) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.order_id} — {plan.style} ({plan.planned_qty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === "success" ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900" : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"}`}>
              <AlertCircle size={18} className={message.type === "success" ? "text-green-600" : "text-red-600"} />
              <p className={`text-sm ${message.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                {message.text}
              </p>
            </div>
          )}

          {/* Hourly Input Table */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <SectionHeader 
              title="Hourly Data Entry" 
              subtitle="Enter produced, passed, and defect quantities for each hour"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left font-medium px-3 py-2.5">Hour</th>
                    <th className="text-left font-medium px-3 py-2.5">Produced Qty</th>
                    <th className="text-left font-medium px-3 py-2.5">Passed Qty</th>
                    <th className="text-left font-medium px-3 py-2.5">Defect Qty</th>
                    <th className="text-left font-medium px-3 py-2.5">Pass %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {HOURS.map((hour) => {
                    const data = hourlyData[hour.index] || { produced: 0, passed: 0, defects: 0 }
                    const passRate = data.produced > 0 ? ((data.passed / data.produced) * 100).toFixed(1) : "—"
                    return (
                      <tr key={hour.index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-3 py-3 font-medium text-foreground">{hour.slot}</td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={data.produced || ""}
                            onChange={(e) => handleHourChange(hour.index, "produced", parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={data.passed || ""}
                            onChange={(e) => handleHourChange(hour.index, "passed", parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={data.defects || ""}
                            onChange={(e) => handleHourChange(hour.index, "defects", parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-3 py-3 text-sm text-muted-foreground font-medium">{passRate}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !selectedLine || !selectedPlan}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Hourly Data"}
            </button>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
