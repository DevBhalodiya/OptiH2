"use client"

import { 
  MapPin, 
  Zap, 
  Building2, 
  Target, 
  Leaf,
  Layers,
  ChevronDown
} from "lucide-react"
import { useState, useRef, useEffect } from "react"

export interface LayersState {
  plants: boolean
  pipelines: boolean
  storage: boolean
  demand: boolean
  renewables: boolean
}

interface LayersToggleProps {
  layers: LayersState
  onChange: (layers: LayersState) => void
}

export function LayersToggle({ layers, onChange }: LayersToggleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Handle layer toggle
  
  const layerConfig = {
    plants: { name: "Plants", icon: MapPin, color: "text-green-500" },
    pipelines: { name: "Pipelines", icon: Zap, color: "text-blue-500" },
    storage: { name: "Storage", icon: Building2, color: "text-purple-500" },
    demand: { name: "Demand", icon: Target, color: "text-orange-500" },
    renewables: { name: "Renewables", icon: Leaf, color: "text-emerald-500" }
  }

  const toggleLayer = (e: React.MouseEvent, key: keyof LayersState) => {
    e.stopPropagation()
    onChange({
      ...layers,
      [key]: !layers[key]
    })
  }

  const activeCount = Object.values(layers).filter(Boolean).length
  const totalCount = Object.keys(layers).length

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-3 py-2 bg-background/95 backdrop-blur-md border border-glass-border rounded-lg shadow-lg hover:bg-background/80 transition-all duration-200 min-w-32 relative z-[1001]"
      >
        <div className="w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center">
          <Layers className="w-3 h-3 text-primary" />
        </div>
        <span className="text-sm font-medium text-foreground">Layers</span>
        <div className="ml-auto">
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-background/95 backdrop-blur-md border border-glass-border rounded-xl p-3 shadow-xl min-w-64 z-[1002] transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-foreground">Map Layers</h3>
            <div className="text-xs text-muted-foreground">
              {activeCount}/{totalCount}
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(layerConfig).map(([key, config]) => {
              const isActive = layers[key as keyof LayersState]
              return (
                <button
                  key={key}
                  onClick={(e) => toggleLayer(e, key as keyof LayersState)}
                  className={`w-full group relative overflow-hidden rounded-lg p-2 transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/15 border border-primary/30' 
                      : 'bg-background/60 border border-transparent hover:bg-background/80 hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Checkbox */}
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground/40 group-hover:border-primary/50'
                    }`}>
                      {isActive && (
                        <svg className="w-2.5 h-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-primary/20' 
                        : 'bg-muted/40 group-hover:bg-primary/10'
                    }`}>
                      <config.icon className={`w-3 h-3 transition-all duration-200 ${
                        isActive ? 'text-primary' : config.color
                      }`} />
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs font-medium transition-all duration-200 ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`}>
                      {config.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 pt-2 border-t border-glass-border/50">
            <div className="flex gap-2">
              <button
                onClick={() => onChange({
                  plants: true,
                  pipelines: true,
                  storage: true,
                  demand: true,
                  renewables: true
                })}
                className="flex-1 px-2 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={() => onChange({
                  plants: false,
                  pipelines: false,
                  storage: false,
                  demand: false,
                  renewables: false
                })}
                className="flex-1 px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md hover:bg-muted/70 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
