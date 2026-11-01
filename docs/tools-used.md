# FlowPilot AI — Detailed Tools & Technology Explanation

This document details how each tool, runtime, and sponsor library was integrated into FlowPilot AI for the **PayPal AI Hackathon 2026**.

---

### 1. PayPal Developer Platform (Core Requirement)
- **Role**: Payment Gateway & Checkout Engine (Sandbox).
- **Integration**:
  - `POST /v2/checkout/orders` generates verified orders with intent `CAPTURE` and approval checkout links.
  - `POST /v2/checkout/orders/{id}/capture` executes server-side order captures upon customer approval.
  - `POST /v1/notifications/verify-webhook-signature` cryptographically verifies transmission signatures and prevents replay attacks.
  - `POST /v2/payments/captures/{id}/refund` executes partial/full authorized refunds.

---

### 2. AG Grid Community (Featured Sponsor Category)
- **Role**: High-Performance Payment Intelligence Ledger.
- **Integration**: Powers `/dashboard/payments` with:
  - Custom dark theme styling matching our obsidian navy visual identity.
  - Column-specific filtering (`agDateColumnFilter`, `agNumberColumnFilter`, `agTextColumnFilter`).
  - Multi-column sort, quick search, and custom cell renderers for status badges and transaction drawer inspection.

---

### 3. Postman (Sponsor Category)
- **Role**: API Testing & Verification Suite.
- **Integration**:
  - Provided as `postman/FlowPilot_AI.postman_collection.json`.
  - Encompasses authentication, PayPal Orders API, capture, webhook simulation with cryptographic headers, AI agent chat, and ledger export endpoints.

---

### 4. AI Engine (Ollama / Gemini / Deterministic Provider)
- **Role**: Autonomous Financial Agent Orchestration.
- **Integration**:
  - Provider abstraction in `src/server/ai/provider.ts` supporting local **Ollama** instances (`http://localhost:11434`), **Google Gemini 1.5 Flash**, or zero-latency deterministic heuristics.
  - 21 server-side Zod-validated tools across customers, invoices, payments, analytics, reconciliation, and follow-ups.

---

### 5. PostgreSQL 18 & Prisma ORM
- **Role**: Relational Database & Financial Persistence.
- **Integration**:
  - 26 normalized entities with UUID primary keys and `Decimal(12,2)` precision fields.
  - Enforces tenant isolation, idempotency checks on webhook IDs, and audit logging.

---

### 6. Next.js 14 App Router & React 18
- **Role**: Full-Stack Monolithic Architecture.
- **Integration**:
  - Server components for SEO-optimized marketing pages.
  - Client components for interactive agent timelines, approval dialogs, and real-time dashboard data.
  - 18 Next.js Server API routes handling PayPal and Agent business logic.

---

### 7. Recharts
- **Role**: Financial Data Visualization.
- **Integration**: Renders monthly revenue area curves, collection rates, and portfolio lifecycle distribution charts in `/dashboard` and `/dashboard/analytics`.

---

### 8. Vitest
- **Role**: Automated Testing Harness.
- **Integration**:
  - 20/20 automated tests passing across `tests/unit/auth.test.ts`, `tests/unit/paypal.test.ts`, `tests/unit/ai-agent.test.ts`, and `tests/integration/e2e-scenario.test.ts`.
