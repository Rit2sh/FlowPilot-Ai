# FlowPilot AI — Vercel & Production Deployment Guide

## 1. Hosting on Vercel

FlowPilot AI is built with Next.js 14 App Router and is optimized for zero-configuration deployment on Vercel.

### Step 1: Push to GitHub
Ensure your repository is pushed to GitHub (e.g. `https://github.com/Rit2sh/FlowPilot-Ai`). Note that `.env` is intentionally excluded from Git to prevent secret exposure.

### Step 2: Import Project into Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository: `Rit2sh/FlowPilot-Ai`.
4. Framework Preset: **Next.js** (automatically detected).
5. Build Command: `npm run build` (or left default).
6. Install Command: `npm install` (runs `postinstall: prisma generate` automatically).

### Step 3: Configure Environment Variables in Vercel
In the Vercel Dashboard under **Project Settings > Environment Variables**, add:

| Variable | Value Description |
|---|---|
| `DATABASE_URL` | Your managed PostgreSQL connection string (Neon, Supabase, Vercel Postgres, or Render PG) e.g., `postgresql://user:password@host:5432/flowpilot?sslmode=require` |
| `AUTH_SECRET` | 32+ character random secret string |
| `NEXTAUTH_SECRET` | Same as `AUTH_SECRET` |
| `NEXTAUTH_URL` | Your production Vercel URL (e.g. `https://flowpilot-ai.vercel.app`) |
| `PAYPAL_CLIENT_ID` | PayPal Sandbox Client ID (or Live for production) |
| `PAYPAL_CLIENT_SECRET` | PayPal Sandbox Client Secret |
| `PAYPAL_BASE_URL` | `https://api-m.sandbox.paypal.com` |
| `PAYPAL_WEBHOOK_ID` | Your registered PayPal webhook ID |
| `AI_PROVIDER` | `mock` (for built-in deterministic engine) or `gemini` |
| `GEMINI_API_KEY` | (Optional) Your Google Gemini API Key |
| `NEXT_PUBLIC_APP_URL` | Your production domain (e.g. `https://flowpilot-ai.vercel.app`) |
| `NEXT_PUBLIC_ENVIRONMENT`| `sandbox` |

### Step 4: Run Database Migrations / Schema Push
For your cloud PostgreSQL database, run:
```bash
npx prisma db push
node prisma/seed.js
```
This initializes all 26 entities and seeds the demo business workspace.
