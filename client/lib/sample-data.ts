import type { Plant, Pipeline, StorageSite, DemandHub, RenewableSite, StatsSummary, OptimizationResult } from "./types"

export const samplePlants: Plant[] = [
  {
    id: "p1",
    name: "H2 Plant A",
    lat: 48.85,
    lng: 2.35,
    capacityMW: 200,
    status: "Planned",
    nearbyRenewables: "Wind (50km)",
  },
  {
    id: "p2",
    name: "H2 Plant B",
    lat: 51.5,
    lng: -0.12,
    capacityMW: 350,
    status: "Existing",
    nearbyRenewables: "Solar (30km)",
  },
]

export const samplePipelines: Pipeline[] = [
  {
    id: "pipe1",
    name: "Channel Connector",
    coordinates: [
      [51.5, -0.12],
      [50.9, 1.1],
      [49.9, 2.3],
      [48.85, 2.35],
    ],
  },
]

export const sampleStorageSites: StorageSite[] = [
  { id: "s1", name: "Storage North", lat: 52.0, lng: 0.1, capacityKtons: 120 },
  { id: "s2", name: "Storage West", lat: 48.9, lng: 2.0, capacityKtons: 80 },
]

export const sampleDemandHubs: DemandHub[] = [
  { id: "d1", name: "Industrial Hub A", lat: 51.0, lng: 0.0, type: "Industry" },
  { id: "d2", name: "Urban Center B", lat: 48.86, lng: 2.35, type: "Urban" },
]

export const sampleRenewables: RenewableSite[] = [
  { id: "r1", name: "Wind Farm X", lat: 50.0, lng: 1.0, type: "Wind" },
  { id: "r2", name: "Solar Park Y", lat: 51.2, lng: -0.2, type: "Solar" },
]

export const sampleStats: StatsSummary = {
  plants: 120,
  pipelines: 50,
  storageSites: 30,
  demandHubs: 75,
  renewables: 140,
}

export const mockOptimizationResult: OptimizationResult = {
  recommendations: [
    {
      id: "rec1",
      siteName: "Seine Delta Site",
      score: 92,
      capacityMW: 300,
      estimatedCostUSDm: 480,
      demandCoveragePct: 38,
      lat: 49.1,
      lng: 2.1,
    },
    {
      id: "rec2",
      siteName: "Channel Ridge",
      score: 89,
      capacityMW: 220,
      estimatedCostUSDm: 320,
      demandCoveragePct: 27,
      lat: 50.8,
      lng: 1.3,
    },
    {
      id: "rec3",
      siteName: "Thames East",
      score: 84,
      capacityMW: 260,
      estimatedCostUSDm: 410,
      demandCoveragePct: 31,
      lat: 51.55,
      lng: 0.2,
    },
    {
      id: "rec4",
      siteName: "North Fields",
      score: 81,
      capacityMW: 180,
      estimatedCostUSDm: 260,
      demandCoveragePct: 21,
      lat: 51.9,
      lng: -0.1,
    },
    {
      id: "rec5",
      siteName: "Paris Periphery",
      score: 79,
      capacityMW: 210,
      estimatedCostUSDm: 300,
      demandCoveragePct: 24,
      lat: 48.95,
      lng: 2.5,
    },
  ],
  highlightedZones: [
    { id: "zone1", lat: 49.1, lng: 2.1, radiusKm: 30, color: "#22c55e" },
    { id: "zone2", lat: 50.8, lng: 1.3, radiusKm: 25, color: "#0ea5e9" },
  ],
}
