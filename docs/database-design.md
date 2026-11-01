# FlowPilot AI — Database Design

## 1. Schema Principles

- **Engine**: PostgreSQL 18
- **Primary Keys**: UUID v4 across all entities
- **Monetary Precision**: `Decimal(12, 2)` for amounts, fee calculations, and balances (never floating-point numbers)
- **Multi-Tenancy**: Strict `businessId` foreign keys and unique composite indices for multi-tenant isolation
- **Auditing**: Dedicated `AuditLog`, `AIToolExecution`, and `PayPalWebhookEvent` tables.

## 2. Entity Map (26 Models)

1. `User`: Account credentials, bcrypt hash, role, global profile.
2. `Business`: Organization tenant, default currency (USD), country, timezone.
3. `BusinessMember`: Role-based membership linking Users to Businesses.
4. `Customer`: B2B client profile, billing contacts, company name, notes.
5. `CustomerContact`: Multiple contacts per client entity.
6. `Invoice`: Financial billing documents with lifecycles (`DRAFT`, `ISSUED`, `PENDING`, `PAID`, `OVERDUE`, `CANCELLED`).
7. `InvoiceItem`: Line item descriptions, quantities, and unit prices.
8. `Payment`: Completed or pending payment captures.
9. `PaymentAttempt`: Gateway attempts and error logs.
10. `PayPalOrder`: Direct PayPal Orders API v2 order records with approval URLs.
11. `PayPalCapture`: Settled capture records, transaction fees, and net balances.
12. `PayPalWebhookEvent`: Raw webhook payloads with signature validation status and idempotency guarantees.
13. `Refund`: Partial or full refunds associated with payment captures.
14. `Transaction`: Consolidated financial ledger entries (`INCOMING_PAYMENT`, `REFUND`, `ADJUSTMENT`, `FEE`).
15. `ReconciliationRecord`: 1-to-1 matching heuristics between external PayPal records and local invoices.
16. `Reminder`: Queued follow-up notices with cancellation upon payment capture.
17. `AutomationRule`: Event-driven automation rules.
18. `AutomationExecution`: Logged automation triggers and execution outcomes.
19. `AIConversation`: Conversational sessions with the AI agent.
20. `AIMessage`: Messages exchanged within agent conversations.
21. `AIToolExecution`: Concrete tool executions with arguments and durations.
22. `ApprovalRequest`: Human-in-the-loop authorization inbox items for high-risk operations.
23. `AuditLog`: Immutable action logs with actor type (`USER`, `AI_AGENT`, `SYSTEM`, `PAYPAL_WEBHOOK`).
24. `Notification`: In-app system alerts and notifications.
25. `ConnectedAccount`: Connected payment provider credentials and sandbox environments.
26. `BackgroundJob`: Database-backed resilient job queue for background workers.

