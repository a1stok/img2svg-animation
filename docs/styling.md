# Styling & Design Strategy (Tailwind v4)

This project strictly follows a **CSS-first design system framework** using Tailwind CSS v4.

## Core Concepts

### 1. Design Token Hierarchy

All colors and values should follow this specific abstraction cascade to ensure extreme maintainability:

1. **Brand Tokens (abstract)**: e.g. `oklch(45% 0.2 260)`
2. **Semantic Tokens (purpose)**: e.g. `--color-primary`
3. **Component Tokens (specific)**: e.g. `bg-primary`

### 2. Native CSS Variables & OKLCH

- We use the `oklch()` color space for all defined colors due to its perceptually uniform lightness.
- All tokens must be defined inside the `@theme` block in the main `index.css`.
- Avoid `tailwind.config.ts` entirely. Rely on the CSS `@theme` directive.

### 3. Dark Mode

- We use the `@custom-variant` directive to support class-based dark mode cleanly.
- Define dark mode overrides simply by targeting the `.dark` class and redefining the semantic CSS variables.

## Quick Reference Setup (Example)

Your `index.css` must follow this structure, explicitly grouping tokens with header comments:

```css
@import "tailwindcss";

@theme {
  /* --- Brand & Semantic Colors (Light Mode) --- */
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(14.5% 0.025 264);
  --color-primary: oklch(14.5% 0.025 264);
  --color-primary-foreground: oklch(98% 0.01 264);

  /* --- Radii & Spacing --- */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;

  /* --- Animations --- */
  --animate-fade-in: fade-in 0.2s ease-out;

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

/* --- Dark Mode Configuration --- */
@custom-variant dark (&:where(.dark, .dark *));

.dark {
  --color-background: oklch(14.5% 0.025 264);
  --color-foreground: oklch(98% 0.01 264);
  --color-primary: oklch(98% 0.01 264);
  --color-primary-foreground: oklch(14.5% 0.025 264);
}

/* --- Base Styles --- */
@layer base {
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

## Component Architecture

When building components, strictly follow:
`Base styles → Variants → Sizes → States → Overrides`

Use standard accessibility-first patterns with ARIA attributes and well-defined focus states utilizing the `--color-ring` and `--color-ring-offset` properties.

### Standardizing Component Variants (CVA)

For complex components with multiple states (like Buttons or Badges), use the `cva` (Class Variance Authority) pattern to maintain strict styling constraints rather than conditional string concatenation:

```typescript
const buttonVariants = cva(
  // Base styles (Native CSS variables)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
```

### Compound Components

For multi-part UI elements (like Cards, Dialogs, or Accordions), use the React Compound Component pattern (e.g., `<Card>`, `<CardHeader>`, `<CardContent>`) to keep APIs clean and style tokens separated logically. Since we are on React 19, standard props handle `ref` without needing `forwardRef`.
