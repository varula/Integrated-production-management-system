import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader, StatusBadge } from "@/components/shared"

const aqlData = [
  { id: "AQL-001", order: "ORD-9950", buyer: "Levi Strauss", style: "Jogger Denim", inspector: "Third Party (SGS)", inspected: 80, critical: 0, major: 1, minor: 3, aqlLevel: "II", acceptable: 2, result: "Pass", date: "2026-03-06" },
  { id: "AQL-002", order: "ORD-9971", buyer: "Calvin Klein", style: "Bootcut Denim", inspector: "Internal QA", inspected: 80, critical: 0, major: 2, minor: 4, aqlLevel: "II", acceptable: 2, result: "Warning", date: "2026-03-07" },
  { id: "AQL-003", order: "ORD-9988", buyer: "Wrangler", style: "Tapered Fit Jeans", inspector: "Third Party (Bureau Veritas)", inspected: 200, critical: 0, major: 0, minor: 2, aqlLevel: "II", acceptable: 5, result: "Pass", date: "2026-03-06" },
  { id: "AQL-004", order: "ORD-9921", buyer: "H&M Group", style: "Slim Fit Jeans", inspector: "Internal QA", inspected: 80, critical: 0, major: 3, minor: 6, aqlLevel: "I", acceptable: 2, result: "Fail", date: "2026-03-05" },
]

export default function AQLPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionHeader title="AQL Inspection Records" subtitle="Final audit & third-party inspection results" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                  {["AQL ID", "Order", "Buyer", "Style", "Inspector", "Inspected", "Critical", "Major", "Minor", "AQL Level", "Acceptable", "Date", "Result"].map((h) => (
                    <th key={h} className="text-left font-medium px-3 py-2.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {aqlData.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3 text-xs font-semibold text-primary">{a.id}</td>
                    <td className="px-3 py-3 text-xs font-medium">{a.order}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{a.buyer}</td>
                    <td className="px-3 py-3 text-xs max-w-[130px] truncate">{a.style}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{a.inspector}</td>
                    <td className="px-3 py-3 text-xs text-right">{a.inspected}</td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{a.critical === 0 ? <span className="text-green-600">0</span> : <span className="text-red-500">{a.critical}</span>}</td>
                    <td className="px-3 py-3 text-xs text-right font-medium">{a.major > 2 ? <span className="text-red-500">{a.major}</span> : <span className="text-yellow-600">{a.major}</span>}</td>
                    <td className="px-3 py-3 text-xs text-right text-muted-foreground">{a.minor}</td>
                    <td className="px-3 py-3 text-xs text-center">{a.aqlLevel}</td>
                    <td className="px-3 py-3 text-xs text-center">{a.acceptable}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">{a.date}</td>
                    <td className="px-3 py-3"><StatusBadge status={a.result} size="sm" /></td>
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
