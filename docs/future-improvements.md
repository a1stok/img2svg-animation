# Future Improvements

## Advanced Color SVG Mode (vtracer)

The app ships with two conversion modes: a standard B&W mode (the initial version) and an advanced multicolor mode (the future version). Both run from the same API route via an optional `mode` parameter.

### Mode 1: Standard (current implementation)

- Library: `node-potrace` with `sharp` preprocessing
- Output: single-color SVG with outline paths
- Tracing: grayscale + auto-contrast, then threshold-based trace
- Color: one stroke color, configurable (defaults to black)
- Animation: stroke-dashoffset draw-on effect. Works cleanly because every path is an outline, not a filled region

### Mode 2: Advanced Multicolor (planned)

- Library: [vtracer](https://github.com/visioncortex/vtracer), a Rust-based tracer with a WASM build for Node
- Output: multi-layer SVG with one `<path>` group per detected color region
- Tracing: full-color quantization, hierarchical clustering, configurable color count
- Color: preserves original image palette (e.g. 8, 16, or 32 color layers)
- Animation: stroke-dashoffset does not work on filled region patches. The animation strategy switches to staggered fill-opacity, fading each color layer in sequentially by depth order

### Why keep both

The standard mode produces the classic pen-drawing animation that is the core experience of this app. It is simple, fast, and reliable for any input image.

The advanced mode adds visual richness for users who want color-accurate output and are willing to trade the draw-on line effect for a layered-reveal animation. The two modes are complementary, not replacements for each other.

### Implementation path

- Add `mode: "standard" | "advanced"` to the `api.convert.ts` Zod schema (default: `"standard"`)
- Create `app/services/vtracer-service.ts` that calls the vtracer WASM binary
- `SvgPlayer` reads the SVG metadata (filled vs stroked paths) and picks the appropriate Anime.js timeline automatically
- Expose a mode toggle in the UI (Milestone 4 polish phase)
