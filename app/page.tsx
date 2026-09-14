import type { CSSProperties } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, Factory, Wrench, Ruler, LifeBuoy, ShoppingCart, PenTool } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCard } from "@/components/product-card"
import { ProcessRail } from "@/components/process-rail"
import { Button } from "@/components/ui/button"
import { solutionPillars, outputSamples, company } from "@/lib/site-data"
import { fetchProductsData } from "@/lib/products-db"

export const revalidate = 60

const capabilities = [
  { title: "Design", description: "Engineering equipment configurations around your target output.", icon: PenTool },
  { title: "Develop", description: "Refining mechanisms and controls before production.", icon: Wrench },
  { title: "Produce", description: "Manufacturing and assembling equipment to specification.", icon: Factory },
  { title: "Commission", description: "Testing and commissioning equipment before handover.", icon: Ruler },
  { title: "Sell", description: "Supporting equipment selection for your project.", icon: ShoppingCart },
  { title: "Service", description: "Remaining available for after-sales support.", icon: LifeBuoy },
]

export default async function HomePage() {
  const { products } = await fetchProductsData()
  return (
    <>
      <HeroCarousel />

      <section data-motion-profile="lifecycle" aria-labelledby="capabilities-heading" className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              What We Do
            </span>
            <h2 id="capabilities-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              Wet Wipes Equipment, End to End
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              {company.legalNameEn} covers the full equipment lifecycle for wet wipes production and
              packaging, from initial design through ongoing service.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.title}
                  className="reveal-panel lifecycle-card flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-3 py-6 text-center"
                  style={{ "--motion-index": index } as CSSProperties}
                >
                  <span className="lifecycle-icon inline-flex size-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-foreground">{cap.title}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{cap.description}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section data-motion-profile="equipment-grid" aria-labelledby="products-heading" className="border-b border-border bg-secondary/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                Equipment Range
              </span>
              <h2 id="products-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
                Ten Documented Equipment Models for Wet Wipes Production
              </h2>
            </div>
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/products">
                View all equipment
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product, index) => (
              <div key={product.slug} className="equipment-motion-item" style={{ "--motion-index": index } as CSSProperties}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-motion-profile="project-flow" aria-labelledby="process-heading" className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              How A Project Runs
            </span>
            <h2 id="process-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              From Project Planning to After-Sales Service
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Every project follows the same bounded sequence, from initial planning through
              commissioning and ongoing support.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <ProcessRail />
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/solutions">
                See the full solution
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section data-motion-profile="output-gallery" aria-labelledby="output-heading" className="border-b border-border bg-secondary/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Example Output
            </span>
            <h2 id="output-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              Representative Wet Wipes Formats Our Equipment Supports
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {outputSamples.map((sample, index) => (
              <div
                key={sample.src}
                className="reveal-panel output-motion-card relative aspect-square overflow-hidden rounded-lg border border-border bg-card"
                style={{ "--motion-index": index } as CSSProperties}
              >
                <Image
                  src={sample.src || "/placeholder.svg"}
                  alt={sample.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="output-motion-image object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-motion-profile="solution-cards" aria-labelledby="solutions-heading" className="border-b border-border bg-background py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Solutions
            </span>
            <h2 id="solutions-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              Support Beyond the Equipment Itself
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {solutionPillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="reveal-panel solution-motion-card flex flex-col gap-3 rounded-lg border border-border bg-card p-6"
                  style={{ "--motion-index": index } as CSSProperties}
                >
                  <span className="solution-motion-icon inline-flex size-11 items-center justify-center rounded-sm bg-accent/15 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section data-motion-profile="project-cta" aria-labelledby="cta-heading" className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
          <div className="max-w-xl">
            <h2 id="cta-heading" className="text-balance text-2xl font-bold md:text-3xl">
              Start a Wet Wipes Equipment Project
            </h2>
            <p className="mt-3 text-pretty text-primary-foreground/80">
              Tell us about your target output and workshop, and our team will follow up on your
              equipment request.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="project-cta-button gap-1.5">
            <Link href="/contact">
              Request a Quote
              <span className="project-cta-icon inline-flex" aria-hidden="true">
                <ArrowUpRight className="size-4" />
              </span>
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
