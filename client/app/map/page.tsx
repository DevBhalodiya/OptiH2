"use client"

import { Navbar } from "@/components/navbar"
import { MapView } from "@/components/map/map-view"
import { LayersToggle, type LayersState } from "@/components/map/layers-toggle"
import { 
  MapPin, 
  Zap, 
  Leaf, 
  Wind, 
  Sun, 
  Droplets, 
  Activity,
  Filter,
  Search,
  Layers,
  Info
} from "lucide-react"
import { useState } from "react"

export default function MapPage() {
  // State for map layers
  const [layers, setLayers] = useState<LayersState>({
    plants: true,
    pipelines: true,
    storage: true,
    demand: true,
    renewables: true
  })

  // Mock data for map filters
  const plantTypes = [
    { id: 'solar', name: 'Solar Power', icon: Sun, count: 12, color: 'text-yellow-500' },
    { id: 'wind', name: 'Wind Power', icon: Wind, count: 8, color: 'text-blue-500' },
    { id: 'hydro', name: 'Hydroelectric', icon: Droplets, count: 6, color: 'text-cyan-500' },
    { id: 'hybrid', name: 'Hybrid Systems', icon: Zap, count: 15, color: 'text-purple-500' }
  ]

  const statusFilters = [
    { id: 'active', name: 'Active', count: 28, color: 'text-green-500' },
    { id: 'maintenance', name: 'Maintenance', count: 3, color: 'text-yellow-500' },
    { id: 'planned', name: 'Planned', count: 7, color: 'text-blue-500' },
    { id: 'offline', name: 'Offline', count: 2, color: 'text-red-500' }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Infrastructure <span className="gradient-text">Map</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Visualize hydrogen infrastructure locations, status, and performance across the network
            </p>
          </div>

          {/* Map Controls */}
          <div className="glass-card p-6 rounded-2xl mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search and Filters */}
              <div className="flex-1 space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search plants, locations, or coordinates..."
                      className="w-full pl-10 pr-4 py-3 bg-background/50 border border-glass-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <button className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>
                </div>

                {/* Plant Type Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Plant Types
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {plantTypes.map((type) => (
                      <button
                        key={type.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30 transition-all text-sm"
                      >
                        <type.icon className={`w-4 h-4 ${type.color}`} />
                        <span>{type.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">{type.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filters */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Status
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {statusFilters.map((status) => (
                      <button
                        key={status.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50 border border-glass-border hover:bg-primary/10 hover:border-primary/30 transition-all text-sm"
                      >
                        <div className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')}`} />
                        <span>{status.name}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded-full">{status.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="lg:w-80 space-y-4">
                <div className="glass-card p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="text-lg font-semibold mb-2">Network Overview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Plants:</span>
                      <span className="font-semibold">41</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Capacity:</span>
                      <span className="font-semibold">2.4 GW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coverage Area:</span>
                      <span className="font-semibold">12 States</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Green Valley H2 commissioned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>Coastal Hub optimization complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span>Desert Station maintenance alert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Interactive Map</h2>
              <div className="flex items-center gap-2">
                <LayersToggle layers={layers} onChange={setLayers} />
                <button className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Legend
                </button>
              </div>
            </div>
            
            <div className="relative">
              <MapView />
              
              {/* Map Overlay Info */}
              <div className="absolute top-4 left-4 glass-card p-4 rounded-xl max-w-xs">
                <h4 className="font-semibold mb-2">Map Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Active Plants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Planned</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Offline</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 text-center">
            <div className="inline-flex gap-4">
              <a
                href="/optimize"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Zap className="w-4 h-4" />
                Run Network Optimization
              </a>
              <a
                href="/reports"
                className="glass-button px-6 py-3 rounded-xl text-sm font-medium inline-flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Info className="w-4 h-4" />
                Generate Map Report
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
