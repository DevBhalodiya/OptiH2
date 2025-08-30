import { Navbar } from "@/components/navbar"
import { StatsCards } from "@/components/stats-cards"

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">
            Green Hydrogen InfraMap: <span className="text-emerald-500">Smarter Planning</span> for Net-Zero Energy
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Visualize hydrogen infrastructure and run optimization to accelerate low-carbon deployments.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 md:flex-row">
            <a
              href="/map"
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-500"
            >
              View Map
            </a>
            <a
              href="/optimize"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Run Optimization
            </a>
            <a
              href="/reports"
              className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Reports
            </a>
          </div>
        </section>

        <div className="mt-8">
          <StatsCards />
        </div>
      </main>
    </>
  )
}
