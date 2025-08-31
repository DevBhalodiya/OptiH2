import { NextRequest, NextResponse } from 'next/server'

interface ForecastRequest {
  region: string
  forecastPeriod: string
  sector: string
  confidenceLevel: number
  includeFactors: boolean
}

interface DemandFactor {
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  description: string
}

interface ForecastResult {
  year: number
  industrial: number
  transportation: number
  energyStorage: number
  total: number
  confidence: number
  factors: DemandFactor[]
  regionalBreakdown?: Record<string, number>
}

export async function POST(request: NextRequest) {
  try {
    const body: ForecastRequest = await request.json()
    const { region, forecastPeriod, sector, confidenceLevel, includeFactors } = body

    // Validate input
    if (!region || !forecastPeriod || !sector) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Generate forecast based on parameters
    const forecastData = generateHydrogenDemandForecast(
      region,
      forecastPeriod,
      sector,
      confidenceLevel || 0.95
    )

    return NextResponse.json({
      success: true,
      data: forecastData,
      metadata: {
        generatedAt: new Date().toISOString(),
        parameters: body,
        model: 'OptiH2-Predictive-Analytics-v1.0'
      }
    })

  } catch (error) {
    console.error('Predictive analytics error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate forecast',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get('region') || 'all'
    const period = searchParams.get('period') || '2030'

    // Return sample data for demonstration
    const sampleData = getSampleForecastData(region, period)

    return NextResponse.json({
      success: true,
      data: sampleData,
      message: 'Sample forecast data retrieved successfully'
    })

  } catch (error) {
    console.error('Predictive analytics GET error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve forecast data' },
      { status: 500 }
    )
  }
}

function generateHydrogenDemandForecast(
  region: string,
  forecastPeriod: string,
  sector: string,
  confidenceLevel: number
): ForecastResult[] {
  const currentYear = new Date().getFullYear()
  const targetYear = parseInt(forecastPeriod)
  const years = []
  
  for (let year = currentYear; year <= targetYear; year++) {
    years.push(year)
  }

  return years.map(year => {
    const baseDemand = calculateBaseDemand(year, region, sector)
    const confidence = calculateConfidence(year, confidenceLevel)
    
    return {
      year,
      industrial: baseDemand.industrial * (1 + Math.random() * 0.1),
      transportation: baseDemand.transportation * (1 + Math.random() * 0.1),
      energyStorage: baseDemand.energyStorage * (1 + Math.random() * 0.1),
      total: 0, // Will be calculated
      confidence,
      factors: generateDemandFactors(year, region, sector)
    }
  }).map(item => ({
    ...item,
    total: item.industrial + item.transportation + item.energyStorage
  }))
}

function calculateBaseDemand(year: number, region: string, sector: string) {
  const baseYear = 2024
  const growthRate = 0.35 // 35% annual growth based on National Hydrogen Mission
  
  const multiplier = Math.pow(1 + growthRate, year - baseYear)
  
  let baseDemand = {
    industrial: 0.8,
    transportation: 0.2,
    energyStorage: 0.1
  }

  // Adjust based on region
  if (region === 'western') {
    baseDemand.industrial *= 1.2
    baseDemand.transportation *= 1.1
  } else if (region === 'southern') {
    baseDemand.transportation *= 1.3
    baseDemand.energyStorage *= 1.2
  } else if (region === 'northern') {
    baseDemand.industrial *= 1.4
  } else if (region === 'eastern') {
    baseDemand.industrial *= 1.1
    baseDemand.energyStorage *= 1.1
  }

  // Adjust based on sector focus
  if (sector === 'industrial') {
    baseDemand.industrial *= 1.5
  } else if (sector === 'transportation') {
    baseDemand.transportation *= 1.5
  } else if (sector === 'energyStorage') {
    baseDemand.energyStorage *= 1.5
  }

  return {
    industrial: baseDemand.industrial * multiplier,
    transportation: baseDemand.transportation * multiplier,
    energyStorage: baseDemand.energyStorage * multiplier
  }
}

function calculateConfidence(year: number, baseConfidence: number): number {
  // Confidence decreases as we predict further into the future
  const currentYear = new Date().getFullYear()
  const yearsAhead = year - currentYear
  
  const confidenceDecay = yearsAhead * 0.03 // 3% decrease per year
  return Math.max(baseConfidence - confidenceDecay, 0.5)
}

function generateDemandFactors(year: number, region: string, sector: string): DemandFactor[] {
  const factors: DemandFactor[] = [
    {
      name: 'National Hydrogen Mission',
      impact: 'positive',
      weight: 0.9,
      description: 'Government policy driving hydrogen adoption'
    },
    {
      name: 'Renewable Energy Growth',
      impact: 'positive',
      weight: 0.8,
      description: 'Increasing renewable energy capacity enabling green hydrogen'
    },
    {
      name: 'Technology Maturity',
      impact: 'positive',
      weight: 0.7,
      description: 'Improving electrolyzer efficiency and cost reduction'
    }
  ]

  // Add region-specific factors
  if (region === 'western') {
    factors.push({
      name: 'Port Infrastructure',
      impact: 'positive',
      weight: 0.6,
      description: 'Strategic port locations for hydrogen export'
    })
  } else if (region === 'southern') {
    factors.push({
      name: 'Automotive Manufacturing',
      impact: 'positive',
      weight: 0.7,
      description: 'Strong automotive sector driving hydrogen adoption'
    })
  }

  // Add sector-specific factors
  if (sector === 'industrial') {
    factors.push({
      name: 'Industrial Decarbonization',
      impact: 'positive',
      weight: 0.8,
      description: 'Pressure to reduce industrial carbon emissions'
    })
  } else if (sector === 'transportation') {
    factors.push({
      name: 'EV Infrastructure',
      impact: 'positive',
      weight: 0.6,
      description: 'Growing electric vehicle infrastructure supporting hydrogen'
    })
  }

  return factors
}

function getSampleForecastData(region: string, period: string): ForecastResult[] {
  const currentYear = new Date().getFullYear()
  const targetYear = parseInt(period)
  const years = []
  
  for (let year = currentYear; year <= targetYear; year++) {
    years.push(year)
  }

  return years.map(year => {
    const baseDemand = calculateBaseDemand(year, region, 'all')
    const confidence = calculateConfidence(year, 0.95)
    
    return {
      year,
      industrial: baseDemand.industrial,
      transportation: baseDemand.transportation,
      energyStorage: baseDemand.energyStorage,
      total: baseDemand.industrial + baseDemand.transportation + baseDemand.energyStorage,
      confidence,
      factors: generateDemandFactors(year, region, 'all')
    }
  })
}
