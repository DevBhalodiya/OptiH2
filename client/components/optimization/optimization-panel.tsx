"use client"

import { useState } from "react"
import useSWR from "swr"
import type { OptimizationParams, OptimizationResult } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function OptimizationPanel() {
  const [params, setParams] = useState<OptimizationParams>({
    renewablesWeight: 60,
    demandDistanceWeight: 40,
    minimizeTransportCost: true,
    applyRegulations: false,
  })

  const { data, mutate, isValidating } = useSWR<OptimizationResult | null>("/api/optimize", fetcher, {
    revalidateOnFocus: false,
  })

  async function runOptimization() {
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
    if (res.ok) await mutate()
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
      <aside className="rounded-2xl border p-4">
        <h2 className="text-balance text-lg font-semibold">Optimization Parameters</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="flex items-center justify-between text-sm">
              <span>Proximity to renewables</span>
              <span className="font-medium text-emerald-600">{params.renewablesWeight}%</span>
            </label>
            <input
              aria-label="Proximity to renewables weight"
              type="range"
              min={0}
              max={100}
              value={params.renewablesWeight}
              onChange={(e) => setParams((p) => ({ ...p, renewablesWeight: Number(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-sm">
              <span>Distance to demand centers</span>
              <span className="font-medium text-emerald-600">{params.demandDistanceWeight}%</span>
            </label>
            <input
              aria-label="Distance to demand centers weight"
              type="range"
              min={0}
              max={100}
              value={params.demandDistanceWeight}
              onChange={(e) => setParams((p) => ({ ...p, demandDistanceWeight: Number(e.target.value) }))}
              className="w-full"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={params.minimizeTransportCost}
              onChange={(e) => setParams((p) => ({ ...p, minimizeTransportCost: e.target.checked }))}
            />
            <span>Minimize transport cost</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={params.applyRegulations}
              onChange={(e) => setParams((p) => ({ ...p, applyRegulations: e.target.checked }))}
            />
            <span>Apply regulatory constraints</span>
          </label>

          <button
            onClick={runOptimization}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-500"
          >
            {isValidating ? "Running..." : "Run Optimization"}
          </button>
        </div>
      </aside>

      <section className="rounded-2xl border p-4">
        <h2 className="text-balance text-lg font-semibold">Top 5 Recommended Sites</h2>
        <div className="mt-4 grid gap-3">
          {data?.recommendations?.map((r) => (
            <div key={r.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{r.siteName}</div>
                <div className="text-sm text-muted-foreground">Score: {r.score}</div>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                <div>Capacity: {r.capacityMW} MW</div>
                <div>Cost: ${r.estimatedCostUSDm}m</div>
                <div>Coverage: {r.demandCoveragePct}%</div>
                <div>
                  Loc: {r.lat.toFixed(2)}, {r.lng.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
          {!data && (
            <p className="text-sm text-muted-foreground">No results yet. Configure parameters and run optimization.</p>
          )}
        </div>
      </section>
    </div>
  )
}
