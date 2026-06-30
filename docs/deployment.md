# Deployment Guide

The app is a React Router v7 project with server-side image conversion. Deployment must support Node server execution because `/api/convert` uses `sharp` and `potrace`.

## Build

Run from the repository root:

```bash
npm run build
```

The build command runs `react-router build`.

## Vercel

Vercel can host the project from the repository root.

- Framework preset: React Router if available, otherwise use the Vite-compatible Node setup Vercel detects.
- Root directory: repository root.
- Install command: `npm install`.
- Build command: `npm run build`.

## Runtime Notes

- The conversion endpoint is stateless.
- Uploaded images are processed in memory and are not stored.
- The production environment must be able to install native dependencies required by `sharp`.
