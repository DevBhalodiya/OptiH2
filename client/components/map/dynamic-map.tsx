"use client"

import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { type LayersState } from "./layers-toggle"
import { type MapData } from "@/hooks/useMapData"

// Dynamically import LeafletMap with no SSR to prevent hydration issues
const LeafletMap = dynamic(() => import("./leaflet-map").then((mod) => ({ default: mod.LeafletMap })), {
  ssr: false,
  loading: () => (
    <div className="relative h-[70vh] w-full rounded-2xl border bg-muted/20 flex items-center justify-center">
      <div className="text-muted-foreground">Loading map...</div>
    </div>
  ),
})

export function DynamicMap({ 
  showZones = false, 
  layers, 
  onLayersChange,
  selectedStates = [],
  mapData,
  loading = false
}: { 
  showZones?: boolean
  layers?: LayersState
  onLayersChange?: (layers: LayersState) => void
  selectedStates?: string[]
  mapData?: MapData
  loading?: boolean
}) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return (
      <div className="relative h-[70vh] w-full rounded-2xl border bg-muted/20 flex items-center justify-center">
        <div className="text-muted-foreground">Initializing map...</div>
      </div>
    )
  }
  
  return (
    <LeafletMap 
      showZones={showZones} 
      layers={layers} 
      onLayersChange={onLayersChange} 
      selectedStates={selectedStates}
      mapData={mapData}
      loading={loading}
    />
  )
}
