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

## Next Up: Core Feature Implementation

The following items need to be built out in order. Use the `do-work` skill for each.

### 1. Image Uploader UI (`app/features/uploader/`)

- Wire up drag-and-drop file input using the native HTML `<input>` drag events (no external library).
- Validate file type (PNG, JPEG, WEBP) and size (max 5MB) on the client before sending.
- Show a preview of the uploaded image.
- On submit, send the image as base64 to `POST /api/convert`.

### 2. Backend Convert Endpoint (`app/routes/api.convert.ts`)

- Accept the base64 image from the request body (already Zod-validated).
- Decode base64 to a `Buffer`.
- Pass the `Buffer` to `traceImageToSvg()` in `app/services/potrace-service.ts`.
- Return the raw SVG string in the JSON response.

### 3. Potrace Service (`app/services/potrace-service.ts`)

- The stub is already written. Complete the implementation and add a unit test.
- Verify it correctly converts a small test PNG buffer into a valid SVG string.

### 4. SVG Animator (`app/features/animator/`)

- The `SvgPlayer` stub already sets up Anime.js stroke-dashoffset animation.
- Wire it into the index page so it receives the SVG string returned from the API.
- Polish the animation timing and easing.

### 5. Home Page (`app/routes/_index.tsx`)

- Replace the placeholder with the full UI: uploader on the left, animated SVG on the right.
- Add loading state while the API call is in progress.

## Technical Debt / Refactoring

- Add `v8_middleware` future flag to `react-router.config.ts` to silence remaining console warning.
- Consider adding an error toast (using `sonner`) for failed conversions.
