import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Users, Gauge, ShieldCheck, Lightbulb, Handshake, ClipboardCheck, BadgeCheck, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/site-data"
import { absoluteUrl } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "About",
  description:
    "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, produces, commissions, sells, and services wet wipes production and packaging equipment.",
  alternates: { canonical: absoluteUrl("/about") },
  openGraph: { title: "About Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.", description: "Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. designs, develops, produces, commissions, sells, and services wet wipes production and packaging equipment.", type: "website", url: absoluteUrl("/about"), images: [{ url: absoluteUrl("/images/about-lobby-1.jpg") }] },
}

const values = [
  { title: "Unite", icon: Users },
  { title: "Efficient", icon: Gauge },
  { title: "Sincerity", icon: ShieldCheck },
  { title: "Innovate", icon: Lightbulb },
  { title: "Win-win", icon: Handshake },
  { title: "Responsible", icon: BadgeCheck },
  { title: "Dedicated", icon: Target },
  { title: "Pragmatic", icon: ClipboardCheck },
]

const gallery = [
  { src: "/images/about-lobby-1.jpg", alt: "Company entrance signage for Zhengzhou Lizhichuang Machinery Co., Ltd. at the facility" },
  { src: "/images/about-office-culture.jpg", alt: "Office reception area displaying the company culture wall" },
  { src: "/images/about-tradeshow.jpg", alt: "Lizhichuang Machinery booth and equipment at an industry trade show" },
  { src: "/images/about-lobby-2.jpg", alt: "Facility corridor with company signage and core value graphics" },
]

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            About Us
          </span>
          <h1 className="mt-2 max-w-3xl text-balance text-3xl font-bold text-foreground md:text-4xl">
            {company.legalNameEn}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
            Based in {company.locationLine}, we design, develop, produce, commission, sell, and
            service wet wipes production and packaging equipment. Alongside the equipment itself,
            we support customers with project planning, workshop layout, and production-supporting
            information sharing.
          </p>
        </div>
      </section>

      <section aria-labelledby="gallery-heading" className="border-b border-border py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="gallery-heading" className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            Our Facility
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {gallery.map((img) => (
              <div
                key={img.src}
                className="reveal-panel relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-card"
              >
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="border-b border-border bg-secondary/30 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Our Values
            </span>
            <h2 id="values-heading" className="mt-2 text-balance text-2xl font-bold text-foreground md:text-3xl">
              Principles Displayed Across Our Facility
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div
                  key={value.title}
                  className="reveal-panel flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-3 py-6 text-center"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-foreground">{value.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="scope-heading" className="border-b border-border py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 id="scope-heading" className="text-balance text-2xl font-bold text-foreground md:text-3xl">
            Scope of Work
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Equipment design and development",
              "Equipment production and assembly",
              "Factory testing and commissioning",
              "Equipment sales and technical consultation",
              "After-sales service and support",
              "Project planning and workshop layout",
            ].map((item) => (
              <div
                key={item}
                className="reveal-panel flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="cta-heading" className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-border bg-card p-8 md:flex-row md:items-center md:p-10">
            <div className="max-w-xl">
              <h2 id="cta-heading" className="text-balance text-2xl font-bold text-foreground md:text-3xl">
                Talk to Our Team
              </h2>
              <p className="mt-3 text-pretty text-muted-foreground">
                Reach out with your wet wipes production or packaging equipment requirements.
              </p>
            </div>
            <Button asChild size="lg" className="gap-1.5">
              <Link href="/contact">
                Contact Us
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
