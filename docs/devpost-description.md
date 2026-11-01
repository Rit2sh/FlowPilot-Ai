# FlowPilot AI — Devpost Project Description
## PayPal AI Hackathon 2026: Build What's Next with PayPal and AI

### 1. Elevator Pitch
**FlowPilot AI** is an autonomous financial operations platform for freelancers and small businesses that replaces manual invoicing, fragmented billing tools, and awkward payment follow-ups with an intelligent AI copilot that plans operations, requests authorization, executes payments through PayPal Sandbox, and reconciles transactions with zero hallucinations.

---

### 2. The Problem
Freelancers and growing B2B agencies spend over 12 hours each week navigating fragmented billing interfaces:
- Manually creating invoices and copying checkout links across different tabs.
- Chasing overdue payments with time-consuming, repetitive reminder emails.
- Spending hours cross-referencing bank and PayPal transaction logs against unpaid invoices.
- Having no real-time conversational visibility into cash flow.

Generic AI chatbots cannot solve this because they hallucinate numbers and cannot reliably execute real payment transactions.

---

### 3. Our Solution: Agentic Commerce with Trustworthy Governance
FlowPilot AI bridges natural-language instruction with deterministic financial execution:
- **Natural Language Execution**: Say *"Create a $500 invoice for John for website development and prepare a PayPal payment link"*. FlowPilot resolves or creates the client, generates the invoice in PostgreSQL, calls PayPal's Orders API v2 in Sandbox, and renders a live checkout URL.
- **Database-Grounded Tracking**: Ask *"Did John pay?"* to receive real-time status verified against the PostgreSQL transaction ledger.
- **Autonomous Follow-ups**: Configurable reminder rules that chase overdue clients and auto-cancel the second PayPal captures the funds.
- **Explainable Reconciliation**: Scans deposits and matches PayPal captures to invoices with explainable confidence heuristics.
- **AG Grid Community Intelligence**: High-speed multi-column transaction filtering and CSV export.
- **Human-in-the-Loop Governance**: High-risk actions (captures, refunds, cancellations) are held in an Approvals Inbox for owner authorization.

---

### 4. How We Built It
- **Frontend**: Next.js 14 App Router, React 18, Strict TypeScript, Tailwind CSS, Recharts, Lucide Icons, AG Grid Community.
- **Backend**: Node.js, Next.js Server API Routes, Zod schema validation.
- **Database**: PostgreSQL 18 with Prisma ORM (26 normalized entities with Decimal currency precision).
- **Payments**: PayPal Developer Platform (Sandbox Orders API v2, Checkout, Captures, Webhooks signature verification).
- **AI Agent**: Server-side agent orchestration with 21 registered tools and visible 6-stage execution timeline.
- **Testing**: 20/20 Vitest automated tests passing including a 13-step End-to-End lifecycle scenario.

---

### 5. What Makes FlowPilot AI Different
1. **Explainable Financial Agent**: Real 6-stage timeline representing the actual steps executed.
2. **Deterministic Anti-Hallucination Engine**: All numbers are calculated in PostgreSQL before conversational synthesis.
3. **Genuine PayPal Sandbox Integration**: Real orders, approval links, and webhook verification.
4. **AG Grid Community Integration**: Enterprise-grade tabular financial intelligence.
5. **1-Click Judge Demo Mode**: Instant access with 8 pre-seeded customers, 20 invoices, and 30 transactions.

