## Problem Statement

Users need a simple, browser-based tool to convert raster images (PNG, JPEG) into SVG line-art and instantly generate smooth, draw-on animations using Anime.js, without having to write code or configure complex vector software manually.

## Solution

A full-stack React web application that accepts drag-and-drop image uploads, processes them into high-quality B&W SVGs using Potrace on the server, and provides an interactive playground to preview, configure, and export Anime.js V4 line-drawing animations.

## User Stories

1. As a user, I want to drag and drop an image file so that I can easily start the conversion process.
2. As a user, I want the server to automatically trace my image into a clean SVG so that I don't have to manually vectorize it.
3. As a user, I want an interactive playground to adjust animation settings (Duration, Easing, Loop, Path Stagger) so that I can perfect the visual effect in real-time.
4. As a user, I want to tweak visual modifiers like Stroke Width and "Fade In Fill" so that the final animation looks polished and complete.
5. As a developer, I want to copy the generated Anime.js Javascript and CSS so that I can easily integrate it into my own projects.
6. As a user, I want to download a standalone HTML file of my animation so that I can instantly share or view the final result locally.

## Implementation Decisions

- **Framework**: React Router v7 + Vite + Tailwind CSS v4.
- **Conversion Engine**: `node-potrace` wrapped in a server-side API route (`api.convert.ts`), preprocessed with `sharp` (grayscale, auto-contrast).
- **Animation Engine**: Anime.js V4, using `svg.createDrawable` and animating `stroke-dashoffset` for the draw effect.
- **Fill Fade Logic**: Interpolates `fillOpacity` from 0 to 1 to bypass color parsing bugs.
- **Architecture**: Feature-driven directory structure (`app/features/uploader`, `app/features/animator`).

## Testing Decisions

- Manual E2E testing of the drag-and-drop file pipeline.
- Visual verification of Anime.js V4 playback and HTML export functionality.

## Out of Scope

- Multi-color SVG tracing (deferred to a future vtracer implementation).
- Cloud storage or user accounts (the app is entirely stateless).

## Further Notes

All core features have been successfully implemented and validated. This PRD serves as the V1 baseline spec.
