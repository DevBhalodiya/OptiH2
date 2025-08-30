import { Navbar } from "@/components/navbar"
import { MapView } from "@/components/map/map-view"

export default function MapPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-balance text-2xl font-semibold">Interactive Map</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle layers to explore hydrogen plants, pipelines, storage, demand hubs, and renewables.
        </p>
        <div className="mt-4">
          <MapView />
        </div>
      </main>
    </>
  )
}
