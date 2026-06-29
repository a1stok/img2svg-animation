## Problem Statement

The user needs a way to take the generated black-and-white SVG (from the previous milestone) and prepare it for an animated line-drawing effect. They also need a way to configure the animation parameters (duration, delay, easing, looping, etc.) and inspect the generated animation configuration before actually playing it back.

## Solution

Wire the `SvgPlayer` component into the index page to receive the SVG string. Create a configuration panel in the UI that exposes Anime.js V4 parameters (such as `duration`, `delay`, `easing`, `direction`, `loop`, and `autoplay`). Parse the SVG paths to prepare them for the `stroke-dashoffset` animation. Finally, display the generated animation configuration as an inspectable code block or JSON snippet, fulfilling the goals of Milestone 3.

## User Stories

1. As a user, I want the SVG output from the image converter to automatically feed into the animation preparation step.
2. As a user, I want a configuration panel to adjust animation settings like duration, delay, easing, and looping.
3. As a user, I want the app to parse the SVG paths and compute the necessary Anime.js V4 parameters.
4. As a user, I want to inspect the generated Anime.js configuration (or code) before initiating playback.

## Implementation Decisions

- **Anime.js V4:** We will utilize the newly upgraded Anime.js V4 configuration structure.
- **Component Changes:** Update `app/features/animator/SvgPlayer.tsx` to accept the SVG string as a prop.
- **State Management:** Introduce React state for the animation settings (e.g., `duration` (number), `delay` (number), `easing` (string), `loop` (boolean/number), `direction` (string)).
- **Configuration Panel:** Build a UI panel alongside the SVG preview containing form controls (inputs, sliders, selects) for the animation settings.
- **Configuration Output:** Render the finalized animation configuration (combining the user's settings and the SVG path targets) inside a formatted `<pre>` or code block. Playback itself is deferred to Milestone 4.

## Testing Decisions

- **UI Tests:** Verify that the configuration panel correctly updates the state.
- **Component Tests:** Ensure `SvgPlayer` correctly parses an incoming SVG string and outputs the expected configuration data structure without crashing.

## Out of Scope

- Actual animation playback (this is explicitly reserved for Milestone 4).
- Advanced SVG morphing (`svg.morphTo`) or motion paths (`svg.createMotionPath`) are not required for this base draw-on effect.
- Complex state management libraries (Redux, Zustand) - local React state is sufficient for this milestone.

## Further Notes

- The Anime.js V4 `svg.createDrawable` method will eventually be used in Milestone 4, but for Milestone 3, we simply need to structure the parameters that will be fed into it.
