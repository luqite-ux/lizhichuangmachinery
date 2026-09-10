"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mainNav, company } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label={`${company.shortNameEn} home`}
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt={`${company.legalNameEn} logo`}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="font-sans text-[11px] font-bold tracking-tight text-foreground sm:text-sm">
              LIZHICHUANG MACHINERY
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              Wet Wipes Equipment
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-sm px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-primary",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active && "bg-secondary text-primary",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Button asChild className="gap-1.5">
            <Link href="/contact">
              Request a Quote
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-foreground transition-colors hover:bg-secondary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-[max-height] duration-200 ease-out lg:hidden",
          open ? "max-h-[26rem]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-sm px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary",
                  active && "bg-secondary text-primary",
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            )
          })}
          <Button asChild className="mt-2 gap-1.5">
            <Link href="/contact" onClick={() => setOpen(false)}>
              Request a Quote
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
