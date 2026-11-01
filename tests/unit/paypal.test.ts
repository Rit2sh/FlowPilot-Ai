import { describe, it, expect, beforeAll } from "vitest";
import { paypalClient } from "@/server/paypal/client";
import { prisma } from "@/server/database/prisma";

describe("PayPal Sandbox Integration Module", () => {
  let businessId: string;

  beforeAll(async () => {
    let biz = await prisma.business.findFirst();
    if (!biz) {
      biz = await prisma.business.create({
        data: {
          name: "Test Ops",
          slug: `test-ops-${Date.now()}`,
          email: "test@ops.com",
        },
      });
    }
    businessId = biz.id;
  });

  it("should generate a valid PayPal Sandbox order with checkout URL", async () => {
    const order = await paypalClient.createOrder({
      businessId,
      amount: 450.0,
      currency: "USD",
      description: "Test Web Development Deliverable",
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe("CREATED");
    expect(order.approvalUrl).toContain("sandbox.paypal.com");
    expect(order.amount).toBe("450.00");
    expect(order.currency).toBe("USD");
  });

  it("should capture an approved order and generate capture identifiers", async () => {
    // Generate order first
    const order = await paypalClient.createOrder({
      businessId,
      amount: 250.0,
      currency: "USD",
      description: "Milestone payment",
    });

    // Capture
    const capture = await paypalClient.captureOrder(order.id, businessId);
    expect(capture.captureId).toBeDefined();
    expect(capture.status).toBe("COMPLETED");
    expect(capture.orderId).toBe(order.id);
  });

  it("should verify webhook signature payload parameters", async () => {
    const isValid = await paypalClient.verifyWebhookSignature({
      authAlgo: "SHA256withRSA",
      certUrl: "https://api.sandbox.paypal.com/v1/notifications/certs/CERT-123",
      transmissionId: "trans-abc-8891",
      transmissionSig: "SIGNATURE_HASH_XYZ",
      transmissionTime: new Date().toISOString(),
      webhookId: "WH-TEST-99",
      webhookEvent: { event_type: "PAYMENT.CAPTURE.COMPLETED" },
    });

    expect(isValid).toBe(true);
  });
});
