# Motion plan — Zhengzhou Lizhichuang Machinery Equipment Co., Ltd.

## Context and selection constraints

- Industry: wet wipes production and packaging machinery.
- Brand language: customer-supplied blue/orange Lizhichuang mark, long horizontal production-line silhouettes, precise technical panels, and evidence-led manufacturing.
- Conversion goal: move a technical buyer from machine family to model detail and a scoped RFQ without hiding specifications behind motion.
- Recent-combination check: the latest ledger entries use garment-directional reveals, corrugated-paper paths, and laminated-material peels. This plan instead uses an assembly-line commissioning scan and a feed-to-pack process rail, so the complete combination is not repeated.
- Base visibility: all copy, cards, imagery, specifications, forms, and controls are visible without JavaScript. Motion is progressive enhancement only after a synchronous `data-motion-ready` boundary.
- Internal case-library check: the authorized industrial-machinery and Chinese `机械设备` searches returned no matching published cases. No unrelated case was forced into the site; the implementation therefore follows the already-scored Motion mechanisms below and the site's own production-line visual language.

## External candidates scored

| Candidate | Source | Industry / brand fit | Hierarchy | Conversion | Recent difference | Desktop / 390px | Performance / cleanup | Reduced motion | Decision |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| EXT-LZC-01: Motion scroll image reveal | [Motion example](https://motion.dev/examples/react-scroll-image-reveal) | 4 | 4 | 3 | 4 | 4 | 4 | 4 | Adopt only the short `clip-path` reveal principle for machine silhouettes; no third-party layout or assets. |
| EXT-LZC-02: Motion `useScroll` progress mapping | [Motion docs](https://motion.dev/docs/react-use-scroll) | 4 | 4 | 4 | 4 | 3 | 4 | 4 | Partially adopt for one desktop commissioning rail; use a one-shot observer/vertical static fallback on 390px. |
| EXT-LZC-03: GSAP `ScrollTrigger.batch()` | [GSAP docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch%28%29/) | 3 | 4 | 3 | 3 | 3 | 3 | 3 | Reject as a new dependency. The required bounded card stagger is achievable with the existing React/CSS/Motion stack. |

## Selected scenes

### MOT-LZC-01 — Assembly-line commissioning scan

- Responsibility: narrative.
- Location: the three-slide home Hero using all customer-provided carousel images.
- Effect: each active machine composition receives one 520–650 ms horizontal mask/scan reveal that follows the physical feed-to-pack direction. The DOM eyebrow, heading, supporting copy, and CTA enter in a 70 ms reading sequence and remain independent of the bitmap.
- Why: the long production-line silhouette is the strongest factual form in the supplied material; directional commissioning motion explains the product rather than adding decoration.
- Implementation: Motion or CSS `clip-path`/transform on a bounded overlay; slide controls support keyboard, pointer, touch, pause, and focus. Never apply opacity to the text parent.
- Desktop: complete machine subject stays inside the safe region; optional auto-advance only when visible and unfocused.
- 390px: use a separate focal crop with a short opacity/8px translation; no horizontal scan that could hide the machine or CTA.
- Reduced motion: disable auto-advance, masks, and displacement; first slide and manual controls are immediately available.

### MOT-LZC-02 — Feed-to-pack process rail

- Responsibility: industry-specific content explanation.
- Location: Solutions / line-planning workflow and the home engineering-process summary.
- Effect: a restrained line progresses once through intake, folding/dosing, cutting, primary packing, inspection, and secondary packing nodes while the corresponding semantic list remains visible.
- Why: it mirrors the verified wet-wipes line sequence and creates a distinctive machinery narrative without inventing equipment or capacity.
- Implementation: SVG path length or CSS custom-property progress. Desktop may map a short section-local scroll range; it must not pin, hijack scrolling, or create horizontal page overflow.
- Desktop: line progress follows the section only; labels remain static and keyboard-readable.
- 390px: vertical rail with one-shot node emphasis; no scrub or horizontal carousel.
- Reduced motion: full rail and all nodes render in their final state.

### MOT-LZC-03 — Full-site steel-panel reveal system

- Responsibility: content hierarchy and all repeated-card coverage.
- Location: every public content section on Home, Products, product details, Solutions, About, News, article details, Contact/RFQ and the footer, plus every product, solution, capability, application, process, certificate, exhibition, FAQ, contact-point, and news-card collection.
- Effect: major sections alternate among a 20–24 px bounded rise, short rectangular wipe, and 0.975 soft-scale reveal. Repeated cards use a capped 55 ms stagger. Machine imagery remains `contain` and never becomes the mask itself.
- Why: a controlled panel rhythm matches industrial controls and preserves dense technical scanning.
- Implementation: the shared `MotionController` adds hidden initial states only after JavaScript and `IntersectionObserver` are available, observes once, removes transient motion attributes after completion, disconnects on route changes, and has both viewport and global visibility fallbacks.
- Desktop: verify the first and last card in every collection animate once with no layout shift.
- 390px: reduce travel to 8–12 px and cap stagger at 40–60 ms.
- Reduced motion: all cards are immediately visible with no stagger.

### MOT-LZC-04 — Industrial control feedback

- Responsibility: interaction.
- Location: navigation, product cards, CTA buttons, carousel controls, accordions, tabs/filters, and RFQ inputs/buttons.
- Effect: 140–220 ms border/colour/arrow feedback, up to 4 px card lift, and at most 1.02 image scale. Focus-visible uses an explicit high-contrast ring; press states are available on touch.
- Why: short control feedback supports a technical purchase path without turning the site into a motion demo.
- Implementation: CSS transitions or Motion hover/tap states; never depend on hover for content or actions.
- Desktop: mouse and keyboard states remain visually equivalent.
- 390px: touch feedback uses colour/press only; no hover-only lift requirement.
- Reduced motion: remove displacement and scaling, retain colour, border, and focus feedback.

## Verification contract

- Scene count: 4.
- External candidate count: 3.
- Desktop design result: PASS — each scene has a bounded desktop behaviour and no scroll hijacking.
- 390px design result: PASS — each scene has an explicit touch-safe mobile treatment.
- Reduced-motion design result: PASS — all essential information and controls remain visible and usable without animation.
- Template review evidence will verify Hero narrative, one process rail, first/last cards, hover/focus/press, and fail-safe visibility.
- Full-content review will repeat the checks across every route and all ten real products, including newly filtered/paginated content.
