"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet"
import L from "leaflet"
import { useMemo, useState, useEffect, useRef } from "react"
import { LayersToggle, type LayersState } from "./layers-toggle"
import {
  samplePlants,
  samplePipelines,
  sampleStorageSites,
  sampleDemandHubs,
  sampleRenewables,
  mockOptimizationResult,
} from "@/lib/sample-data"

const plantIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export function MapView({ showZones = false }: { showZones?: boolean }) {
  const [layers, setLayers] = useState<LayersState>({
    plants: true,
    pipelines: true,
    storage: true,
    demand: true,
    renewables: true,
  })
  
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [mapKey, setMapKey] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    setIsClient(true)
    
    // Cleanup function to remove map instance
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove()
          mapRef.current = null
        } catch (error) {
          console.warn('Error cleaning up map:', error)
        }
      }
    }
  }, [])

  const center: [number, number] = useMemo(() => [50.5, 1], [])
  
  if (!isClient) {
    return (
      <div className="relative h-[70vh] w-full rounded-2xl border bg-muted/20 flex items-center justify-center">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] w-full rounded-2xl border" ref={containerRef}>
      <MapContainer 
        key={mapKey}
        center={center} 
        zoom={6} 
        className="h-full w-full rounded-2xl" 
        scrollWheelZoom
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org" rel="noreferrer" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {layers.plants &&
          samplePlants.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={plantIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{p.name}</div>
                  <div>Status: {p.status}</div>
                  <div>Capacity: {p.capacityMW} MW</div>
                  {p.nearbyRenewables ? <div>Nearby: {p.nearbyRenewables}</div> : null}
                </div>
              </Popup>
            </Marker>
          ))}

        {layers.pipelines &&
          samplePipelines.map((pl) => (
            <Polyline key={pl.id} positions={pl.coordinates} pathOptions={{ color: "#0ea5e9", weight: 3 }} />
          ))}

        {layers.storage &&
          sampleStorageSites.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={plantIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{s.name}</div>
                  <div>Capacity: {s.capacityKtons} kT</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {layers.demand &&
          sampleDemandHubs.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={plantIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{d.name}</div>
                  <div>Type: {d.type}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {layers.renewables &&
          sampleRenewables.map((r) => (
            <Marker key={r.id} position={[r.lat, r.lng]} icon={plantIcon}>
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{r.name}</div>
                  <div>Type: {r.type}</div>
                </div>
              </Popup>
            </Marker>
          ))}

        {showZones &&
          mockOptimizationResult.highlightedZones.map((z) => (
            <Circle
              key={z.id}
              center={[z.lat, z.lng]}
              radius={z.radiusKm * 1000}
              pathOptions={{ color: z.color, fillOpacity: 0.15 }}
            />
          ))}
      </MapContainer>

      <div className="pointer-events-none absolute left-3 top-3">
        <LayersToggle layers={layers} onChange={setLayers} />
      </div>
    </div>
  )
}
