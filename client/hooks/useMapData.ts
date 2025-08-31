"use client"

import { useState, useEffect, useCallback } from 'react'
import { api, Plant, Pipeline, Renewable, DemandCenter, Stats } from '@/lib/api'
import { LayersState } from '@/components/map/layers-toggle'

export interface MapData {
  plants: Plant[]
  pipelines: Pipeline[]
  renewables: Renewable[]
  demandCenters: DemandCenter[]
}

export interface MapStats {
  plants: Stats
  pipelines: Stats
  renewables: Stats
  demand: Stats
}

export interface UseMapDataOptions {
  filters?: {
    selectedStates?: string[]
    searchTerm?: string
    statusFilter?: string
    typeFilter?: string
  }
  autoRefresh?: boolean
  refreshInterval?: number
  useRealData?: boolean // New option to use real data API
}

export interface UseMapDataReturn {
  data: MapData
  stats: MapStats | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  clearError: () => void
  realDataStatus: 'loading' | 'available' | 'error' | 'demo' // New status indicator
}

export function useMapData(
  layers: LayersState,
  options: UseMapDataOptions = {}
): UseMapDataReturn {
  const [data, setData] = useState<MapData>({
    plants: [],
    pipelines: [],
    renewables: [],
    demandCenters: []
  })
  
  const [stats, setStats] = useState<MapStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [realDataStatus, setRealDataStatus] = useState<'loading' | 'available' | 'error' | 'demo'>('loading')
  const [isFetching, setIsFetching] = useState(false) // Prevent multiple simultaneous fetches

  const { filters = {}, autoRefresh = false, refreshInterval = 30000, useRealData = true } = options

  // Fetch real data from optimize page API
  const fetchRealData = useCallback(async () => {
    if (!useRealData) return null
    
    try {
      console.log('Fetching real data from optimize page API...')
      setRealDataStatus('loading')
      
      const response = await fetch('/api/real-data', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      console.log('Real data response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch real data: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Real data result:', result)
      
      if (result.success && result.data) {
        console.log('Real data loaded successfully:', {
          plants: result.data.plants?.length || 0,
          pipelines: result.data.pipelines?.length || 0,
          renewables: result.data.renewables?.length || 0,
          demand: result.data.demand?.length || 0
        })
        setRealDataStatus('available')
        return result.data
      } else {
        console.log('Real data API returned error:', result)
        throw new Error(result.error || 'API returned error')
      }
    } catch (error) {
      console.error('Error fetching real data:', error)
      setRealDataStatus('error')
      return null
    }
  }, [useRealData])

  // Convert real data to map format
  const convertRealDataToMapFormat = useCallback((realData: any): MapData => {
    const convertedData: MapData = {
        plants: [],
        pipelines: [],
        renewables: [],
        demandCenters: []
      }

    // Convert plants
    if (realData.plants) {
      convertedData.plants = realData.plants.map((plant: any, index: number) => ({
        id: plant.id || `real_plant_${index}`,
        name: plant.name,
        geometry: {
          type: 'Point' as const,
          coordinates: [parseFloat(plant.longitude || '72.8777'), parseFloat(plant.latitude || '19.0760')]
        },
        properties: {
          capacity: parseFloat(plant.capacity?.replace(/\D/g, '') || '0'),
          status: plant.status || 'operational',
          operationalType: plant.type || 'production',
          state: plant.location?.split(', ')[1] || 'Maharashtra',
          country: 'India'
        },
        lastUpdated: new Date().toISOString()
      }))
    }

    // Convert pipelines
    if (realData.pipelines) {
      convertedData.pipelines = realData.pipelines.map((pipeline: any, index: number) => ({
        id: pipeline.id || `real_pipeline_${index}`,
        name: pipeline.name,
        geometry: {
          type: 'LineString' as const,
          coordinates: [
            [parseFloat(pipeline.startLng || '72.8777'), parseFloat(pipeline.startLat || '19.0760')],
            [parseFloat(pipeline.endLng || '73.8563'), parseFloat(pipeline.endLat || '18.5204')]
          ]
        },
        properties: {
          length: parseFloat(pipeline.length?.replace(/\D/g, '') || '0'),
          capacity: parseFloat(pipeline.capacity?.replace(/\D/g, '') || '0'),
          status: pipeline.status || 'operational',
          material: 'hydrogen',
          diameter: 0.5
        },
        lastUpdated: new Date().toISOString()
      }))
    }

    // Convert renewables
    if (realData.renewables) {
      convertedData.renewables = realData.renewables.map((renewable: any, index: number) => ({
        id: renewable.id || `real_renewable_${index}`,
        location: {
          latitude: parseFloat(renewable.latitude || '19.0760'),
          longitude: parseFloat(renewable.longitude || '72.8777'),
          state: renewable.location?.split(', ')[1] || 'Maharashtra',
          country: 'India'
        },
        solar: renewable.type === 'solar' ? {
          suitabilityScore: parseFloat(renewable.efficiency?.replace('%', '') || '85'),
          averageIrradiance: parseFloat(renewable.capacity?.replace(/\D/g, '') || '500'),
          peakSunHours: 5.5
        } : undefined,
        wind: renewable.type === 'wind' ? {
          suitabilityScore: parseFloat(renewable.efficiency?.replace('%', '') || '78'),
          averageWindSpeed: 6.5,
          windPowerDensity: 300
        } : undefined,
        lastUpdated: new Date().toISOString()
      }))
    }

    // Convert demand centers
    if (realData.demand) {
      convertedData.demandCenters = realData.demand.map((demand: any, index: number) => ({
        id: demand.id || `real_demand_${index}`,
        name: demand.name,
        location: {
          latitude: parseFloat(demand.latitude || '19.0760'),
          longitude: parseFloat(demand.longitude || '72.8777'),
          state: demand.location?.split(', ')[1] || 'Maharashtra',
          country: 'India'
        },
        population: {
          total: parseFloat(demand.population?.replace('M', '000000') || '20000000'),
          urban: parseFloat(demand.population?.replace('M', '000000') || '20000000') * 0.7,
          rural: parseFloat(demand.population?.replace('M', '000000') || '20000000') * 0.3
        },
        industrialDemand: parseFloat(demand.demand?.replace(/\D/g, '') || '5000'),
        transportDemand: parseFloat(demand.demand?.replace(/\D/g, '') || '5000') * 0.3,
        lastUpdated: new Date().toISOString()
      }))
    }

    return convertedData
  }, [])

  const fetchData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetching) {
      console.log('Fetch already in progress, skipping...')
      return
    }
    
    try {
      setIsFetching(true)
      setLoading(true)
      setError(null)
      console.log('Starting to fetch map data...', { useRealData, layers })

      // First try to get real data from optimize page API
      const realData = await fetchRealData()
      
      if (realData) {
        console.log('Using real data from optimize page API')
        const convertedData = convertRealDataToMapFormat(realData)
        console.log('Setting real data:', {
          plants: convertedData.plants.length,
          pipelines: convertedData.pipelines.length,
          renewables: convertedData.renewables.length,
          demandCenters: convertedData.demandCenters.length
        })
        setData(convertedData)
        
        // Generate stats from real data
        const realStats: MapStats = {
          plants: {
            totalCount: convertedData.plants.length,
            statusCounts: convertedData.plants.reduce((acc, plant) => {
              acc[plant.properties.status] = (acc[plant.properties.status] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          },
          pipelines: {
            totalCount: convertedData.pipelines.length,
            statusCounts: convertedData.pipelines.reduce((acc, pipeline) => {
              acc[pipeline.properties.status] = (acc[pipeline.properties.status] || 0) + 1
              return acc
            }, {} as Record<string, number>)
          },
          renewables: {
            totalCount: convertedData.renewables.length,
            statusCounts: { 'active': convertedData.renewables.length }
          },
          demand: {
            totalCount: convertedData.demandCenters.length,
            statusCounts: { 'active': convertedData.demandCenters.length }
          }
        }
        setStats(realStats)
        setRealDataStatus('available')
        setLoading(false)
        console.log('Real data set successfully, loading complete')
        return
      }

      // If real data failed, show error and keep loading state
      console.log('Real data not available, showing error state')
      setRealDataStatus('error')
      setError('Failed to load real data from external APIs')
      setLoading(false)
      return

      // Note: Removed backend fallback and demo data for production
      // Application now only uses real data from external APIs
      
      // If we reach here, it means real data failed and we don't have fallbacks
      console.log('No real data available, showing empty state')
      setData({
        plants: [],
        pipelines: [],
        renewables: [],
        demandCenters: []
      })
      setStats(null)
      setLoading(false)
      return

      // Note: Removed all backend API calls
      // Application now only uses real data from external APIs
      console.log('Real data only mode - no backend fallbacks')
    } catch (err) {
      console.error('Error fetching map data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch real data')
      setRealDataStatus('error')
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }, [layers, filters, fetchRealData, convertRealDataToMapFormat])

  const refreshData = useCallback(async () => {
    console.log('Manual refresh requested')
    // Force refresh by resetting real data status
    setRealDataStatus('loading')
    await fetchData()
  }, []) // Remove fetchData dependency to prevent loops

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial data fetch - always try to get real data first
  useEffect(() => {
    console.log('Initial data fetch triggered - attempting to get real data')
    fetchData()
  }, []) // Empty dependency array - only run once

  // Auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return

    console.log('Setting up auto-refresh interval')
    const interval = setInterval(() => {
      console.log('Auto-refresh triggered')
      fetchData()
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval]) // Remove fetchData dependency

  return {
    data,
    stats,
    loading,
    error,
    refreshData,
    clearError,
    realDataStatus
  }
}
