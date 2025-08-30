"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { LayersToggle, type LayersState } from "./layers-toggle"
import {
  samplePlants,
  samplePipelines,
  sampleStorageSites,
  sampleDemandHubs,
  sampleRenewables,
  mockOptimizationResult,
} from "@/lib/sample-data"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export function LeafletMap({ showZones = false }: { showZones?: boolean }) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const polylinesRef = useRef<L.Polyline[]>([])
  const circlesRef = useRef<L.Circle[]>([])
  
  const [layers, setLayers] = useState<LayersState>({
    plants: true,
    pipelines: true,
    storage: true,
    demand: true,
    renewables: true,
  })

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Create map instance only if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [50.5, 1],
        zoom: 6,
        scrollWheelZoom: true,
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Clear all markers, polylines, and circles
        markersRef.current.forEach(marker => marker.remove())
        polylinesRef.current.forEach(polyline => polyline.remove())
        circlesRef.current.forEach(circle => circle.remove())
        
        markersRef.current = []
        polylinesRef.current = []
        circlesRef.current = []
        
        // Remove map instance
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update layers when layer state changes
  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    polylinesRef.current.forEach(polyline => polyline.remove())
    circlesRef.current.forEach(circle => circle.remove())
    
    markersRef.current = []
    polylinesRef.current = []
    circlesRef.current = []

    // Add plants
    if (layers.plants) {
      samplePlants.forEach((plant) => {
        const marker = L.marker([plant.lat, plant.lng])
          .bindPopup(`
            <div>
              <div style="font-weight: 600">${plant.name}</div>
              <div>Status: ${plant.status}</div>
              <div>Capacity: ${plant.capacityMW} MW</div>
              ${plant.nearbyRenewables ? `<div>Nearby: ${plant.nearbyRenewables}</div>` : ''}
            </div>
          `)
          .addTo(mapRef.current!)
        markersRef.current.push(marker)
      })
    }

    // Add pipelines
    if (layers.pipelines) {
      samplePipelines.forEach((pipeline) => {
        const polyline = L.polyline(pipeline.coordinates as L.LatLngExpression[], {
          color: "#0ea5e9",
          weight: 3,
        }).addTo(mapRef.current!)
        polylinesRef.current.push(polyline)
      })
    }

    // Add storage sites
    if (layers.storage) {
      sampleStorageSites.forEach((site) => {
        const marker = L.marker([site.lat, site.lng])
          .bindPopup(`
            <div>
              <div style="font-weight: 600">${site.name}</div>
              <div>Capacity: ${site.capacityKtons} kT</div>
            </div>
          `)
          .addTo(mapRef.current!)
        markersRef.current.push(marker)
      })
    }

    // Add demand hubs
    if (layers.demand) {
      sampleDemandHubs.forEach((hub) => {
        const marker = L.marker([hub.lat, hub.lng])
          .bindPopup(`
            <div>
              <div style="font-weight: 600">${hub.name}</div>
              <div>Type: ${hub.type}</div>
            </div>
          `)
          .addTo(mapRef.current!)
        markersRef.current.push(marker)
      })
    }

    // Add renewables
    if (layers.renewables) {
      sampleRenewables.forEach((renewable) => {
        const marker = L.marker([renewable.lat, renewable.lng])
          .bindPopup(`
            <div>
              <div style="font-weight: 600">${renewable.name}</div>
              <div>Type: ${renewable.type}</div>
            </div>
          `)
          .addTo(mapRef.current!)
        markersRef.current.push(marker)
      })
    }

    // Add optimization zones
    if (showZones) {
      mockOptimizationResult.highlightedZones.forEach((zone) => {
        const circle = L.circle([zone.lat, zone.lng], {
          radius: zone.radiusKm * 1000,
          color: zone.color,
          fillOpacity: 0.15,
        }).addTo(mapRef.current!)
        circlesRef.current.push(circle)
      })
    }
  }, [layers, showZones])

  return (
    <div className="relative h-[70vh] w-full rounded-2xl border">
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl" />
      
      <div className="pointer-events-none absolute left-3 top-3">
        <LayersToggle layers={layers} onChange={setLayers} />
      </div>
    </div>
  )
}
