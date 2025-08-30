import { NextResponse } from "next/server"
import { mockOptimizationResult } from "@/lib/sample-data"
import type { OptimizationParams } from "@/lib/types"

let lastRun = mockOptimizationResult

export async function GET() {
  return NextResponse.json(lastRun)
}

export async function POST(req: Request) {
  const body = (await req.json()) as OptimizationParams
  const bonus = Math.round((body.renewablesWeight - body.demandDistanceWeight) / 10)
  lastRun = {
    ...mockOptimizationResult,
    recommendations: mockOptimizationResult.recommendations.map((r, i) => ({
      ...r,
      score: Math.max(0, r.score + (i === 0 ? bonus : 0)),
    })),
  }
  return NextResponse.json(lastRun)
}
