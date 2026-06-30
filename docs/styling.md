# Styling & Design Strategy

This project uses Tailwind CSS v4 with CSS-first theme tokens in `app/app.css`.

## Source of Truth

- Define global design tokens in the `@theme` block in `app/app.css`.
- Use the token names from `docs/color_scheme.md` for colors.
- Do not add `tailwind.config.ts` unless a future requirement cannot be met with Tailwind v4 CSS directives.
- Keep component styling in class names close to the component that owns the markup.

## Token Hierarchy

Use this order when adding styling:

1. Global CSS variables in `app/app.css`.
2. Semantic Tailwind tokens such as `bg-background`, `text-foreground`, `bg-primary`, and `border-border`.
3. Component classes or variants.

Prefer existing tokens over hard-coded arbitrary values. Arbitrary values are acceptable only when they bind directly to a defined CSS variable, for example `text-[var(--color-text-muted)]`, or when the value is layout-specific and not a reusable design token.

## Components

- Reusable controls live in `app/components/ui`.
- Current primitives include `Button`, `Label`, `Select`, `Slider`, and `Switch`.
- Use Radix primitives for accessible controls when a headless primitive exists.
- Buttons use `class-variance-authority` and `tailwind-merge` through the shared `cn` utility.
- Keep cards and panels compact, with `rounded-lg` or smaller unless an existing component already requires more radius.

## Interaction States

- All keyboard-focusable controls need visible focus styles.
- Use `--color-ring` for focus rings.
- Use `--color-surface-hover` or existing component variants for hover states.
- Disabled states should reduce opacity and disable pointer events.

## Visual Direction

The app should feel like a focused creative tool, not a marketing page. Prioritize a compact workflow:

- Upload image.
- Configure trace settings.
- Compare original and traced SVG.
- Preview animation.
- Export SVG, code, or standalone HTML.

Do not add decorative hero sections or unrelated promotional copy to the first screen.
