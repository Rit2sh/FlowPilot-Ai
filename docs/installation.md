# FlowPilot AI — Complete Installation & Setup Guide

This guide covers setting up and running **FlowPilot AI** locally, with Docker Compose, or deploying to Vercel and cloud PostgreSQL.

---

## Prerequisites

- **Node.js**: v18.17+ or v20+
- **npm** or **pnpm**
- **PostgreSQL**: v14+ (or Docker)
- **PayPal Developer Account**: [https://developer.paypal.com](https://developer.paypal.com) (free sandbox client ID and secret)

---

## Method 1: Local Development (Fastest)

### 1. Clone the Repository
```bash
git clone https://github.com/Rit2sh/FlowPilot-Ai.git
cd FlowPilot-Ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your database connection string and PayPal sandbox credentials are set:
```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flowpilot?schema=public"
NEXTAUTH_SECRET="flowpilot-super-secret-production-key-change-me"
NEXTAUTH_URL="http://localhost:3000"

# PayPal Sandbox API Credentials
PAYPAL_CLIENT_ID="your_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
PAYPAL_ENVIRONMENT="sandbox"

# AI Provider Configuration (Ollama, Gemini, or Mock Rule Engine)
AI_PROVIDER="mock"
```

### 4. Database Setup & Seeding
```bash
# Push schema migrations
npx prisma db push

# Seed realistic demo data (customers, invoices, transactions)
npm run db:seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Method 2: Docker Compose Setup

Run the full application and a dedicated PostgreSQL container with a single command:

```bash
docker-compose up --build
```
This automatically:
1. Spawns PostgreSQL on port `5432` with healthcheck verification.
2. Runs Prisma migrations and database seeders.
3. Launches the optimized Next.js production server on port `3000`.

---

## Method 3: Deploy to Vercel & Neon / Supabase

FlowPilot AI is pre-configured with `"postinstall": "prisma generate"` for zero-configuration Vercel deployments.

1. Push your repository to GitHub.
2. Import the project into **Vercel** ([https://vercel.com/new](https://vercel.com/new)).
3. Provision a serverless PostgreSQL instance on **Neon** ([https://neon.tech](https://neon.tech)) or **Supabase** ([https://supabase.com](https://supabase.com)).
4. Configure the Environment Variables in your Vercel Project Settings:
   - `DATABASE_URL` (direct connection string)
   - `NEXTAUTH_SECRET` (generate using `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (`https://your-app.vercel.app`)
   - `PAYPAL_CLIENT_ID` (Sandbox Client ID from PayPal Developer Dashboard)
   - `PAYPAL_CLIENT_SECRET` (Sandbox Secret)
   - `PAYPAL_ENVIRONMENT` (`sandbox`)
   - `AI_PROVIDER` (`gemini` or `mock`)
   - `GEMINI_API_KEY` (if using Gemini AI)
5. Deploy! Vercel will build the Next.js App Router project and generate Prisma clients automatically.
6. Once deployed, run the seed script once against your cloud database:
   ```bash
   DATABASE_URL="your-cloud-db-url" npm run db:seed
   ```

---

## Pre-Configured Demo Credentials

For quick evaluation and hackathon testing:

- **Email:** `ritesh@flowpilot.ai`
- **Password:** `Demo1234!`
- **Role:** Business Owner (`Apex Digital Dynamics`)
- **Default Currency:** USD ($)

