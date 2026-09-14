# Banner HD enhancement — 2026-09-14

## Mode and preservation contract

- Tool mode: built-in image generation edit mode.
- Classification: `enhance` / `precise-object-edit`.
- Inputs: the three approved 1920×800 Banner assets in `public/images/`.
- Outputs: three 3840×1600 JPEG assets, stored beside the originals with `-hd` versioned filenames.
- Invariants: preserve composition, focal placement, machine and wipe structure, proportions, colors, materials, labels, arrow, lighting direction, reflections, negative space, and aspect ratio. No new equipment, parts, packaging, text, Logo, watermark, crop, or factual claim.

## Final assets

- `public/images/hero-machine-line-hd.jpg`
- `public/images/hero-wipes-stack-hd.jpg`
- `public/images/hero-wipes-clouds-hd.jpg`

All three assets were enhanced for resolution, fine-edge definition, textile texture, antialiasing, compression cleanup, mild denoising, and restrained sharpening. The deployed frontend references only these versioned HD files. Matching hashed copies were uploaded to the tenant's R2 Banner directory and the tenant `extra_settings.banner_urls` value was updated with an exact tenant-scoped readback.
