import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"
import { KPICharts } from "@/components/charts/kpi-charts"

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-balance text-2xl font-semibold">Dashboard & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Key performance indicators, capacity breakdowns, and coverage trends.
        </p>
        <div className="mt-4">
          <StatsCards />
        </div>
        <div className="mt-6">
          <KPICharts />
        </div>
      </main>
    </>
  )
}
