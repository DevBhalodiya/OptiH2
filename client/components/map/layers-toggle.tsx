"use client"

import { Layers, MapPin, Zap, Database, Target, Leaf } from "lucide-react"

type LayerKey = "plants" | "pipelines" | "storage" | "demand" | "renewables"

export interface LayersState {
  plants: boolean
  pipelines: boolean
  storage: boolean
  demand: boolean
  renewables: boolean
}

const layerConfig = {
  plants: { label: "Hydrogen Plants", icon: MapPin, color: "text-green-600" },
  pipelines: { label: "Pipelines", icon: Zap, color: "text-blue-600" },
  storage: { label: "Storage Facilities", icon: Database, color: "text-purple-600" },
  demand: { label: "Demand Hubs", icon: Target, color: "text-orange-600" },
  renewables: { label: "Renewables", icon: Leaf, color: "text-emerald-600" }
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
    <div className="glass-card p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Map Layers</span>
      </div>
      
      <div className="space-y-2">
        {(Object.keys(layers) as LayerKey[]).map((key) => {
          const config = layerConfig[key]
          const isActive = layers[key]
          
          return (
            <label
              key={key}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/5 ${
                isActive ? 'bg-primary/10 border border-primary/20' : 'hover:border-primary/10'
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => toggle(key)}
                className="w-4 h-4 text-primary border-glass-border rounded focus:ring-primary/20 focus:ring-2"
              />
              <config.icon className={`w-4 h-4 ${config.color}`} />
              <span className="text-sm font-medium text-foreground">{config.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
