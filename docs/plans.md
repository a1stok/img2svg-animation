# Future Plans & Roadmap

## Current Status

Initial project setup is complete and pushed to `master`. The app boots at `http://localhost:5173`.

The scaffolding includes:

- React Router v7 + Vite + Tailwind CSS v4
- Feature-driven structure under `app/features/`
- Stub API route at `app/routes/api.convert.ts` with Zod validation
- Potrace service stub at `app/services/potrace-service.ts`
- `ImageUploader` component stub at `app/features/uploader/`
- `SvgPlayer` (Anime.js) component stub at `app/features/animator/`
- Husky + lint-staged pre-commit hook running Prettier

## Major Milestones (in order)

Do not build the next milestone until the previous one is working end-to-end.
UI polish is deferred to the end. Ship the simplest thing that works at each stage.

---

### Milestone 1: Drag-and-Drop / Upload -- COMPLETED

Goal: the user can pick or drop an image file; the app holds it in memory ready for the next step.

- Accept PNG, JPEG, WEBP (max 5 MB).
- Use native HTML drag events and `<input type="file">`. No library, no custom UI.
- Validate type and size on the client and show a plain inline error message.
- Store the selected file in component state and show a bare `<img>` preview.
- No submission to the server yet. Just reliable file selection.

### Milestone 2: Image to SVG -- COMPLETED

Goal: send the uploaded image to the server, receive back a B&W SVG, and render it visually so the user can configure and iterate.

Engine decision: use `node-potrace` with `sharp` preprocessing (grayscale + auto-contrast). Black-and-white output pairs directly with the stroke-dashoffset draw-on animation. Color SVG via vtracer is a planned future improvement (see docs/future-improvements/img2svg-coloured.md).

- Preprocess the image with `sharp` (grayscale, auto-contrast) before tracing.
- Complete the `api.convert.ts` route: accept `multipart/form-data`, call the conversion service, return SVG.
- Complete `potrace-service.ts` with tunable params (threshold, turdsize, alphamax, opttolerance).
- Add a unit test for the conversion service.
- Render the returned SVG inline so the user sees the B&W trace and can tweak parameters before moving on.

### Milestone 3: SVG to Animation Code -- COMPLETED

Goal: take the traced SVG and produce Anime.js animation parameters the user can inspect.

- Wire `SvgPlayer` into the index page to receive the SVG string.
- Parse the SVG paths and generate stroke-dashoffset animation config.
- Display the generated animation config so the user can inspect it before playback.

### Milestone 4: Code to Animation (Playback) -- CURRENT

Goal: play the animation back in the browser using the generated config.

- Wire the animation config into Anime.js and play the draw-on effect.
- Verify stroke-dashoffset animation plays correctly for all paths.
- Show a play/pause control.

### Milestone 5: Polish

Goal: a complete, polished end-to-end experience.

- Full two-panel home page layout (uploader left, animated SVG right).
- Error toast for failed conversions (using `sonner`).
- Polish animation timing and easing.
- Styled drag-and-drop UI.

---

## Technical Debt / Refactoring

(None currently)

## Future Improvements

See [docs/future-improvements/index.md](./future-improvements/index.md) for planned enhancements beyond the current milestones.
