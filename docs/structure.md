# Project Structure

This repo is a React Router v7 application rooted at `D:\imgtosvganimation`. There is no nested frontend folder.

## Directory Layout

- `app/`: Application source loaded by React Router.
- `app/routes/`: Route modules. `_index.tsx` owns the single-page app experience. `api.convert.ts` owns the server conversion endpoint.
- `app/features/`: Feature-owned UI and hooks. Current features are `uploader`, `potrace`, and `animator`.
- `app/components/ui/`: Reusable UI primitives and small visual utilities. Prefer headless Radix primitives plus Tailwind classes here.
- `app/services/`: Server-side domain services. `potrace-service.ts` is used by the conversion API and must stay out of the client bundle.
- `app/lib/`: Shared utilities that are not feature-specific.
- `app/assets/`: App-local static assets imported by source files.
- `public/`: Files served as public assets without bundling.
- `docs/`: Project documentation, conventions, roadmap, deployment, and PRD material.
- `.agents/skills/`: Project-local agent workflows and references.

## Ownership Rules

- Keep upload behavior under `app/features/uploader`.
- Keep trace configuration UI and conversion state under `app/features/potrace`.
- Keep SVG animation preview, Anime.js code generation, and export controls under `app/features/animator`.
- Keep server-only conversion logic in `app/services` and call it from route actions.
- Add reusable UI primitives to `app/components/ui` only when more than one feature can reasonably share them.
- Co-locate focused tests beside the module they verify using the `*.test.ts` or `*.test.tsx` suffix.
