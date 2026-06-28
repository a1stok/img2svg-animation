# Future Improvements

## Color SVG Tracing (vtracer)

The initial implementation uses `node-potrace` for black-and-white tracing, which pairs naturally with the stroke-dashoffset draw-on animation effect.

A future version could support full-color SVG output using [vtracer](https://github.com/visioncortex/vtracer), a Rust-based tracer with a WASM build that runs in Node without any CLI subprocess or Python sidecar.

### Why vtracer

- Best-in-class color trace quality
- WASM build means no external process or language runtime
- Produces filled-region paths per color layer

### Animation strategy for color SVGs

Stroke-dashoffset animation does not work on filled region patches. For color SVG, the animation approach must change:

- **Staggered fill-opacity**: fade each color layer in sequentially. Clean and elegant.
- **Clip-path wipe**: reveal the whole image left-to-right or top-to-bottom.

The simplest good-looking option is staggered opacity per `<path>` group, sorted by color layer order.

### Implementation notes

- Accept an optional `mode` parameter in `api.convert.ts`: `"bw"` (default) or `"color"`.
- The service layer swaps between `potrace-service.ts` and a new `vtracer-service.ts`.
- `SvgPlayer` detects whether the SVG uses `fill` or `stroke` and picks the appropriate Anime.js timeline.
