import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProcessRail } from "@/components/process-rail"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { solutionPillars } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Project planning, workshop layout, and production-supporting information sharing for wet wipes production and packaging equipment projects.",
}

const pillarDetails: Record<string, string[]> = {
  "Project Planning": [
    "Confirming target output formats and expected line speed",
    "Reviewing available workshop space and utility connections",
    "Selecting the equipment families needed to meet project goals",
  ],
  "Workshop Layout": [
    "Sequencing substrate preparation, production, and packaging stages",
    "Positioning equipment for a coherent material flow",
    "Planning space for maintenance access and material staging",
  ],
  "Production-Supporting Information Sharing": [
    "Sharing line sequencing and changeover considerations",
    "Sharing operating notes relevant to your configuration",
    "Coordinating with your team through installation and training",
  ],
}

export default function SolutionsPage() {
  return (
    <div>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Solutions
          </span>
          <h1 className="mt-2 max-w-2xl text-balance text-3xl font-bold text-foreground md:text-4xl">
            Project Planning, Workshop Layout, and Production-Supporting Information Sharing
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-muted-foreground">
            Equipment is only part of a successful wet wipes workshop. Our team works alongside
            yours on the planning and layout decisions that determine how well that equipment
            performs together.
          </p>
        </div>
      </section>

      <section aria-labelledby="pillars-heading" className="border-b border-border py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="pillars-heading" className="sr-only">
            Solution Pillars
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {solutionPillars.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div key={pillar.title} className="reveal-panel flex flex-col gap-4">
                  <span className="inline-flex size-12 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="details" className="border-border">
                      <AccordionTrigger className="text-sm font-semibold text-primary hover:no-underline">
                        What this includes
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="flex flex-col gap-2 pt-1">
                          {pillarDetails[pillar.title]?.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="commissioning-heading" className="border-b border-border bg-secondary/30 py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Line Planning
            </span>
            <h2 id="commissioning-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              A Bounded, Verified Commissioning Sequence
            </h2>
            <p className="mt-3 text-pretty text-muted-foreground">
              Every project moves through the same seven-stage sequence, giving your team a clear
              view of what happens next at every point.
            </p>
          </div>

          <div className="mt-10 overflow-x-auto">
            <ProcessRail className="min-w-[820px] md:min-w-0" />
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-card p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-xl">
              <h2 id="cta-heading" className="text-balance text-2xl font-bold text-foreground md:text-3xl">
                Discuss Your Workshop Project
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground">
                Share your target output formats and workshop constraints, and our team will
                follow up with next steps for planning.
              </p>
            </div>
            <Button asChild size="lg" className="gap-1.5">
              <Link href="/contact">
                Contact Our Team
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
