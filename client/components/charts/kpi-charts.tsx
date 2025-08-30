"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const capacityByRegion = [
  { region: "North", capacity: 320 },
  { region: "West", capacity: 280 },
  { region: "East", capacity: 210 },
  { region: "South", capacity: 260 },
]

const plannedVsExisting = [
  { name: "Planned", value: 45 },
  { name: "Existing", value: 55 },
]

const demandTrend = [
  { month: "Jan", coverage: 22 },
  { month: "Feb", coverage: 25 },
  { month: "Mar", coverage: 28 },
  { month: "Apr", coverage: 30 },
  { month: "May", coverage: 35 },
  { month: "Jun", coverage: 38 },
]

const COLORS = ["#22c55e", "#0ea5e9"]

export function KPICharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border p-4">
        <h3 className="text-pretty text-base font-semibold">Capacity per Region</h3>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={capacityByRegion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="capacity" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-pretty text-base font-semibold">Planned vs Existing Plants</h3>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={plannedVsExisting} dataKey="value" nameKey="name" outerRadius={80} label>
                {plannedVsExisting.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border p-4 md:col-span-2">
        <h3 className="text-pretty text-base font-semibold">Demand Coverage Trend</h3>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={demandTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="coverage" stroke="#0ea5e9" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
