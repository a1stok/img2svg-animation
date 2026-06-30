## Problem Statement

The application's initial UI was functional but lacked modern polish and wow-factor. It featured a generic hero section and a plain uploader, which didn't communicate the creative, animation-focused nature of the tool. Additionally, the standalone SVG export lacked convenient download options.

## Solution

Revamp the landing page to feature a deep "Midnight Blue" aesthetic with "Electric Blue" accents. Implement a highly stylized, live-dithered background inside the upload zone featuring a looping ink video. Add a large, subtle background animation of traced paths to demonstrate the app's core capability immediately. Improve the export options by adding one-click copy and download buttons.

## User Stories

1. As a user, I want to see a sleek, modern UI with a dark theme so the app feels premium.
2. As a user, I want the uploader to be visually interesting and clearly indicate drag-and-drop capability.
3. As a user, I want to see an example of the SVG animation capabilities on the landing page before I upload anything.
4. As a user, I want to easily copy the generated SVG code to my clipboard.
5. As a user, I want to download the raw SVG file directly.
6. As a user, I want to download a standalone HTML file containing the Anime.js animation.

## Implementation Decisions

- **Color Palette**: Replaced the default palette with Deep Midnight (`#05070A`) and Electric Blue (`#3B82F6`).
- **Dither Background**: Integrated Cult UI's CSS-only Bayer matrix dither effect (`DitherImageFrame`) into the `ImageUploader` component.
- **Background Video**: Used a looping `ink-vid.mp4` paused at 15 seconds as the source for the dither effect to create a dynamic, grungy texture.
- **Background Animation**: Added a `BackgroundAnimation` component using Anime.js and a raw SVG string to draw a large background graphic on page load.
- **Export Buttons**: Added "Copy SVG", "Download SVG", and "Download Animation (HTML)" to the `SvgPlayer`.
- **FOUC Fix**: Implemented a transition-opacity fade-in on SVGs to prevent a Flash of Unstyled Content before Anime.js initializes the `stroke-dasharray`.

## Testing Decisions

- Verify that the dither background renders correctly across browsers (relies on CSS filters and `::after`).
- Ensure the SVG download produces a valid XML file.
- Ensure the HTML export includes the embedded Anime.js script and executes independently without bundlers.

## Out of Scope

- Backend processing for video generation.
- Support for uploading video files for tracing.
