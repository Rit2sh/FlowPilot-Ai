import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/server/database/prisma";
import { paypalClient } from "@/server/paypal/client";

export async function POST(request: Request) {
  try {
    const headerList = headers();
    const authAlgo = headerList.get("paypal-auth-algo") || "";
    const certUrl = headerList.get("paypal-cert-url") || "";
    const transmissionId = headerList.get("paypal-transmission-id") || "";
    const transmissionSig = headerList.get("paypal-transmission-sig") || "";
    const transmissionTime = headerList.get("paypal-transmission-time") || "";

    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    const eventId = event.id || `MOCK-EVT-${Date.now()}`;
    const eventType = event.event_type || "UNKNOWN";
    const resourceType = event.resource_type || "capture";
    const resourceId = event.resource?.id || "N/A";

    // 1. Idempotency Check: Check if duplicate webhook event already received
    const existingEvent = await prisma.payPalWebhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent) {
      console.warn(`[PayPal Webhook] Duplicate event ignored: ${eventId}`);
      return NextResponse.json({ status: "DUPLICATE_IGNORED" }, { status: 200 });
    }

    // 2. Verify signature
    const isValid = await paypalClient.verifyWebhookSignature({
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookId: process.env.PAYPAL_WEBHOOK_ID || "",
      webhookEvent: event,
    });

    // 3. Store Webhook Event Record
    await prisma.payPalWebhookEvent.create({
      data: {
        eventId,
        eventType,
        summary: event.summary || `PayPal ${eventType}`,
        resourceType,
        resourceId,
        status: isValid ? "VERIFIED" : "RECEIVED",
        signatureValid: isValid,
        payload: event,
        processedAt: new Date(),
      },
    });

    // 4. Process event types
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const orderId = capture.supplementary_data?.related_ids?.order_id;
      if (orderId) {
        // Resolve order in DB
        const ppOrder = await prisma.payPalOrder.findUnique({
          where: { paypalOrderId: orderId },
        });

        if (ppOrder) {
          await paypalClient.captureOrder(orderId, ppOrder.businessId);
        }
      }
    }

    return NextResponse.json({ status: "SUCCESS", eventId, signatureValid: isValid });
  } catch (error: any) {
    console.error("[PayPal Webhook Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

