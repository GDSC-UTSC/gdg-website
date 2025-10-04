# Deployment Guide

We use Vercel. It automatically deploys when you push to GitHub.

---

## How It Works

1. **Create a PR** → Vercel creates a preview deployment
2. **Check the preview succeeds** → If it fails, fix the errors
3. **Merge to main** → Vercel deploys to production

**IMPORTANT:** Always make sure the Vercel preview deployment succeeds before merging your PR.

---

## What Does `npm run build` Do?

Builds your app for production:
- Compiles TypeScript
- Bundles and minifies code
- Optimizes CSS
- Pre-renders pages

If it fails, check the Vercel logs and run `npm run build` locally to see the error.

---

## Edge Runtime Limitations

Our routes run on Edge Runtime by default. This means:
- ❌ No sockets (WebSockets, Socket.io)
- ❌ No in-memory caching
- ❌ No file system operations
- ❌ No serverful features

**Learn more:** https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes

---

## Environment Variables

Add them on Vercel: **Settings** → **Environment Variables**

Make sure to add them for all environments (Production, Preview, Development).
