# Naming & Component Conventions

## File Naming

- React component files use kebab-case filenames, for example `image-uploader.tsx` and `svg-player.tsx`.
- Hook files use kebab-case filenames and export a camelCase hook, for example `use-potrace.ts` exporting `usePotrace`.
- Route files follow React Router route naming, for example `_index.tsx` and `api.convert.ts`.
- Test files sit next to the module they verify and use `*.test.ts` or `*.test.tsx`.
- Type-only modules use clear names like `types.ts` when the types are shared inside a feature.
- Utility files use kebab-case filenames and named exports.

## TypeScript

- Use TypeScript for all application code.
- Prefer explicit exported prop types for public components, for example `SvgPlayerProps`.
- Validate route and API boundaries with Zod.
- Avoid `any`. When a third-party package type forces it, keep the use narrow and leave a short explanation.
- Use named exports for feature modules and utilities.

## React Components

- Keep components focused on one responsibility.
- Move feature state into feature hooks when it coordinates network calls, debouncing, or request cancellation.
- Use controlled Radix primitives for form controls.
- Keep visible error feedback user-facing and concise. Current conversion errors surface through `sonner` toasts.
- Do not add default boilerplate folders such as `src/pages` or `src/router`; React Router owns routing through `app/routes`.

## Tests

- Test externally visible behavior, not implementation details.
- Prefer unit tests for validation, pure service behavior, and generated output.
- Use React Testing Library for user-facing component behavior.
