import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-balance text-2xl font-semibold">About Green Hydrogen InfraMap</h1>
        <p className="mt-2 text-pretty text-muted-foreground">
          An interactive planning tool to visualize hydrogen infrastructure and run siting optimization scenarios.
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold">References</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>IEA Hydrogen Production &amp; Infrastructure Database</li>
            <li>NREL HyDRA GIS Resources</li>
            <li>European Hydrogen Observatory datasets</li>
            <li>Open Energy System Databases</li>
          </ul>
        </section>
      </main>
    </>
  )
}
