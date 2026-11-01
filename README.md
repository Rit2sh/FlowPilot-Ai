<div align="center">

# FlowPilot AI
### Autonomous Financial Operations Agent for Modern Commerce

**"Tell FlowPilot what needs to happen. It plans the operation, asks for authorization, executes it through PayPal and verifies the result."**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PayPal](https://img.shields.io/badge/PayPal-Sandbox_v2-003087?style=flat&logo=paypal)](https://developer.paypal.com/)
[![AG Grid](https://img.shields.io/badge/AG_Grid-Community-00F59B?style=flat)](https://www.ag-grid.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

</div>

---

## 1. Project Introduction

**FlowPilot AI** is an enterprise-grade Autonomous Financial Operations Platform designed for freelancers, digital agencies, consultancies, and online merchants. It replaces fragmented billing tools, spreadsheets, and manual customer follow-ups with an intelligent AI copilot that performs verified financial operations through official PayPal APIs.

---

## 2. Problem Statement

Small businesses and freelancers spend **12+ hours each week** manually:
- Drafting and dispatching invoices across disjointed tools
- Manually creating payment links and tracking customer checkout returns
- Chasing overdue payments with awkward manual reminders
- Reconciling bank and payment gateway transactions against invoices
- Deciphering cash flow without real-time financial intelligence

Most existing solutions are either passive dashboards with static buttons or generic chatbots disconnected from real payment networks.

---

## 3. Our Solution

FlowPilot AI introduces **Agentic Commerce with Human-in-the-Loop Governance**:
1. **Natural Language Operation**: Tell the agent *"Create a $500 invoice for John for website development and prepare a PayPal payment link"*.
2. **Deterministic Tool Execution**: FlowPilot parses intent, creates verified records in PostgreSQL, invokes PayPal Orders API v2, and presents a live checkout URL.
3. **Continuous Tracking**: Ask *"Did John pay?"* to receive real-time verified ledger status without hallucinations.
4. **Autonomous Follow-ups**: Delinquent accounts automatically trigger polite reminders, which cancel instantly when PayPal confirms payment capture.
5. **Ledger Reconciliation**: Matches external deposits to invoices with explainable confidence heuristics.

---

## 4. Key Features

- **Natural Language Financial Agent**: 21 registered, Zod-validated server-side tools.
- **Visible 6-Stage Execution Timeline**: Understands request → Retrieves records → Prepares plan → Evaluates risk → Executes tool → Verifies outcome.
- **PayPal Sandbox Orders v2 & Capture**: Direct API integration with idempotency and cryptographic webhook signature verification.
- **AG Grid Payment Intelligence Ledger**: High-speed table with multi-column filtering, sorting, CSV export, and drawer inspector.
- **Automated Overdue Chasing**: Smart reminder rules that pause immediately when payment is captured.
- **Explainable Reconciliation**: Discrepancy detection, confidence scoring, and 1-click manual match resolution.
- **Human-in-the-Loop Approvals**: Sensitive operations (captures, refunds, cancellations) are held in an approvals inbox for owner confirmation.

---

## 5. Visual Identity & Product Screenshots

FlowPilot AI follows a bespoke dark fintech visual identity:
- **Background**: Deep obsidian navy (`#080D1A`, `#0D1629`)
- **Accents**: Electric green glow (`#00F59B`) and emerald green (`#10B981`)
- **Typography**: Clean hierarchy with high contrast and readable mono data tables

---

## 6. Architecture

```mermaid
flowchart TD
    User([Business Owner]) -->|Prompt| UI[Next.js App Router Frontend]
    UI --> AgentCore[Financial Agent Engine]
    AgentCore --> ToolRegistry[Zod Tool Definitions]
    ToolRegistry --> RiskGate{Risk Evaluator}
    RiskGate -->|High Risk| ApprovalsQueue[Approvals Inbox]
    RiskGate -->|Low / Medium| ExecutionPipeline[Execution Pipeline]
    ApprovalsQueue -->|Owner Authorizes| ExecutionPipeline
    ExecutionPipeline --> PayPal[PayPal Sandbox API v2]
    ExecutionPipeline --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL 18)]
    PayPal -->|Webhooks| WebhookListener[Webhook Verification]
    WebhookListener --> Prisma
```

---

## 7. Technology Stack

- **Frontend**: Next.js 14 App Router, React 18, Strict TypeScript, Tailwind CSS, Lucide icons, Recharts, AG Grid Community.
- **Backend**: Node.js, Next.js Server API Routes, Zod schema validation.
- **Database**: PostgreSQL 18 with Prisma ORM (26 normalized entities with Decimal precision).
- **Authentication**: JWT session tokens signed with `jose` (HS256), bcryptjs password hashing, secure HTTP-only cookies.
- **Payments**: PayPal Orders API v2, PayPal Checkout, PayPal Captures, Webhooks signature verification.
- **Testing**: Vitest with unit, integration, and full 13-step E2E scenarios.

---

## 8. PayPal Integration

- **Environment**: Official PayPal Developer Sandbox (`https://api-m.sandbox.paypal.com`)
- **Endpoints**:
  - `POST /v1/oauth2/token`
  - `POST /v2/checkout/orders`
  - `POST /v2/checkout/orders/{id}/capture`
  - `POST /v1/notifications/verify-webhook-signature`
  - `POST /v2/payments/captures/{id}/refund`
- **Idempotency**: Webhook events checked via unique `eventId` in `PayPalWebhookEvent`. Double capture attempts blocked by inspecting existing capture IDs.
- **Sandbox Notice**: Clearly marked with Sandbox badges across all views; never implies simulated money is real.

---

## 9. AI Agent Architecture

FlowPilot AI uses structured schema calling with deterministic validation:
- **Risk Classification**:
  - **LOW**: Read-only queries (revenue, invoices, customers, transaction history).
  - **MEDIUM**: Draft invoices, prepared reminders, payment links.
  - **HIGH**: Payment capture, refund issuance, cancellation of financial obligations.
- **Execution Workflow**:
  `Instruction` → `Intent Classification` → `Context Retrieval` → `Structured Plan` → `Risk Gate` → `Tool Execution` → `Result Verification` → `Database Update` → `Audit Log` → `Grounded Response`.
- **Anti-Hallucination**: Financial numbers are calculated directly in PostgreSQL before text synthesis.

---

## 10. Database Design

26 normalized entities:
1. `User` 2. `Business` 3. `BusinessMember` 4. `Customer` 5. `CustomerContact` 6. `Invoice` 7. `InvoiceItem` 8. `Payment` 9. `PaymentAttempt` 10. `PayPalOrder` 11. `PayPalCapture` 12. `PayPalWebhookEvent` 13. `Refund` 14. `Transaction` 15. `ReconciliationRecord` 16. `Reminder` 17. `AutomationRule` 18. `AutomationExecution` 19. `AIConversation` 20. `AIMessage` 21. `AIToolExecution` 22. `ApprovalRequest` 23. `AuditLog` 24. `Notification` 25. `ConnectedAccount` 26. `BackgroundJob`.

---

## 11. Installation

```bash
# Clone the repository
git clone https://github.com/your-username/flowpilot-ai.git
cd flowpilot-ai

# Install dependencies
npm install
```

---

## 12. Environment Variables

Create `.env` in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/flowpilot?schema=public"
AUTH_SECRET="your-32-char-random-secret-key"
NEXTAUTH_SECRET="your-32-char-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

PAYPAL_CLIENT_ID="your_paypal_sandbox_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_sandbox_client_secret"
PAYPAL_BASE_URL="https://api-m.sandbox.paypal.com"
PAYPAL_WEBHOOK_ID="your_webhook_id"

AI_PROVIDER="gemini"
GEMINI_API_KEY="your_gemini_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 13. Running Locally

```bash
# 1. Push database schema to PostgreSQL
npx prisma db push

# 2. Seed realistic demo data
node prisma/seed.js

# 3. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 14. Running Tests

```bash
# Run Vitest test suite (20/20 passing)
npm run test
```

Includes unit tests for authentication, PayPal integration, AI tool schemas, and the full 13-step End-to-End integration scenario.

---

## 15. Demo Account Instructions

Judges can explore the application instantly without configuring external APIs:
- **Login URL**: `http://localhost:3000/login`
- **1-Click Button**: Click **"Log In as Demo Founder (1-Click)"**
- **Credentials**:
  - Email: `demo@flowpilot.ai`
  - Password: `Demo1234!`

---

## 16. Deployment

Deployable to **Render**, **Railway**, **Vercel**, or **Fly.io** with managed PostgreSQL:
```bash
# Production Build
npm run build

# Start Production Server
npm start
```

---

## 17. Security Considerations

- Passwords hashed using `bcryptjs` with salt factor 10.
- JWT tokens signed with HS256 and stored in HTTP-only, SameSite lax cookies.
- Business-level tenant isolation enforced on every database query.
- Cryptographic verification for PayPal webhook headers.
- Secrets never exposed to client-side bundles.

---

## 18. Known Limitations

- Production payment capture requires switching `PAYPAL_BASE_URL` to `https://api-m.paypal.com` with live business credentials.
- In-memory rate limiting can be upgraded to Redis in enterprise deployments.

---

## 19. AI Tools Used & Contribution

Built with assistance from advanced agentic engineering for architecture scaffolding, schema normalization, and test writing, followed by rigorous manual review, verification, and automated testing.

---

## 20. License

Released under the [MIT License](LICENSE).
