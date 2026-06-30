# Running the Project Locally

This guide covers the local development workflow for the ImgToSvg Animation app.

## Prerequisites

- Node.js 18 or newer.
- npm.

## Setup

Run commands from the repository root:

```bash
cd D:\imgtosvganimation
npm install
```

## Development Server

Start React Router's development server:

```bash
npm run dev
```

Open the localhost URL printed by the command, usually `http://localhost:5173`.

## Verification Commands

```bash
npm run typecheck
npm test
npm run format:check
npm run build
```

## Troubleshooting

- If the port is already in use, React Router or Vite will print the available URL. Use the URL from the terminal.
- If dependencies behave unexpectedly, remove `node_modules`, run `npm install`, then restart the dev server.
- Image conversion requires the server route, so use `npm run dev` or a production build instead of opening files directly in a browser.
