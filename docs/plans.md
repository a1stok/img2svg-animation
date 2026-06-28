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

### Milestone 2: Image to SVG -- CURRENT

Goal: send the uploaded image to the server and receive back an SVG string.

- Decide on the conversion engine (Node.js potrace or Python service -- see docs/deployment.md).
- Complete the `api.convert.ts` route: decode base64, call the conversion service, return SVG.
- Complete or replace `potrace-service.ts` depending on the engine decision.
- Add a unit test for the conversion service.
- Display the raw SVG string in a `<pre>` tag so it can be verified before wiring the animator.

### Milestone 3: SVG to Animation Code

Goal: take the SVG path data and produce Anime.js animation parameters.

- Wire `SvgPlayer` into the index page to receive the SVG string.
- Verify stroke-dashoffset animation plays correctly for all paths.
- Export or display the generated animation config so the user can inspect it.

### Milestone 4: Code to Animation (Playback)

Goal: a complete, polished end-to-end experience.

- Full two-panel home page layout (uploader left, animated SVG right).
- Loading state during API call.
- Error toast for failed conversions (using `sonner`).
- Polish animation timing and easing.
- Styled drag-and-drop UI (this is when UI polish happens).

---

## Technical Debt / Refactoring

- Add `v8_middleware` future flag to `react-router.config.ts` to silence remaining console warning.
