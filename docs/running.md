# Running the Project Locally

This guide covers how to spin up the local development environment for the portfolio. The process is identical across **Windows** and **macOS**.

## Prerequisites

- **Node.js**: Ensure you have Node 18+ installed.
- **npm**: Comes bundled with Node.js.

## Getting Started

1. **Navigate to the frontend directory:**
   Open your terminal (PowerShell/CMD on Windows, Terminal on Mac) and run:

   ```bash
   cd frontend-new
   ```

2. **Install Dependencies:**
   If this is your first time, or if `package.json` has changed, install the dependencies:

   ```bash
   npm install
   ```

3. **Start the Development Server:**
   Launch Vite's hot-reloading dev server:

   ```bash
   npm run dev
   ```

4. **View the Site:**
   Open your browser and navigate to the localhost URL provided in the terminal (usually `http://localhost:5173` or `http://localhost:5174`).

## Troubleshooting

- **Port in use:** If the port is taken, Vite will automatically try the next available port. Check your terminal output.
- **Dependency Issues:** If you encounter weird React hook errors, try clearing the Vite cache and reinstalling:
  ```bash
  rm -rf node_modules package-lock.json # On Mac
  Remove-Item -Recurse -Force node_modules, package-lock.json # On Windows
  npm install
  npm run dev -- --force
  ```
