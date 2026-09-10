"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { heroSlides } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return
    timerRef.current = setInterval(() => {
      setActive((v) => (v + 1) % heroSlides.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function goTo(index: number) {
    if (timerRef.current) clearInterval(timerRef.current)
    setActive(index)
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-[#071a33]" aria-label="Featured equipment and services">
      <div className="relative mx-auto max-w-[1440px] px-0 md:px-6 md:py-6">
        <div className="relative overflow-hidden bg-[#071a33] md:rounded-lg md:border md:border-white/15 md:panel-notch">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              data-active={i === active}
              className={cn(
                "hero-slide scan-line relative min-h-[720px] md:min-h-[590px]",
                i === active ? "block" : "hidden",
              )}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: slide.objectPosition }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,42,0.98)_0%,rgba(5,20,42,0.88)_42%,rgba(5,20,42,0.18)_72%,rgba(5,20,42,0.58)_100%)] md:bg-[linear-gradient(270deg,rgba(5,20,42,0.98)_0%,rgba(5,20,42,0.92)_38%,rgba(5,20,42,0.45)_62%,rgba(5,20,42,0.04)_100%)]" aria-hidden="true" />
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20 mix-blend-screen" aria-hidden="true" />

              <div className="relative z-10 flex min-h-[720px] max-w-2xl flex-col justify-start gap-5 px-6 pb-24 pt-12 text-white md:ml-auto md:min-h-[590px] md:w-[56%] md:justify-center md:px-12 md:pb-28 md:pt-16 lg:px-16">
                <span className="inline-flex w-fit items-center rounded-sm border border-white/35 bg-white/10 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                  {slide.eyebrow}
                </span>
                <h1 className="max-w-xl text-balance font-sans text-[2rem] font-bold leading-[1.08] tracking-[-0.025em] text-white md:text-[3rem]">
                  {slide.heading}
                </h1>
                <p className="max-w-lg text-pretty text-base leading-relaxed text-white/82 md:text-lg">
                  {slide.body}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/contact">
                      Request a Quote
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/45 bg-white/8 text-white hover:bg-white hover:text-[#071a33]">
                    <Link href="/products">View Equipment</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 border-t border-white/15 bg-[#071a33]/78 px-6 py-4 text-white backdrop-blur-md md:px-14 lg:px-20">
            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show slide: ${slide.heading}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === active ? "w-8 bg-accent" : "w-4 bg-white/35 hover:bg-white/70",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goTo((active - 1 + heroSlides.length) % heroSlides.length)}
                className="inline-flex size-9 items-center justify-center rounded-sm border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-[#071a33]"
                aria-label="Previous slide"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo((active + 1) % heroSlides.length)}
                className="inline-flex size-9 items-center justify-center rounded-sm border border-white/30 text-white transition-colors hover:border-white hover:bg-white hover:text-[#071a33]"
                aria-label="Next slide"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
