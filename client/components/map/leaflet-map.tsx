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

// Custom icons for different infrastructure types
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

const plantIcon = createCustomIcon('#22c55e') // Green
const storageIcon = createCustomIcon('#8b5cf6') // Purple
const demandIcon = createCustomIcon('#f97316') // Orange
const renewableIcon = createCustomIcon('#10b981') // Emerald

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

    console.log('Initializing map...')

    // Create map instance only if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [23.5937, 78.9629], // Center of India
        zoom: 5,
        scrollWheelZoom: true,
        minZoom: 3,
        maxZoom: 12
      })

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      console.log('Map initialized successfully')
      
      // Add a test marker to verify map is working
      const testMarker = L.marker([23.5937, 78.9629])
        .bindPopup('Test: Map is working!')
        .addTo(mapRef.current)
      
      setTimeout(() => {
        testMarker.remove()
      }, 3000)
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

    console.log('Updating layers:', layers)
    console.log('Sample data:', { 
      plants: samplePlants.length, 
      pipelines: samplePipelines.length, 
      storage: sampleStorageSites.length, 
      demand: sampleDemandHubs.length, 
      renewables: sampleRenewables.length 
    })

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    polylinesRef.current.forEach(polyline => polyline.remove())
    circlesRef.current.forEach(circle => circle.remove())
    
    markersRef.current = []
    polylinesRef.current = []
    circlesRef.current = []

    // Add plants
    if (layers.plants) {
      console.log('Adding plants:', samplePlants)
      samplePlants.forEach((plant) => {
        console.log('Adding plant marker:', plant.name, plant.lat, plant.lng)
        const marker = L.marker([plant.lat, plant.lng], { icon: plantIcon })
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
      console.log('Adding pipelines:', samplePipelines)
      samplePipelines.forEach((pipeline) => {
        console.log('Adding pipeline:', pipeline.name, pipeline.coordinates)
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
        const marker = L.marker([site.lat, site.lng], { icon: storageIcon })
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
        const marker = L.marker([hub.lat, hub.lng], { icon: demandIcon })
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
        const marker = L.marker([renewable.lat, renewable.lng], { icon: renewableIcon })
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
    <div className="relative h-[70vh] w-full rounded-2xl border bg-gray-50">
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl" style={{ minHeight: '500px' }} />
      
      {/* Fallback if map doesn't load */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl" style={{ display: 'none' }}>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600 mb-2">Map Loading...</div>
          <div className="text-sm text-gray-500">Please wait while the map initializes</div>
        </div>
      </div>
      
      <div className="absolute left-3 top-3 z-[1000]">
        <LayersToggle layers={layers} onChange={setLayers} />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md border border-glass-border rounded-lg p-3 shadow-lg z-[1000]">
        <div className="text-xs font-semibold text-foreground mb-2">Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
            <span className="text-xs text-foreground">Plants</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 border border-white"></div>
            <span className="text-xs text-foreground">Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
            <span className="text-xs text-foreground">Demand Hubs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
            <span className="text-xs text-foreground">Renewables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span className="text-xs text-foreground">Pipelines</span>
          </div>
        </div>
      </div>
    </div>
  )
}
