const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export interface Plant {
  id: string
  name: string
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
  }
  properties: {
    capacity: number
    status: 'operational' | 'planned' | 'under_construction' | 'decommissioned'
    operationalType: 'production' | 'storage' | 'distribution' | 'hydrogen'
    state?: string
    country?: string
  }
  lastUpdated: string
}

export interface Pipeline {
  id: string
  name: string
  geometry: {
    type: 'LineString' | 'Point'
    coordinates: number[][] | [number, number]
  }
  properties: {
    length?: number
    capacity?: number
    status: 'operational' | 'planned' | 'under_construction' | 'decommissioned'
    material?: string
    diameter?: number
  }
  lastUpdated: string
}

export interface Renewable {
  id: string
  location: {
    latitude: number
    longitude: number
    state?: string
    country?: string
  }
  solar?: {
    suitabilityScore: number
    averageIrradiance: number
    peakSunHours: number
  }
  wind?: {
    suitabilityScore: number
    averageWindSpeed: number
    windPowerDensity: number
  }
  lastUpdated: string
}

export interface DemandCenter {
  id: string
  name: string
  location: {
    latitude: number
    longitude: number
    state?: string
    country?: string
  }
  population?: {
    total: number
    urban: number
    rural: number
  }
  industrialDemand?: number
  transportDemand?: number
  urbanPopulation?: {
    total: number
    density: number
  }
  lastUpdated: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface Stats {
  totalCount: number
  statusCounts: Record<string, number>
  capacityStats?: {
    total: number
    average: number
    max: number
    min: number
  }
}

// API utility functions
export const api = {
  // Plants API
  async getPlants(params?: {
    lat?: number
    lon?: number
    radius?: number
    type?: string
    status?: string
  }): Promise<ApiResponse<{ plants: Plant[]; stats: Stats }>> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const url = `${API_BASE_URL}/plants${searchParams.toString() ? `?${searchParams}` : ''}`
      console.log('Fetching plants from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Plants API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching plants:', error)
      throw error
    }
  },

  async getPlantStats(): Promise<ApiResponse<Stats>> {
    try {
      const url = `${API_BASE_URL}/plants/stats`
      console.log('Fetching plant stats from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Plant stats API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching plant stats:', error)
      throw error
    }
  },

  // Pipelines API
  async getPipelines(params?: {
    lat?: number
    lon?: number
    radius?: number
    minLength?: number
    maxLength?: number
    status?: string
  }): Promise<ApiResponse<{ pipelines: Pipeline[]; stats: Stats }>> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const url = `${API_BASE_URL}/pipelines${searchParams.toString() ? `?${searchParams}` : ''}`
      console.log('Fetching pipelines from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Pipelines API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching pipelines:', error)
      throw error
    }
  },

  // Renewables API
  async getRenewables(params?: {
    type?: 'solar' | 'wind'
    minScore?: number
    maxScore?: number
  }): Promise<ApiResponse<{ renewables: Renewable[]; stats: Stats }>> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const url = `${API_BASE_URL}/renewables${searchParams.toString() ? `?${searchParams}` : ''}`
      console.log('Fetching renewables from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Renewables API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching renewables:', error)
      throw error
    }
  },

  // Demand API
  async getDemandCenters(params?: {
    minPopulation?: number
    maxPopulation?: number
    country?: string
    demandType?: 'industrial' | 'transport' | 'urban'
  }): Promise<ApiResponse<{ demandCenters: DemandCenter[]; stats: Stats }>> {
    try {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      
      const url = `${API_BASE_URL}/demand${searchParams.toString() ? `?${searchParams}` : ''}`
      console.log('Fetching demand centers from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Demand centers API response:', data)
      return data
    } catch (error) {
      console.error('Error fetching demand centers:', error)
      throw error
    }
  },

  // Combined stats for dashboard
  async getAllStats(): Promise<{
    plants: Stats
    pipelines: Stats
    renewables: Stats
    demand: Stats
  }> {
    try {
      console.log('Fetching all stats...')
      
      const [plantsRes, pipelinesRes, renewablesRes, demandRes] = await Promise.allSettled([
        this.getPlantStats(),
        fetch(`${API_BASE_URL}/pipelines/stats`).then(r => r.json()),
        fetch(`${API_BASE_URL}/renewables/stats`).then(r => r.json()),
        fetch(`${API_BASE_URL}/demand/stats`).then(r => r.json())
      ])

      const result = {
        plants: plantsRes.status === 'fulfilled' ? plantsRes.value.data : { totalCount: 0, statusCounts: {} },
        pipelines: pipelinesRes.status === 'fulfilled' ? pipelinesRes.value.data : { totalCount: 0, statusCounts: {} },
        renewables: renewablesRes.status === 'fulfilled' ? renewablesRes.value.data : { totalCount: 0, statusCounts: {} },
        demand: demandRes.status === 'fulfilled' ? demandRes.value.data : { totalCount: 0, statusCounts: {} }
      }
      
      console.log('All stats result:', result)
      return result
    } catch (error) {
      console.error('Error fetching all stats:', error)
      throw error
    }
  }
}
