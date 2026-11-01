# Devpost Project Submission — FlowPilot AI

## Inspiration
Freelancers, digital agency founders, and small merchants spend dozens of hours every month manually preparing invoices, generating payment checkout links, following up with late-paying customers, and reconciling scattered gateway statements. We asked: *What if a business owner could manage their entire financial operations through natural conversation with an autonomous agent that directly coordinates with PayPal?*

FlowPilot AI was built to fulfill this vision: a trustworthy, agentic commerce platform where businesses converse with an intelligent copilot that plans financial actions, requests authorization for high-impact decisions, executes operations via PayPal Sandbox, and verifies results in a single, unified operations center.

## What It Does
FlowPilot AI is an autonomous financial operations platform powered by PayPal Sandbox and deterministic AI agent orchestration:
1. **Natural Language Financial Operations**: Issues commands such as *"Create a $500 invoice for John for website development and prepare a PayPal payment link"*, and FlowPilot resolves or creates the client profile, generates the invoice in PostgreSQL, coordinates a PayPal Sandbox order, and returns a verified checkout URL.
2. **Verified State Tracking**: Ask *"Did John pay?"* to receive real-time status from the transaction ledger.
3. **Autonomous Delinquency Follow-ups**: Configurable workflows automatically queue polite payment reminders for overdue accounts and automatically cancel them the instant PayPal captures the payment.
4. **Explainable Reconciliation**: Scans transaction records to match PayPal captures with internal invoices using heuristic algorithms, highlighting discrepancies and orphaned deposits with confidence scores.
5. **AG Grid Community Ledger Intelligence**: Features a high-speed tabular ledger with column filtering, multi-level sorting, CSV export, and a slide-over transaction drawer inspector.
6. **Trustworthy Governance**: Classifies operations by risk level (Low, Medium, High). High-risk operations (captures, refunds, cancellations) are held in an Approvals Inbox requiring owner authorization.

## How We Built It
- **Frontend**: Next.js 14 App Router, React 18, Strict TypeScript, Tailwind CSS, Recharts, Lucide Icons, and AG Grid Community.
- **Backend**: Node.js, Next.js Server API Routes, Zod schema validation.
- **Database**: PostgreSQL 18 with Prisma ORM, implementing 26 normalized entities with Decimal currency precision.
- **Payments**: PayPal Orders API v2, PayPal Checkout, PayPal Captures, and PayPal Webhooks with cryptographic signature verification.
- **AI Agent**: Server-side multi-stage execution pipeline with 21 concrete tools and a visible 6-stage execution timeline.
- **Testing**: Comprehensive Vitest test suite with 20/20 passing tests including unit, integration, and the complete 13-step End-to-End lifecycle scenario.

## Challenges We Overcame
- **Preventing AI Hallucinations in Financial Operations**: We strictly separated LLM conversational synthesis from business logic execution. All calculations (revenue, overdue balances, collection rates) are computed directly in PostgreSQL via Zod-validated tool calls before text generation.
- **Safe Agentic Commerce**: Ensuring an autonomous agent cannot silently charge or refund customers. We created a 3-tier risk classification system with an Approvals Inbox where high-impact actions must be authorized by the human operator.
- **Payment Gateway Idempotency**: Handled race conditions between user browser return redirects and asynchronous PayPal webhook deliveries through unique event logging.

## Accomplishments We're Proud Of
- 100% test pass rate across 20 automated tests, including a 13-step End-to-End lifecycle test.
- Seamless, official PayPal Orders API v2 integration with instant Sandbox checkout generation.
- Full-featured AG Grid Community tabular intelligence for high-density financial data.
- 1-Click Demo Login with 8 customers, 20 invoices, and 30 transactions for immediate exploration by judges.

## What's Next for FlowPilot AI
- Multi-currency conversions for global cross-border payments.
- Automatic tax rate calculations and localized invoice templates.
- Redis-backed distributed queue for high-volume enterprise webhooks.

