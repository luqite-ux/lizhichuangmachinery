import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

test("off-screen sections are not completed by a global timeout", () => {
  const controller = read("components/motion-controller.tsx")

  assert.doesNotMatch(controller, /globalFallback/)
  assert.match(controller, /IntersectionObserver/)
  assert.match(controller, /observer\.unobserve\(target\)/)
})

test("homepage sections expose distinct perceptible motion profiles", () => {
  const home = read("app/page.tsx")
  const processRail = read("components/process-rail.tsx")
  const styles = read("app/globals.css")

  for (const profile of [
    "lifecycle",
    "equipment-grid",
    "project-flow",
    "output-gallery",
    "solution-cards",
    "project-cta",
  ]) {
    assert.match(home, new RegExp(`data-motion-profile=["']${profile}["']`))
  }

  assert.match(processRail, /data-process-rail/)
  assert.match(processRail, /data-process-step/)
  assert.doesNotMatch(home, /min-w-\[720px\]/)
  assert.match(styles, /@keyframes process-node-pulse/)
  assert.match(styles, /@keyframes process-line-travel/)
  assert.match(styles, /@keyframes output-image-float/)
  assert.match(styles, /@keyframes output-card-scan/)
  assert.match(styles, /@keyframes section-accent-travel/)
  assert.match(styles, /main \[data-motion-section\]\[data-motion-complete='true'\]::before/)
})

test("hero controls float on the banner without a full-width control strip", () => {
  const hero = read("components/hero-carousel.tsx")

  assert.match(hero, /data-hero-controls/)
  assert.match(hero, /data-hero-pagination/)
  assert.match(hero, /bottom-4/)
  assert.doesNotMatch(hero, /border-t border-white\/15 bg-\[#071a33\]\/78/)
})

test("project flow reserves vertical motion space around its animated nodes", () => {
  const processRail = read("components/process-rail.tsx")

  assert.match(processRail, /data-process-stage/)
  assert.match(processRail, /overflow-visible/)
  assert.match(processRail, /pt-4/)
  assert.match(processRail, /pb-3/)
  assert.match(processRail, /md:pt-5/)
  assert.match(processRail, /md:pb-4/)
})
