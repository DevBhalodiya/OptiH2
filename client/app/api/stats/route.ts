import { NextResponse } from "next/server"
import { sampleStats } from "@/lib/sample-data"

export async function GET() {
  return NextResponse.json(sampleStats)
}
