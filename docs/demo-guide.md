# FlowPilot AI — Hackathon Judge Testing Guide

## 1. Quick Start (1-Click Demo)

1. Open `http://localhost:3000`
2. Click **"Explore Demo"** or navigate to `/login`
3. Click the bright green **"Log In as Demo Founder (1-Click)"** button:
   - **Email**: `demo@flowpilot.ai`
   - **Password**: `Demo1234!`
4. You will arrive directly at the Command Center dashboard pre-loaded with:
   - 8 B2B Enterprise Client Profiles
   - 20 Invoices across Paid, Pending, Overdue, and Draft lifecycles
   - 30 Ledger Transactions & PayPal Captures
   - Active PayPal Sandbox connection badge

---

## 2. Core Interactive Demo Scenarios

### Scenario A: Natural Language Invoice Creation with PayPal Checkout
1. Navigate to **AI Agent** (`/dashboard/agent`).
2. Type or click:
   > *"Create a $500 invoice for John for website development and prepare a PayPal payment link."*
3. Watch the visible 6-stage execution timeline:
   - `Understanding Request`
   - `Execution Plan Prepared`
   - `Retrieving Records`
   - `Executing Financial Operation`
   - `Verifying Outcome`
   - `Operation Complete`
4. The agent creates the invoice, links it in the database, and renders an official **"Pay Now via PayPal"** checkout card.

### Scenario B: Payment Verification ("Did John Pay?")
1. In the agent prompt, type:
   > *"Did John pay?"*
2. The agent executes `get_payment_status`, queries the database ledger in real time, and explains that the payment is currently `PENDING` awaiting checkout completion.

### Scenario C: Overdue Account Follow-up & Governance Approval
1. Type:
   > *"Show all customers who haven't paid"*
2. FlowPilot retrieves the 3 delinquent accounts ($10,600 total overdue).
3. Type:
   > *"Prepare a payment reminder for overdue customers"*
4. The agent detects a high-impact operation and displays an **Authorization Required Card**.
5. Click **"Authorize & Execute"** or open the **Approvals Inbox** (`/dashboard/approvals`) to review the governance audit log.

### Scenario D: AG Grid Payment Ledger
1. Open **Payments** (`/dashboard/payments`).
2. Explore AG Grid Community's high-speed sorting, column filters, and search.
3. Click **"Export CSV"** to download the ledger spreadsheet.
4. Click **"Details →"** on any row to open the Transaction Inspector drawer.

### Scenario E: Reconciliation & Audit Engine
1. Open **Reconciliation** (`/dashboard/reconciliation`).
2. Review the 1-to-1 matches, confidence scores, and identified discrepancies.
3. Click **"Resolve"** on an unmatched deposit to observe autonomous ledger reconciliation in action.

