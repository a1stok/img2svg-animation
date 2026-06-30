# Future Plans & Roadmap

## Current Status

The V1 end-to-end app is implemented on `master`.

The app currently includes:

- React Router v7 with server route support.
- Tailwind CSS v4 tokens in `app/app.css`.
- Feature-driven structure under `app/features/`.
- Drag-and-drop image upload with client-side validation.
- Server-side image preprocessing with `sharp` and black-and-white tracing with `potrace`.
- Potrace controls for threshold, speckle removal, curve optimization, turn policy, foreground, and background behavior.
- Original image and traced SVG previews.
- Anime.js V4 draw-on animation preview.
- Animation controls for duration, path stagger, easing, direction, looping, stroke width, and fill fade.
- Export actions for copying SVG, downloading SVG, and downloading a standalone animated HTML file.
- Focused tests for uploader validation, Potrace service behavior, and SVG player rendering.

## Completed Milestones

### Milestone 1: Drag-and-Drop Upload

The user can pick or drop an image file. The app validates type and size before conversion.

### Milestone 2: Image to SVG

The selected image is sent to `/api/convert`, preprocessed with `sharp`, traced with `potrace`, and returned as inline SVG.

### Milestone 3: SVG to Animation Code

The traced SVG feeds into `SvgPlayer`, which prepares Anime.js V4 draw-on animation code and displays an integration guide.

### Milestone 4: Animation Playback

The app previews the generated animation in the browser, including play, pause, and restart controls.

### Milestone 5: Export and Polish

The app includes polished layout transitions, toast errors, copy/download actions, stroke width control, fill fade, and standalone HTML export.

## Technical Debt / Refactoring

- Add broader browser-level coverage for the complete upload, conversion, animation, and export path.
- Consider extracting generated Anime.js snippet creation into a pure module for easier tests.
- Keep docs synchronized whenever feature boundaries or design tokens change.

## Future Improvements

See [docs/future-improvements/index.md](./future-improvements/index.md) for planned enhancements beyond the current V1 milestone.
