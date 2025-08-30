import { Navbar } from "@/components/navbar"
import { ReportsTable } from "@/components/reports/reports-table"

export default function ReportsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-balance text-2xl font-semibold">Reports & Export</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Export ranked sites and KPIs as CSV or PDF. PDF generation will be provided by the backend via
          /api/reports/pdf.
        </p>
        <div className="mt-4">
          <ReportsTable />
        </div>
      </main>
    </>
  )
}
