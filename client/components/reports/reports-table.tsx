"use client"

import { useState } from "react"
import type { Recommendation } from "@/lib/types"
import { mockOptimizationResult } from "@/lib/sample-data"

export function ReportsTable() {
  const [downloading, setDownloading] = useState<null | "csv" | "pdf">(null)
  const rows: Recommendation[] = mockOptimizationResult.recommendations

  async function downloadCSV() {
    try {
      setDownloading("csv")
      const res = await fetch("/api/reports/csv")
      const text = await res.text()
      const blob = new Blob([text], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "inframap-report.csv"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  async function downloadPDF() {
    try {
      setDownloading("pdf")
      const res = await fetch("/api/reports/pdf")
      if (!res.ok) {
        alert("PDF generation is not implemented yet. Connect backend to /api/reports/pdf.")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "inframap-report.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Report: Ranked Sites</h2>
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
          >
            {downloading === "csv" ? "Downloading..." : "Export CSV"}
          </button>
          <button
            onClick={downloadPDF}
            className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {downloading === "pdf" ? "Preparing..." : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-2">Site</th>
              <th className="p-2">Score</th>
              <th className="p-2">Capacity (MW)</th>
              <th className="p-2">Cost (USD m)</th>
              <th className="p-2">Demand Coverage (%)</th>
              <th className="p-2">Location</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2 font-medium">{r.siteName}</td>
                <td className="p-2">{r.score}</td>
                <td className="p-2">{r.capacityMW}</td>
                <td className="p-2">{r.estimatedCostUSDm}</td>
                <td className="p-2">{r.demandCoveragePct}</td>
                <td className="p-2">
                  {r.lat.toFixed(2)}, {r.lng.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Map snapshot and KPIs can be embedded by backend in the PDF.</p>
    </div>
  )
}
