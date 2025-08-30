import { Navbar } from "@/components/navbar"
import { OptimizationPanel } from "@/components/optimization/optimization-panel"
import { MapView } from "@/components/map/map-view"

export default function OptimizePage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-balance text-2xl font-semibold">Optimization Engine</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust parameters, run the model, and review recommended sites.
        </p>

        <div className="mt-4 grid gap-6">
          <OptimizationPanel />
          <div className="rounded-2xl border p-4">
            <h2 className="text-lg font-semibold">Highlighted Zones</h2>
            <p className="mt-1 text-sm text-muted-foreground">Results are shown as color-coded zones on the map.</p>
            <div className="mt-3">
              <MapView showZones />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
