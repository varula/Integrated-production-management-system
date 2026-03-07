"use client"

import { AppLayout } from "@/components/app-layout"
import { PageContainer, SectionHeader } from "@/components/shared"
import { factory } from "@/lib/data"

export default function SettingsPage() {
  return (
    <AppLayout>
      <PageContainer>
        <div className="max-w-2xl space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="Factory Configuration" />
            <div className="space-y-4">
              {[
                { label: "Factory Name", value: factory.name },
                { label: "Location", value: factory.location },
                { label: "Total Lines", value: factory.totalLines.toString() },
                { label: "Total Workers", value: factory.totalWorkers.toString() },
                { label: "Current Shift", value: factory.shift },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{f.label}</span>
                  <span className="text-sm font-medium text-foreground">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <SectionHeader title="System Settings" />
            <p className="text-sm text-muted-foreground">Advanced system configuration options will be available here.</p>
          </div>
        </div>
      </PageContainer>
    </AppLayout>
  )
}
