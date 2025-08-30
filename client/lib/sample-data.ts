import type { Plant, Pipeline, StorageSite, DemandHub, RenewableSite, StatsSummary, OptimizationResult } from "./types"

export const samplePlants: Plant[] = [
  {
    id: "p1",
    name: "Gujarat H2 Plant",
    lat: 22.2587,
    lng: 71.1924,
    capacityMW: 200,
    status: "Planned",
    nearbyRenewables: "Solar (50km)",
    state: "Gujarat",
  },
  {
    id: "p2",
    name: "Rajasthan H2 Facility",
    lat: 26.9124,
    lng: 70.9122,
    capacityMW: 350,
    status: "Existing",
    nearbyRenewables: "Wind (30km)",
    state: "Rajasthan",
  },
  {
    id: "p3",
    name: "Tamil Nadu H2 Hub",
    lat: 13.0827,
    lng: 80.2707,
    capacityMW: 280,
    status: "Planned",
    nearbyRenewables: "Solar (40km)",
    state: "Tamil Nadu",
  },
  {
    id: "p4",
    name: "Maharashtra H2 Center",
    lat: 19.0760,
    lng: 72.8777,
    capacityMW: 180,
    status: "Existing",
    nearbyRenewables: "Solar (35km)",
    state: "Maharashtra",
  },
  {
    id: "p5",
    name: "Karnataka H2 Facility",
    lat: 12.9716,
    lng: 77.5946,
    capacityMW: 220,
    status: "Planned",
    nearbyRenewables: "Wind (45km)",
    state: "Karnataka",
  },
]

export const samplePipelines: Pipeline[] = [
  {
    id: "pipe1",
    name: "Gujarat-Rajasthan Connector",
    coordinates: [
      [22.2587, 71.1924],
      [24.5, 72.5],
      [26.9124, 70.9122],
    ],
  },
  {
    id: "pipe2",
    name: "Southern Corridor",
    coordinates: [
      [13.0827, 80.2707],
      [12.9716, 77.5946],
      [17.3850, 78.4867],
    ],
  },
]

export const sampleStorageSites: StorageSite[] = [
  { id: "s1", name: "Mumbai Storage Hub", lat: 19.0760, lng: 72.8777, capacityKtons: 120, state: "Maharashtra" },
  { id: "s2", name: "Delhi Storage Center", lat: 28.7041, lng: 77.1025, capacityKtons: 80, state: "Delhi" },
  { id: "s3", name: "Kolkata Storage Facility", lat: 22.5726, lng: 88.3639, capacityKtons: 95, state: "West Bengal" },
  { id: "s4", name: "Chennai Storage Hub", lat: 13.0827, lng: 80.2707, capacityKtons: 85, state: "Tamil Nadu" },
  { id: "s5", name: "Bangalore Storage Center", lat: 12.9716, lng: 77.5946, capacityKtons: 75, state: "Karnataka" },
]

export const sampleDemandHubs: DemandHub[] = [
  { id: "d1", name: "Mumbai Industrial Hub", lat: 19.0760, lng: 72.8777, type: "Industry", state: "Maharashtra" },
  { id: "d2", name: "Delhi Urban Center", lat: 28.7041, lng: 77.1025, type: "Urban", state: "Delhi" },
  { id: "d3", name: "Bangalore Tech Hub", lat: 12.9716, lng: 77.5946, type: "Industry", state: "Karnataka" },
  { id: "d4", name: "Chennai Port Hub", lat: 13.0827, lng: 80.2707, type: "Port", state: "Tamil Nadu" },
  { id: "d5", name: "Ahmedabad Industrial Zone", lat: 23.0225, lng: 72.5714, type: "Industry", state: "Gujarat" },
  { id: "d6", name: "Jaipur Urban Center", lat: 26.9124, lng: 75.7873, type: "Urban", state: "Rajasthan" },
]

export const sampleRenewables: RenewableSite[] = [
  { id: "r1", name: "Gujarat Solar Park", lat: 23.0, lng: 72.0, type: "Solar", state: "Gujarat" },
  { id: "r2", name: "Rajasthan Wind Farm", lat: 26.5, lng: 70.5, type: "Wind", state: "Rajasthan" },
  { id: "r3", name: "Tamil Nadu Solar Farm", lat: 12.5, lng: 80.0, type: "Solar", state: "Tamil Nadu" },
  { id: "r4", name: "Karnataka Wind Project", lat: 13.5, lng: 77.5, type: "Wind", state: "Karnataka" },
  { id: "r5", name: "Maharashtra Solar Plant", lat: 19.5, lng: 72.5, type: "Solar", state: "Maharashtra" },
  { id: "r6", name: "Delhi Wind Farm", lat: 28.5, lng: 77.5, type: "Wind", state: "Delhi" },
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
      siteName: "Gujarat Coastal Site",
      score: 92,
      capacityMW: 300,
      estimatedCostUSDm: 480,
      demandCoveragePct: 38,
      lat: 22.5,
      lng: 72.0,
    },
    {
      id: "rec2",
      siteName: "Rajasthan Desert Hub",
      score: 89,
      capacityMW: 220,
      estimatedCostUSDm: 320,
      demandCoveragePct: 27,
      lat: 26.5,
      lng: 70.5,
    },
    {
      id: "rec3",
      siteName: "Tamil Nadu Port Site",
      score: 84,
      capacityMW: 260,
      estimatedCostUSDm: 410,
      demandCoveragePct: 31,
      lat: 13.0,
      lng: 80.2,
    },
    {
      id: "rec4",
      siteName: "Karnataka Tech Corridor",
      score: 81,
      capacityMW: 180,
      estimatedCostUSDm: 260,
      demandCoveragePct: 21,
      lat: 12.9,
      lng: 77.5,
    },
    {
      id: "rec5",
      siteName: "Maharashtra Industrial Zone",
      score: 79,
      capacityMW: 210,
      estimatedCostUSDm: 300,
      demandCoveragePct: 24,
      lat: 19.0,
      lng: 72.8,
    },
  ],
  highlightedZones: [
    { id: "zone1", lat: 22.5, lng: 72.0, radiusKm: 30, color: "#22c55e" },
    { id: "zone2", lat: 26.5, lng: 70.5, radiusKm: 25, color: "#0ea5e9" },
  ],
}
