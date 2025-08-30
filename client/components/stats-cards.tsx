"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import type { StatsSummary } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className="rounded-2xl border bg-card p-4 shadow-sm"
  >
    <div className="text-sm text-muted-foreground">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value}</div>
  </motion.div>
)

export function StatsCards() {
  const { data } = useSWR<StatsSummary>("/api/stats", fetcher)
  if (!data) return null
  return (
    <section aria-label="Quick Stats" className="grid grid-cols-2 gap-4 md:grid-cols-5">
      <StatCard label="Hydrogen Plants" value={data.plants} />
      <StatCard label="Pipelines" value={data.pipelines} />
      <StatCard label="Storage Sites" value={data.storageSites} />
      <StatCard label="Demand Hubs" value={data.demandHubs} />
      <StatCard label="Renewables" value={data.renewables} />
    </section>
  )
}
