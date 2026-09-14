"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SECTION_VARIANTS = ["rise", "wipe", "soft-scale"] as const

type MotionElement = HTMLElement & {
  dataset: DOMStringMap & {
    motionComplete?: string
    motionDelay?: string
    motionState?: string
    motionVariant?: string
  }
}

export function MotionController() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const sections = Array.from(
      document.querySelectorAll<MotionElement>(
        "main section:not([data-motion-skip]), main [data-motion-section], body > footer",
      ),
    )
    const panels = Array.from(document.querySelectorAll<MotionElement>("main .reveal-panel"))
    const targets = [...new Set([...sections, ...panels])]

    if (reducedMotion || !("IntersectionObserver" in window)) {
      root.classList.add("motion-reduced")
      for (const target of targets) target.dataset.motionComplete = "true"
      return
    }

    root.classList.remove("motion-reduced")
    for (const [index, target] of targets.entries()) {
      const isPanel = target.classList.contains("reveal-panel")
      target.dataset.motionState = "pending"
      target.dataset.motionVariant = isPanel ? "panel" : SECTION_VARIANTS[index % SECTION_VARIANTS.length]
      target.style.setProperty("--motion-delay", `${isPanel ? (index % 5) * 55 : 0}ms`)
    }

    let disposed = false
    const cleanupTimers = new Set<number>()
    const reveal = (target: MotionElement) => {
      if (target.dataset.motionState !== "pending") return
      target.dataset.motionState = "visible"
      const timer = window.setTimeout(() => {
        if (disposed) return
        target.dataset.motionComplete = "true"
        delete target.dataset.motionState
        delete target.dataset.motionVariant
        target.style.removeProperty("--motion-delay")
        cleanupTimers.delete(timer)
      }, 900)
      cleanupTimers.add(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as MotionElement
          reveal(target)
          observer.unobserve(target)
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    )

    for (const target of targets) observer.observe(target)
    root.classList.add("motion-ready")

    const initialFallback = window.setTimeout(() => {
      for (const target of targets) {
        if (target.getBoundingClientRect().top < window.innerHeight * 1.15) reveal(target)
      }
    }, 1200)

    const globalFallback = window.setTimeout(() => {
      for (const target of targets) reveal(target)
      observer.disconnect()
    }, 15000)

    return () => {
      disposed = true
      observer.disconnect()
      window.clearTimeout(initialFallback)
      window.clearTimeout(globalFallback)
      for (const timer of cleanupTimers) window.clearTimeout(timer)
      for (const target of targets) {
        delete target.dataset.motionState
        delete target.dataset.motionVariant
        target.style.removeProperty("--motion-delay")
      }
    }
  }, [pathname])

  return null
}
