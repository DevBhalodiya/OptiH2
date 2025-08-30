import { NextResponse } from "next/server"
import { mockOptimizationResult } from "@/lib/sample-data"

export async function GET() {
  const header = ["Site", "Score", "CapacityMW", "CostUSDm", "DemandCoveragePct", "Lat", "Lng"].join(",")
  const rows = mockOptimizationResult.recommendations
    .map((r) => [r.siteName, r.score, r.capacityMW, r.estimatedCostUSDm, r.demandCoveragePct, r.lat, r.lng].join(","))
    .join("\n")
  const csv = `${header}\n${rows}\n`
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="inframap-report.csv"',
    },
  })
}
