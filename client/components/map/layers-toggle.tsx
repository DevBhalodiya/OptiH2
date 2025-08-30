"use client"

type LayerKey = "plants" | "pipelines" | "storage" | "demand" | "renewables"

export interface LayersState {
  plants: boolean
  pipelines: boolean
  storage: boolean
  demand: boolean
  renewables: boolean
}

export function LayersToggle({
  layers,
  onChange,
}: {
  layers: LayersState
  onChange: (next: LayersState) => void
}) {
  const toggle = (key: LayerKey) => onChange({ ...layers, [key]: !layers[key] })
  return (
    <div
      className="pointer-events-auto rounded-xl border bg-background/95 p-3 shadow"
      role="group"
      aria-label="Map layer toggles"
    >
      <label className="flex items-center gap-2 py-1 text-sm">
        <input type="checkbox" checked={layers.plants} onChange={() => toggle("plants")} />
        <span>Hydrogen Plants</span>
      </label>
      <label className="flex items-center gap-2 py-1 text-sm">
        <input type="checkbox" checked={layers.pipelines} onChange={() => toggle("pipelines")} />
        <span>Pipelines</span>
      </label>
      <label className="flex items-center gap-2 py-1 text-sm">
        <input type="checkbox" checked={layers.storage} onChange={() => toggle("storage")} />
        <span>Storage Facilities</span>
      </label>
      <label className="flex items-center gap-2 py-1 text-sm">
        <input type="checkbox" checked={layers.demand} onChange={() => toggle("demand")} />
        <span>Demand Hubs</span>
      </label>
      <label className="flex items-center gap-2 py-1 text-sm">
        <input type="checkbox" checked={layers.renewables} onChange={() => toggle("renewables")} />
        <span>Renewables</span>
      </label>
    </div>
  )
}
