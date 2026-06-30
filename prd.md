## Problem Statement

The user needs a way to take the generated black-and-white SVG (from the previous milestone) and prepare it for an animated line-drawing effect. They also need a way to configure the animation parameters (duration, delay, easing, looping, etc.) and inspect the generated animation configuration before actually playing it back.

## Solution

Wire the `SvgPlayer` component into the index page to receive the SVG string. Create a configuration panel in the UI that exposes Anime.js V4 parameters (such as `duration`, `delay`, `easing`, `direction`, `loop`, and `autoplay`). Parse the SVG paths to prepare them for the `stroke-dashoffset` animation. Play the generated animation inside the preview. (Completed)

We have also implemented a complete Tailwind v4 design system with reusable Radix primitives (`Button`, `Slider`, `Switch`, `Select`) and a cohesive "Midnight Blue" aesthetic.

## User Stories

1. As a user, I want the SVG output from the image converter to automatically feed into the animation preparation step. (Done)
2. As a user, I want a configuration panel to adjust animation settings like duration, delay, easing, and looping. (Done)
3. As a user, I want the app to parse the SVG paths and compute the necessary Anime.js V4 parameters. (Done)
4. As a user, I want to see the animation playback directly in the app. (Done)

## Implementation Decisions

- **Anime.js V4:** Utilized Anime.js V4 configuration structure (`reversed: true` instead of `direction: 'reverse'`).
- **Component Changes:** Updated `app/features/animator/svg-player.tsx` to handle playback and settings.
- **UI Design System:** Replaced native HTML inputs with Radix UI components (`Select`, `Slider`, `Switch`, `Label`) for a premium look, themed via Tailwind v4 semantic tokens (`app.css`).
- **Image Processing:** Updated `potrace-service.ts` to explicitly output a `.png()` buffer using `sharp` before sending it to `potrace`, preventing crashes on unsupported web formats like WebP.

## Verification

- **Automated / Manual:** Playback of Animejs SVG paths verified in the browser. Radix UI component states (focus, hover) successfully mapped to Tailwind v4 tokens. Node server crash on WebP upload resolved.
