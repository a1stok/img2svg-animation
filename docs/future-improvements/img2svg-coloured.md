# Improvement: Advanced Multicolor SVG (img2svg-coloured)

## Overview

The initial implementation uses `node-potrace` for single-color B&W tracing paired with a stroke-dashoffset draw-on animation. This improvement adds a second, optional advanced mode that produces full multicolor SVG output via vtracer, with a different animation strategy to match.

Both modes coexist behind the same API route. Neither replaces the other.

## Mode 1: Standard (current)

- Library: `node-potrace` + `sharp` preprocessing
- Output: single-color SVG with outline paths
- Tracing: grayscale + auto-contrast, then threshold-based trace
- Color: one configurable stroke color (default: black)
- Animation: stroke-dashoffset draw-on effect. Works cleanly because every path is an outline, not a filled region

## Mode 2: Advanced Multicolor (this improvement)

- Library: [vtracer](https://github.com/visioncortex/vtracer), a Rust-based tracer with a WASM build for Node
- Output: multilayer SVG with one `<path>` group per detected color region
- Tracing: full-color quantization, hierarchical clustering, configurable color count (e.g. 8, 16, 32 layers)
- Color: preserves the original image palette
- Animation: stroke-dashoffset does not work on filled region patches. The strategy switches to staggered fill-opacity, fading each color layer in sequentially by depth order

## Why keep both

The standard mode produces the classic pen-drawing animation that is the core experience of this app. It is simple, fast, and reliable for any input image.

The advanced mode adds visual richness for users who want color-accurate output and are willing to trade the draw-on line effect for a layered-reveal animation.

## Implementation path

- Add `mode: "standard" | "advanced"` to the `api.convert.ts` Zod schema (default: `"standard"`)
- Create `app/services/vtracer-service.ts` that wraps the vtracer WASM binary
- `SvgPlayer` reads the SVG metadata (filled vs stroked paths) and selects the correct Anime.js timeline automatically
- Expose a mode toggle in the UI (Milestone 4 polish phase)
