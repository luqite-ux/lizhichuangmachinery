import Link from "next/link"
import Image from "next/image"
import { MapPin, MessageSquare } from "lucide-react"
import { mainNav, company, productNav } from "@/lib/site-data"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const copyrightOwner = company.legalNameEn.replace(/[.;:!?，。；：！？\s]+$/u, "")
  const copyrightText = `© ${year} ${copyrightOwner}. All rights reserved.`

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label={`${company.shortNameEn} home`}>
              <Image
                src="/images/logo.png"
                alt={`${company.legalNameEn} logo`}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <span className="font-sans text-sm font-bold tracking-tight text-foreground">
                LIZHICHUANG MACHINERY
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {company.legalNameEn} designs, develops, produces, commissions, sells, and services wet
              wipes production and packaging equipment, with project planning, workshop layout, and
              production-supporting information sharing.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigate
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Equipment
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {productNav.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-sm font-medium text-primary hover:underline">
                  View all equipment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{company.locationLine}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageSquare className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <Link href="/contact" className="hover:text-primary">
                  Submit a request for quotation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyrightText}</p>
          <p className="font-mono">Wet wipes production and packaging equipment</p>
        </div>
      </div>
    </footer>
  )
}
