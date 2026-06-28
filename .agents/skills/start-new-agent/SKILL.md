---
name: start-new-agent
description: Initializes a new agent session following strict architectural rules, writing style, and incorporating project best practices like feature-driven design and strict Zod validation.
---

# Project Rules & Best Practices

## First Step: Orient Yourself

Before doing anything else, read **[docs/plans.md](../../../docs/plans.md)**. It contains the current project status and the ordered list of next tasks. Start from the top incomplete item unless the user directs otherwise.

**CRITICAL RULE:** Do NOT implement anything or produce any results. Your sole responsibility during this initialization phase is to just outline what's next in the plan for the user to review.

## Writing Style

- Do not use emojis anywhere in code, comments, or documentation.
- Do not use em dashes. Use commas, periods, or parentheses instead.
- Do not use semicolons in prose or documentation. In code, follow the project linter (no semicolons in TypeScript/JSX).
- Write clear, direct sentences. Prefer short statements over compound ones.

## Code Quality & Architecture

- All code must be written in TypeScript with strict types. No `any` types unless absolutely unavoidable and documented with a comment explaining why.
- **Feature-Driven Architecture**: Organize code into `app/features/` (e.g., `features/uploader`, `features/converter`, `features/animator`) rather than large monolithic folders.
- **Zod for Validation**: Use `zod` strictly for all data boundary validations, including API requests, form submissions, and environment variables.
- Define explicit interfaces and types for all props, state, data structures, and API responses.
- Export types from dedicated type files when shared across components.
- Use a headless UI approach (like Radix Primitives) coupled with Tailwind CSS for accessible, customizable components.

## Documentation System: Docs vs. References

This project maintains strict documentation to govern AI behavior and architectural decisions. You must distinguish between **Global Project Docs** and **Skill References**.

### 1. Global Project Docs (`docs/`)

The root `docs/` folder contains universal project rules (e.g., folder structure, color schemes, deployment).
**CRITICAL RULE:** You MUST thoroughly read, internalize, and strictly adhere to ALL of the files in `docs/` before making structural changes. As the architecture evolves, you MUST update these files. Do not hallucinate details—fill them out iteratively.

**DYNAMIC DOCUMENTATION**: The `docs/` folder contains template files. As you build new components, establish design patterns, or configure deployment, you MUST gradually fill in these templates with accurate, updated information for the project. Do not leave them blank if you make architectural decisions, but do not hallucinate details—fill them out iteratively or when explicitly asked by the user.

- **[Project Structure](../../../docs/structure.md):** Rules for directory organization, co-location, and forbidding barrel files / default boilerplates.
- **[Naming & Component Conventions](../../../docs/conventions.md):** Rules for file naming (PascalCase vs camelCase) and React component purity.
- **[Committing Rules](../../../docs/committing.md):** Rules for writing git commit messages.
- **[Styling & Design Strategy](../../../docs/styling.md):** Rules for Tailwind CSS usage and the strict color token system.
- **[Color Scheme](../../../docs/color_scheme.md):** The exact hex codes, visual swatches, and hierarchy of the project's color palette.
- **[Future Plans](../../../docs/plans.md):** The roadmap of feature ideas and enhancements to be implemented.
- **[Future Improvements](../../../docs/future-improvements.md):** Planned enhancements beyond the current milestones (color SVG, vtracer, etc.).
- **[Running Locally](../../../docs/running.md):** Instructions for starting the development server across OS environments.
- **[Deployment](../../../docs/deployment.md):** Vercel deployment configurations and build commands.

### 2. Skill References (`.agents/skills/<skill-name>/references/`)

For deep-dive technical guidelines specific to an individual skill (e.g., exact instructions on how to use Potrace or Anime.js), store them in a `references/` subdirectory inside the relevant skill folder.
**CRITICAL RULE:** Do NOT bloat this `SKILL.md` file or the global `docs/` folder with highly specific technical tutorials. Instead, place them in `references/` and instruct agents to read them when the skill is invoked.

## Styling & Tailwind Tokens

- **Centralized Tokens**: We use a strict design system with Tailwind CSS v4 (defined centrally in the main CSS file, e.g., `index.css`). **No random "slop values" or arbitrary magic numbers** are allowed. You must use the centrally defined theme tokens for colors, spacing, and typography.
- **Reference `docs/styling.md`**: For the exact implementation details (e.g. OKLCH color spaces, dark mode setup, and token hierarchy), you MUST consult and follow the rules laid out in `docs/styling.md`.
