export type PlantStatus = "Planned" | "Existing"

export interface Plant {
  id: string
  name: string
  lat: number
  lng: number
  capacityMW: number
  status: PlantStatus
  nearbyRenewables?: string
  state: string
}

export interface Pipeline {
  id: string
  name: string
  coordinates: [number, number][] // [lat, lng]
}

export interface StorageSite {
  id: string
  name: string
  lat: number
  lng: number
  capacityKtons: number
  state: string
}

export interface DemandHub {
  id: string
  name: string
  lat: number
  lng: number
  type: "Industry" | "Urban"
  state: string
}

export interface RenewableSite {
  id: string
  name: string
  lat: number
  lng: number
  type: "Wind" | "Solar"
  state: string
}

export interface StatsSummary {
  plants: number
  pipelines: number
  storageSites: number
  demandHubs: number
  renewables: number
}

export interface OptimizationParams {
  renewablesWeight: number
  demandDistanceWeight: number
  minimizeTransportCost: boolean
  applyRegulations: boolean
}

export interface Recommendation {
  id: string
  siteName: string
  score: number
  capacityMW: number
  estimatedCostUSDm: number
  demandCoveragePct: number
  lat: number
  lng: number
}

export interface OptimizationResult {
  recommendations: Recommendation[]
  highlightedZones: { id: string; lat: number; lng: number; radiusKm: number; color: string }[]
}
