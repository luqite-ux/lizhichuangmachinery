import type { Metadata } from "next"
import { MapPin, ClipboardList, Wrench, LifeBuoy, Mail } from "lucide-react"
import { RfqForm } from "@/components/rfq-form"
import { company } from "@/lib/site-data"
import { fetchProductsData } from "@/lib/products-db"
import { absoluteUrl } from "@/lib/site-config"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Submit a request for quotation to Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. for wet wipes production and packaging equipment.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: { title: "Contact Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.", description: "Submit a request for quotation to Zhengzhou Lizhichuang Machinery Equipment Co., Ltd. for wet wipes production and packaging equipment.", type: "website", url: absoluteUrl("/contact"), images: [{ url: absoluteUrl("/images/hero-machine-line.jpg") }] },
}

const contactPoints = [
  { title: "Project Planning", description: "Tell us your target output and workshop constraints.", icon: ClipboardList },
  { title: "Technical Consultation", description: "Our team reviews your request against our equipment range.", icon: Wrench },
  { title: "After-Sales Support", description: "Existing customers can reach us for service follow-up.", icon: LifeBuoy },
]

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const [{ products }, params] = await Promise.all([fetchProductsData(), searchParams])
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div data-motion-section>
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
            Contact
          </span>
          <h1 className="mt-2 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Request a Quote
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Share your project details below. Our team will review your request and follow up
            regarding your wet wipes production or packaging equipment inquiry.
          </p>

          <div className="mt-8 flex items-start gap-2.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              {company.legalNameEn}
              <br />
              {company.address}
              <br />
              <a className="mt-2 inline-block font-medium text-primary hover:underline" href={`tel:${company.phone.replace(/\s/g, "")}`}>{company.phone}</a>
              <br />
              <a className="mt-1 inline-flex items-center gap-1.5 font-medium text-primary hover:underline" href={`mailto:${company.email}`}><Mail className="size-3.5" aria-hidden="true" />{company.email}</a>
            </span>
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {contactPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.title} className="reveal-panel flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 md:p-8" data-motion-section>
          <RfqForm products={products.map(({ slug, name, model }) => ({ slug, name, model }))} defaultProductSlug={params.product || ""} />
        </div>
      </div>
    </div>
  )
}
