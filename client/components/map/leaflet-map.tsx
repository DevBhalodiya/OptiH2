"use client"

import "leaflet/dist/leaflet.css"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import { LayersToggle, type LayersState } from "./layers-toggle"
import { type MapData } from "@/hooks/useMapData"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Custom icons for different infrastructure types
const createCustomIcon = (color: string, size: number = 12) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  })
}

// Status-based colors
const statusColors = {
  operational: '#22c55e',
  planned: '#3b82f6',
  under_construction: '#f59e0b',
  decommissioned: '#ef4444'
}

// Type-based colors
const typeColors = {
  production: '#22c55e',
  storage: '#8b5cf6',
  distribution: '#f97316',
  hydrogen: '#10b981'
}

export function LeafletMap({ 
  showZones = false, 
  selectedStates = [],
  layers: externalLayers,
  onLayersChange,
  mapData,
  loading = false
}: { 
  showZones?: boolean
  selectedStates?: string[]
  layers?: LayersState
  onLayersChange?: (layers: LayersState) => void
  mapData?: MapData
  loading?: boolean
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const polylinesRef = useRef<L.Polyline[]>([])
  const circlesRef = useRef<L.Circle[]>([])
  
  const [internalLayers, setInternalLayers] = useState<LayersState>({
    plants: true,
    pipelines: true,
    storage: true,
    demand: true,
    renewables: true,
  })
  
  // Use external layers if provided, otherwise use internal state
  const layers = externalLayers || internalLayers
  const setLayers = onLayersChange || setInternalLayers

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) {
      console.log('Map container ref not available')
      return
    }

    // Create map instance only if it doesn't exist
    if (!mapRef.current) {
      try {
        console.log('Creating new map instance')
        mapRef.current = L.map(mapContainerRef.current, {
          center: [23.5937, 78.9629], // Center of India
          zoom: 5,
          scrollWheelZoom: true,
          minZoom: 4, // Prevent zooming out too far
          maxZoom: 12,
          maxBounds: [
            [5.0, 65.0], // Southwest bounds of India
            [38.0, 100.0]  // Northeast bounds of India
          ],
          maxBoundsViscosity: 1.0 // Strict bounds - cannot pan outside India
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '',
        }).addTo(mapRef.current)
        
        console.log('Map initialized successfully')
      } catch (error) {
        console.error('Error initializing map:', error)
        mapRef.current = null
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        try {
          console.log('Cleaning up map')
          // Clear all markers, polylines, and circles
          markersRef.current.forEach(marker => {
            try {
              marker.remove()
            } catch (e) {
              console.warn('Error removing marker during cleanup:', e)
            }
          })
          polylinesRef.current.forEach(polyline => {
            try {
              polyline.remove()
            } catch (e) {
              console.warn('Error removing polyline during cleanup:', e)
            }
          })
          circlesRef.current.forEach(circle => {
            try {
              circle.remove()
            } catch (e) {
              console.warn('Error removing circle during cleanup:', e)
            }
          })
          
          markersRef.current = []
          polylinesRef.current = []
          circlesRef.current = []
          
          // Remove map instance
          mapRef.current.remove()
          mapRef.current = null
          console.log('Map cleanup completed')
        } catch (error) {
          console.error('Error during map cleanup:', error)
        }
      }
    }
  }, [])

  // Update layers when layer state or data changes
  useEffect(() => {
    console.log('Map data changed:', {
      hasMapData: !!mapData,
      plantsCount: mapData?.plants?.length || 0,
      pipelinesCount: mapData?.pipelines?.length || 0,
      renewablesCount: mapData?.renewables?.length || 0,
      demandCount: mapData?.demandCenters?.length || 0,
      loading
    })
    
    // Add a small delay to ensure map is fully initialized
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.log('Map ref not available:', { 
          mapRef: !!mapRef.current, 
          mapContainer: !!mapContainerRef.current 
        })
        return
      }

      if (!mapData) {
        console.log('Map data not available yet')
        return
      }

      console.log('Updating map layers with data:', {
        plants: mapData.plants?.length || 0,
        pipelines: mapData.pipelines?.length || 0,
        renewables: mapData.renewables?.length || 0,
        demandCenters: mapData.demandCenters?.length || 0,
        loading
      })

      // Clear existing markers
      markersRef.current.forEach(marker => {
        try {
          marker.remove()
        } catch (e) {
          console.warn('Error removing marker:', e)
        }
      })
      polylinesRef.current.forEach(polyline => {
        try {
          polyline.remove()
        } catch (e) {
          console.warn('Error removing polyline:', e)
        }
      })
      circlesRef.current.forEach(circle => {
        try {
          circle.remove()
        } catch (e) {
          console.warn('Error removing circle:', e)
        }
      })
      
      markersRef.current = []
      polylinesRef.current = []
      circlesRef.current = []

      // Helper function to filter by selected states
      const filterByState = (state?: string) => {
        if (selectedStates.length === 0) return true
        return selectedStates.includes(state || '')
      }

      // Add plants
      if (layers.plants && mapRef.current) {
        console.log('Adding plants:', mapData.plants.length)
        mapData.plants
          .filter(plant => filterByState(plant.properties.state))
          .forEach((plant) => {
            try {
              const [lng, lat] = plant.geometry.coordinates
              if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.warn('Invalid coordinates for plant:', plant)
                return
              }
              
              const color = statusColors[plant.properties.status] || statusColors.operational
              const icon = createCustomIcon(color, 14)
              
              const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                  <div>
                    <div style="font-weight: 600; margin-bottom: 8px">${plant.name}</div>
                    <div style="margin-bottom: 4px"><strong>Type:</strong> ${plant.properties.operationalType}</div>
                    <div style="margin-bottom: 4px"><strong>Status:</strong> ${plant.properties.status}</div>
                    <div style="margin-bottom: 4px"><strong>Capacity:</strong> ${plant.properties.capacity || 'N/A'} MW</div>
                    <div style="margin-bottom: 4px"><strong>State:</strong> ${plant.properties.state || 'N/A'}</div>
                    <div style="color: #666; font-size: 12px">Updated: ${new Date(plant.lastUpdated).toLocaleDateString()}</div>
                  </div>
                `)
                
              if (mapRef.current) {
                marker.addTo(mapRef.current)
                markersRef.current.push(marker)
              }
            } catch (error) {
              console.error('Error adding plant marker:', error, plant)
            }
          })
      }

      // Add pipelines
      if (layers.pipelines && mapRef.current) {
        console.log('Adding pipelines:', mapData.pipelines.length)
        mapData.pipelines.forEach((pipeline) => {
          try {
            if (pipeline.geometry.type === 'LineString') {
              const coordinates = (pipeline.geometry.coordinates as number[][]).map(coord => [coord[1], coord[0]] as L.LatLngExpression)
              const color = statusColors[pipeline.properties.status] || '#0ea5e9'
              
              const polyline = L.polyline(coordinates, {
                color,
                weight: 3,
                opacity: 0.8
              })
              .bindPopup(`
                <div>
                  <div style="font-weight: 600; margin-bottom: 8px">${pipeline.name}</div>
                  <div style="margin-bottom: 4px"><strong>Status:</strong> ${pipeline.properties.status}</div>
                  <div style="margin-bottom: 4px"><strong>Length:</strong> ${pipeline.properties.length || 'N/A'} km</div>
                  <div style="margin-bottom: 4px"><strong>Capacity:</strong> ${pipeline.properties.capacity || 'N/A'} m³/h</div>
                  <div style="color: #666; font-size: 12px">Updated: ${new Date(pipeline.lastUpdated).toLocaleDateString()}</div>
                </div>
              `)
              
              if (mapRef.current) {
                polyline.addTo(mapRef.current)
                polylinesRef.current.push(polyline)
              }
            } else if (pipeline.geometry.type === 'Point') {
              const [lng, lat] = pipeline.geometry.coordinates as [number, number]
              if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.warn('Invalid coordinates for pipeline:', pipeline)
                return
              }
              
              const color = statusColors[pipeline.properties.status] || '#0ea5e9'
              const icon = createCustomIcon(color, 10)
              
              const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                  <div>
                    <div style="font-weight: 600; margin-bottom: 8px">${pipeline.name}</div>
                    <div style="margin-bottom: 4px"><strong>Status:</strong> ${pipeline.properties.status}</div>
                    <div style="margin-bottom: 4px"><strong>Type:</strong> Pipeline Node</div>
                    <div style="color: #666; font-size: 12px">Updated: ${new Date(pipeline.lastUpdated).toLocaleDateString()}</div>
                  </div>
                `)
                
              if (mapRef.current) {
                marker.addTo(mapRef.current)
                markersRef.current.push(marker)
              }
            }
          } catch (error) {
            console.error('Error adding pipeline:', error, pipeline)
          }
        })
      }

      // Add demand centers
      if (layers.demand && mapRef.current) {
        console.log('Adding demand centers:', mapData.demandCenters.length)
        mapData.demandCenters
          .filter(center => filterByState(center.location.state))
          .forEach((center) => {
            try {
              const { latitude: lat, longitude: lng } = center.location
              if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.warn('Invalid coordinates for demand center:', center)
                return
              }
              
              const icon = createCustomIcon('#f97316', 12) // Orange for demand
              
              const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                  <div>
                    <div style="font-weight: 600; margin-bottom: 8px">${center.name}</div>
                    <div style="margin-bottom: 4px"><strong>Population:</strong> ${center.population?.total?.toLocaleString() || 'N/A'}</div>
                    <div style="margin-bottom: 4px"><strong>Industrial Demand:</strong> ${center.industrialDemand || 'N/A'}</div>
                    <div style="margin-bottom: 4px"><strong>Transport Demand:</strong> ${center.transportDemand || 'N/A'}</div>
                    <div style="margin-bottom: 4px"><strong>State:</strong> ${center.location.state || 'N/A'}</div>
                    <div style="color: #666; font-size: 12px">Updated: ${new Date(center.lastUpdated).toLocaleDateString()}</div>
                  </div>
                `)
                
              if (mapRef.current) {
                marker.addTo(mapRef.current)
                markersRef.current.push(marker)
              }
            } catch (error) {
              console.error('Error adding demand center marker:', error, center)
            }
          })
      }

      // Add renewables
      if (layers.renewables && mapRef.current) {
        console.log('Adding renewables:', mapData.renewables.length)
        mapData.renewables
          .filter(renewable => filterByState(renewable.location.state))
          .forEach((renewable) => {
            try {
              const { latitude: lat, longitude: lng } = renewable.location
              if (typeof lat !== 'number' || typeof lng !== 'number') {
                console.warn('Invalid coordinates for renewable site:', renewable)
                return
              }
              
              const icon = createCustomIcon('#10b981', 10) // Emerald for renewables
              
              const solarScore = renewable.solar?.suitabilityScore || 0
              const windScore = renewable.wind?.suitabilityScore || 0
              const bestResource = solarScore > windScore ? 'Solar' : 'Wind'
              const bestScore = Math.max(solarScore, windScore)
              
              const marker = L.marker([lat, lng], { icon })
                .bindPopup(`
                  <div>
                    <div style="font-weight: 600; margin-bottom: 8px">Renewable Resource Site</div>
                    <div style="margin-bottom: 4px"><strong>Best Resource:</strong> ${bestResource}</div>
                    <div style="margin-bottom: 4px"><strong>Suitability Score:</strong> ${bestScore.toFixed(1)}/100</div>
                    ${renewable.solar ? `<div style="margin-bottom: 4px"><strong>Solar Score:</strong> ${renewable.solar.suitabilityScore.toFixed(1)}</div>` : ''}
                    ${renewable.wind ? `<div style="margin-bottom: 4px"><strong>Wind Score:</strong> ${renewable.wind.suitabilityScore.toFixed(1)}</div>` : ''}
                    <div style="margin-bottom: 4px"><strong>State:</strong> ${renewable.location.state || 'N/A'}</div>
                    <div style="color: #666; font-size: 12px">Updated: ${new Date(renewable.lastUpdated).toLocaleDateString()}</div>
                  </div>
                `)
                
              if (mapRef.current) {
                marker.addTo(mapRef.current)
                markersRef.current.push(marker)
              }
            } catch (error) {
              console.error('Error adding renewable marker:', error, renewable)
            }
          })
      }

      // Add optimization zones (if still needed)
      if (showZones) {
        // This would be implemented based on your optimization results
        // For now, we'll skip this as it depends on the optimization API
      }
    }, 100) // Small delay to ensure map is ready

    return () => clearTimeout(timer)
  }, [layers, selectedStates, mapData, showZones])

  return (
    <div className="relative h-[70vh] w-full rounded-2xl border bg-gray-50">
      <div ref={mapContainerRef} className="h-full w-full rounded-2xl" style={{ minHeight: '500px' }} />
      
      {/* Loading indicator - only show when no data is available */}
      {loading && (!mapData || (mapData.plants.length === 0 && mapData.pipelines.length === 0 && mapData.renewables.length === 0 && mapData.demandCenters.length === 0)) && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-[1000]">
          <div className="text-muted-foreground">Loading map data...</div>
        </div>
      )}
      
      {/* Legend and Layers Controls */}
      <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md border border-glass-border rounded-lg p-3 shadow-lg z-[1000]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-foreground">Legend</div>
          <LayersToggle layers={layers} onChange={setLayers} />
        </div>
        <div className="space-y-1">
          {layers.plants && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
              <span className="text-xs text-foreground">Plants ({mapData?.plants.length || 0})</span>
            </div>
          )}
          {layers.pipelines && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500"></div>
              <span className="text-xs text-foreground">Pipelines ({mapData?.pipelines.length || 0})</span>
            </div>
          )}
          {layers.demand && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
              <span className="text-xs text-foreground">Demand ({mapData?.demandCenters.length || 0})</span>
            </div>
          )}
          {layers.renewables && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div>
              <span className="text-xs text-foreground">Renewables ({mapData?.renewables.length || 0})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
