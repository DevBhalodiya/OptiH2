import { NextResponse } from "next/server"

export async function GET() {
  return new NextResponse(JSON.stringify({ message: "PDF generation not implemented. Connect backend here." }), {
    status: 501,
    headers: { "Content-Type": "application/json" },
  })
}
