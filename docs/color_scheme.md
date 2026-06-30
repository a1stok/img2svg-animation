# Color Scheme

The current product uses a dark GitHub-inspired blue-gray interface with a bright blue accent. `app/app.css` is the source of truth for these tokens.

## Brand and Accent

- Accent: `#3b82f6` - Primary actions, focused controls, and active conversion states.
- Accent Dark: `#2563eb` - Stronger accent states when extra contrast is needed.

## Surfaces

- Background: `#05070a` - App canvas.
- Surface Sunken: `#080b10` - Lowest panel layer.
- Surface: `#0d1117` - Default panels and controls.
- Surface Raised: `#161b22` - Raised panels, code output, and dropdown content.
- Surface Hover: `#1c2330` - Interactive hover state.
- Surface Light: `#21262d` - Secondary controls and input surfaces.

## Borders

- Border: `#21262d` - Default dividers and control outlines.
- Border Light: `#30363d` - Higher-emphasis border and focus-adjacent states.

## Text

- Text: `#e6edf3` - Primary foreground text.
- Text Muted: `#7d8590` - Secondary labels, helper text, and subdued metadata.

## Usage Rules

- Use CSS variables from `app/app.css` instead of hard-coded color values in components.
- Reserve the blue accent for clear actions, focus, and status. Do not use it as a page-wide wash.
- Keep previews and generated SVG content readable against white preview canvases when needed.
- Preserve sufficient contrast for small labels and code output.
