# FlowPilot AI — PayPal Sandbox Integration Guide

## 1. Official API Endpoints

- **OAuth2 Token**: `POST /v1/oauth2/token`
- **Orders API v2**: `POST /v2/checkout/orders`
- **Capture Order**: `POST /v2/checkout/orders/{id}/capture`
- **Webhook Signature Verification**: `POST /v1/notifications/verify-webhook-signature`
- **Refunds**: `POST /v2/payments/captures/{id}/refund`

## 2. Order Lifecycle Workflow

```
Customer Invoice Created
      ↓
POST /v2/checkout/orders
      ↓
Receive PayPal Order ID (e.g. ORD-8891)
      ↓
Present Approval URL to Customer
      ↓
Customer Approves via PayPal Sandbox
      ↓
POST /v2/checkout/orders/{id}/capture
      ↓
Webhook Event Received & Cryptographically Verified
      ↓
Update Local Payment, Invoice & Transaction Ledger
      ↓
Reconciliation Heuristic Matched
```

## 3. Idempotency & Webhook Handling

- Duplicate webhook IDs are checked against `PayPalWebhookEvent.eventId`. If a webhook has already been received, it is recorded and ignored to prevent duplicate ledger credits.
- Order captures check `PayPalCapture.captureId` before issuing capture requests to prevent duplicate charging.

