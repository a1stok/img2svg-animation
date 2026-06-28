# Deployment Guide

This project is fully optimized to be deployed on **Vercel** right out of the box, as it uses Vite for its build toolchain.

## Deploying to Vercel (Automatic / Recommended)

The easiest way to deploy this portfolio is to connect your GitHub repository directly to Vercel.

1. **Push to GitHub:**
   Ensure all your latest changes are pushed to your `main` branch.

2. **Connect to Vercel:**
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
   - Click **Add New...** -> **Project**.
   - Import your GitHub repository.

3. **Configure Project Settings:**
   Vercel will automatically detect that you are using Vite, but ensure the settings look like this:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend-new` (CRITICAL: Because the Vite project lives inside the `frontend-new` folder, you MUST set the Root Directory to `frontend-new`).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Deploy:**
   Click **Deploy**. Vercel will build the project and assign you a live URL. Every future push to `main` will automatically trigger a new deployment.
