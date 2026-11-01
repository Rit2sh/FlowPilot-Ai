import { describe, it, expect } from "vitest";
import { prisma } from "@/server/database/prisma";
import { paypalClient } from "@/server/paypal/client";
import { financialAgent } from "@/server/ai/agent";

describe("Complete End-to-End Financial Operations Scenario", () => {
  let businessId: string;
  let userId: string;
  let customerId: string;
  let invoiceId: string;
  let paypalOrderId: string;
  let captureId: string;

  it("1. Register a business & 2. Complete onboarding", async () => {
    const slug = `e2e-test-biz-${Date.now()}`;
    const user = await prisma.user.create({
      data: {
        email: `tester-${Date.now()}@flowpilot.ai`,
        name: "Test Founder",
        passwordHash: "mock-hash",
        role: "OWNER",
      },
    });
    userId = user.id;

    const business = await prisma.business.create({
      data: {
        name: "Test Financial Operations Co",
        slug,
        email: user.email,
        businessType: "AGENCY",
        country: "US",
        defaultCurrency: "USD",
      },
    });
    businessId = business.id;

    await prisma.businessMember.create({
      data: {
        businessId,
        userId,
        role: "OWNER",
      },
    });

    expect(business.id).toBeDefined();
    expect(business.slug).toBe(slug);
  });

  it("3. Open dashboard & verify initial state", async () => {
    const invoiceCount = await prisma.invoice.count({ where: { businessId } });
    expect(invoiceCount).toBe(0);
  });

  it("4. Create a customer", async () => {
    const customer = await prisma.customer.create({
      data: {
        businessId,
        name: "Acme Enterprises Inc",
        email: "billing@acme-enterprises.com",
        company: "Acme Enterprises Inc",
      },
    });
    customerId = customer.id;

    expect(customer.id).toBeDefined();
    expect(customer.email).toBe("billing@acme-enterprises.com");
  });

  it("5. Create an invoice & 6. Generate PayPal Sandbox Order", async () => {
    const invoice = await prisma.invoice.create({
      data: {
        businessId,
        customerId,
        invoiceNumber: "INV-E2E-001",
        status: "ISSUED",
        dueDate: new Date(Date.now() + 14 * 86400000),
        currency: "USD",
        subtotal: 500.0,
        totalAmount: 500.0,
        notes: "Full-Stack System Engineering Milestone 1",
        items: {
          create: [
            {
              description: "Milestone 1 Deliverables",
              quantity: 1,
              unitPrice: 500.0,
              amount: 500.0,
            },
          ],
        },
      },
    });
    invoiceId = invoice.id;

    // Generate PayPal Sandbox Order
    const order = await paypalClient.createOrder({
      businessId,
      invoiceId,
      amount: 500.0,
      currency: "USD",
      description: "INV-E2E-001: Milestone 1",
    });
    paypalOrderId = order.id;

    expect(order.id).toBeDefined();
    expect(order.approvalUrl).toContain("sandbox.paypal.com");

    const updatedInv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    expect(updatedInv?.paypalOrderId).toBe(paypalOrderId);
  });

  it("7. Complete Checkout & 8. Capture the payment", async () => {
    const capture = await paypalClient.captureOrder(paypalOrderId, businessId);
    captureId = capture.captureId;

    expect(capture.status).toBe("COMPLETED");
    expect(capture.captureId).toBeDefined();
  });

  it("9. Receive and verify the webhook event", async () => {
    const mockEvent = {
      id: `EVT-E2E-${Date.now()}`,
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      summary: "Payment capture completed",
      resource_type: "capture",
      resource: {
        id: captureId,
        supplementary_data: { related_ids: { order_id: paypalOrderId } },
      },
    };

    const isSigValid = await paypalClient.verifyWebhookSignature({
      authAlgo: "SHA256withRSA",
      certUrl: "https://api.sandbox.paypal.com/cert",
      transmissionId: "trans-e2e",
      transmissionSig: "sig-e2e",
      transmissionTime: new Date().toISOString(),
      webhookId: "WH-E2E",
      webhookEvent: mockEvent,
    });

    expect(isSigValid).toBe(true);
  });

  it("10. Verify invoice updated to PAID", async () => {
    const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
    expect(inv?.status).toBe("PAID");
    expect(Number(inv?.paidAmount)).toBe(500.0);
  });

  it("11. Verify dashboard revenue reflects settled payment", async () => {
    const paidInvoices = await prisma.invoice.findMany({
      where: { businessId, status: "PAID" },
    });
    const rev = paidInvoices.reduce((acc, i) => acc + Number(i.totalAmount), 0);
    expect(rev).toBe(500.0);
  });

  it("12. Ask AI about the transaction status", async () => {
    const response = await financialAgent.processInstruction({
      instruction: "Did Acme pay for invoice INV-E2E-001?",
      businessId,
      userId,
    });

    expect(response.content).toContain("Payment Verified");
    expect(response.content).toContain("INV-E2E-001");
    expect(response.steps.length).toBeGreaterThan(0);
  });

  it("13. Generate a reconciliation report", async () => {
    const report = await prisma.reconciliationRecord.findFirst({
      where: { businessId, invoiceId },
    });

    expect(report).not.toBeNull();
    expect(report?.status).toBe("MATCHED");
    expect(report?.matchType).toBe("EXACT");
    expect(Number(report?.confidenceScore)).toBe(1.0);
  });
});

