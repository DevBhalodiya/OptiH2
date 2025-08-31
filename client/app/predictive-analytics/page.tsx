"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navbar } from '@/components/navbar'
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Factory, 
  Truck, 
  Zap, 
  BarChart3, 
  LineChart,
  Download,
  RefreshCw,
  Settings,
  Target
} from 'lucide-react'

interface DemandForecast {
  year: number
  industrial: number
  transportation: number
  energyStorage: number
  total: number
  confidence: number
}

interface RegionalDemand {
  region: string
  currentDemand: number
  predictedDemand: number
  growthRate: number
  keyDrivers: string[]
}

export default function PredictiveAnalyticsPage() {
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [forecastPeriod, setForecastPeriod] = useState('2030')
  const [selectedSector, setSelectedSector] = useState('all')
  const [confidenceLevel, setConfidenceLevel] = useState(0.95)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [demandData, setDemandData] = useState<DemandForecast[]>([])
  const [regionalData, setRegionalData] = useState<RegionalDemand[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load initial data when component mounts
  useEffect(() => {
    loadInitialData()
  }, [])

  // Load data when parameters change
  useEffect(() => {
    if (demandData.length > 0) {
      loadData()
    }
  }, [selectedRegion, forecastPeriod, selectedSector, confidenceLevel])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/predictive-analytics?region=all&period=2030')
      if (!response.ok) {
        throw new Error('Failed to load initial data')
      }
      
      const result = await response.json()
      if (result.success) {
        setDemandData(result.data)
        setRegionalData(generateRegionalData(result.data))
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to load data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
      // Fallback to sample data
      loadSampleData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadData = async () => {
    try {
      setError(null)
      
      const response = await fetch('/api/predictive-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          region: selectedRegion,
          forecastPeriod,
          sector: selectedSector,
          confidenceLevel,
          includeFactors: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate forecast')
      }

      const result = await response.json()
      if (result.success) {
        setDemandData(result.data)
        setRegionalData(generateRegionalData(result.data))
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to generate forecast')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate forecast')
    }
  }

  const loadSampleData = () => {
    // Fallback sample data
    const sampleDemandData: DemandForecast[] = [
      { year: 2024, industrial: 0.8, transportation: 0.2, energyStorage: 0.1, total: 1.1, confidence: 0.95 },
      { year: 2025, industrial: 1.2, transportation: 0.4, energyStorage: 0.2, total: 1.8, confidence: 0.92 },
      { year: 2026, industrial: 1.8, transportation: 0.7, energyStorage: 0.3, total: 2.8, confidence: 0.89 },
      { year: 2027, industrial: 2.5, transportation: 1.1, energyStorage: 0.5, total: 4.1, confidence: 0.86 },
      { year: 2028, industrial: 3.2, transportation: 1.6, energyStorage: 0.8, total: 5.6, confidence: 0.83 },
      { year: 2029, industrial: 3.8, transportation: 2.2, energyStorage: 1.2, total: 7.2, confidence: 0.80 },
      { year: 2030, industrial: 4.2, transportation: 2.8, energyStorage: 1.6, total: 8.6, confidence: 0.77 }
    ]

    const sampleRegionalData: RegionalDemand[] = [
      {
        region: 'Western India',
        currentDemand: 0.4,
        predictedDemand: 2.1,
        growthRate: 425,
        keyDrivers: ['Petrochemical hubs', 'Port infrastructure', 'Renewable energy']
      },
      {
        region: 'Southern India',
        currentDemand: 0.3,
        predictedDemand: 1.8,
        growthRate: 500,
        keyDrivers: ['Automotive manufacturing', 'IT parks', 'Port cities']
      },
      {
        region: 'Northern India',
        currentDemand: 0.2,
        predictedDemand: 1.5,
        growthRate: 650,
        keyDrivers: ['Steel industry', 'Transportation corridors', 'Industrial clusters']
      },
      {
        region: 'Eastern India',
        currentDemand: 0.1,
        predictedDemand: 1.2,
        growthRate: 1100,
        keyDrivers: ['Mining operations', 'Heavy industries', 'Port development']
      }
    ]

    setDemandData(sampleDemandData)
    setRegionalData(sampleRegionalData)
  }

  const generateRegionalData = (demandData: DemandForecast[]): RegionalDemand[] => {
    if (demandData.length === 0) return []

    const currentYear = new Date().getFullYear()
    const currentData = demandData.find(d => d.year === currentYear) || demandData[0]
    const futureData = demandData[demandData.length - 1]

    const regions = [
      {
        name: 'Western India',
        currentMultiplier: 0.4,
        futureMultiplier: 0.25,
        keyDrivers: ['Petrochemical hubs', 'Port infrastructure', 'Renewable energy', 'Export facilities']
      },
      {
        name: 'Southern India',
        currentMultiplier: 0.3,
        futureMultiplier: 0.21,
        keyDrivers: ['Automotive manufacturing', 'IT parks', 'Port cities', 'Technology hubs']
      },
      {
        name: 'Northern India',
        currentMultiplier: 0.2,
        futureMultiplier: 0.17,
        keyDrivers: ['Steel industry', 'Transportation corridors', 'Industrial clusters', 'Manufacturing']
      },
      {
        name: 'Eastern India',
        currentMultiplier: 0.1,
        futureMultiplier: 0.14,
        keyDrivers: ['Mining operations', 'Heavy industries', 'Port development', 'Resource extraction']
      }
    ]

    return regions.map(region => {
      const currentDemand = currentData.total * region.currentMultiplier
      const predictedDemand = futureData.total * region.futureMultiplier
      const growthRate = ((predictedDemand - currentDemand) / currentDemand) * 100

      return {
        region: region.name,
        currentDemand: parseFloat(currentDemand.toFixed(2)),
        predictedDemand: parseFloat(predictedDemand.toFixed(2)),
        growthRate: Math.round(growthRate),
        keyDrivers: region.keyDrivers
      }
    })
  }

  const handleGenerateForecast = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate forecast')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportData = () => {
    // Export functionality
    const dataStr = JSON.stringify(demandData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'hydrogen-demand-forecast.json'
    link.click()
  }

  const getTotalDemand = () => {
    return demandData.reduce((sum, item) => sum + item.total, 0)
  }

  const getAverageGrowthRate = () => {
    if (demandData.length < 2) return 0
    const firstYear = demandData[0].total
    const lastYear = demandData[demandData.length - 1].total
    return ((lastYear - firstYear) / firstYear) * 100
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                Predictive Analytics for Hydrogen Demand
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                AI-powered forecasting and demand prediction for India's hydrogen infrastructure
              </p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button onClick={loadInitialData} variant="outline" disabled={isLoading}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExportData} variant="outline" disabled={isLoading}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button onClick={handleGenerateForecast} disabled={isGenerating || isLoading}>
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Forecast'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-blue-800 dark:text-blue-200">Loading data...</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Region
              </label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All India</SelectItem>
                  <SelectItem value="western">Western India</SelectItem>
                  <SelectItem value="southern">Southern India</SelectItem>
                  <SelectItem value="northern">Northern India</SelectItem>
                  <SelectItem value="eastern">Eastern India</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Forecast Period
              </label>
              <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                  <SelectItem value="2035">2035</SelectItem>
                  <SelectItem value="2040">2040</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sector Focus
              </label>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="energyStorage">Energy Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confidence Level
              </label>
              <Input 
                type="number" 
                placeholder="0.95" 
                className="w-full"
                min="0.5"
                max="1.0"
                step="0.05"
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseFloat(e.target.value) || 0.95)}
              />
            </div>
          </div>
        </div>

        {/* Data Source Indicator */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${error ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {error ? 'Using fallback data' : 'Connected to AI prediction engine'}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Model: OptiH2-Predictive-Analytics-v1.0
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Total Demand (2030)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{getTotalDemand().toFixed(1)} MMT</div>
              <p className="text-blue-100 text-sm mt-1">
                {getAverageGrowthRate().toFixed(1)}% annual growth
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Factory className="w-5 h-5" />
                Industrial Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4.2 MMT</div>
              <p className="text-green-100 text-sm mt-1">
                48.8% of total demand
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2.8 MMT</div>
              <p className="text-purple-100 text-sm mt-1">
                32.6% of total demand
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Energy Storage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1.6 MMT</div>
              <p className="text-orange-100 text-sm mt-1">
                18.6% of total demand
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Demand Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                Demand Forecast (2024-2030)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demandData.map((item) => (
                  <div key={item.year} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.year}</span>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.total.toFixed(1)} MMT</div>
                        <div className="text-xs text-gray-500">
                          Confidence: {(item.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(item.total / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Regional Demand Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalData.map((region) => (
                  <div key={region.region} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{region.region}</span>
                      <span className="text-sm text-gray-500">
                        +{region.growthRate}% growth
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Current: </span>
                        <span className="font-medium">{region.currentDemand} MMT</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">2030: </span>
                        <span className="font-medium">{region.predictedDemand} MMT</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {region.keyDrivers.map((driver, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Advanced Analytics & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Market Drivers</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• National Hydrogen Mission targets</li>
                  <li>• Renewable energy integration</li>
                  <li>• Industrial decarbonization</li>
                  <li>• Transportation electrification</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Risk Factors</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Technology adoption delays</li>
                  <li>• Infrastructure bottlenecks</li>
                  <li>• Policy uncertainty</li>
                  <li>• Investment constraints</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Opportunities</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Export potential to Asia</li>
                  <li>• Technology leadership</li>
                  <li>• Job creation</li>
                  <li>• Energy security</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}
