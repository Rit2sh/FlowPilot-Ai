import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { paypalClient } from "@/server/paypal/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { amount, description, invoiceId, currency } = body;

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    const order = await paypalClient.createOrder({
      businessId: session.businessId,
      invoiceId,
      amount,
      currency: currency || "USD",
      description: description || "FlowPilot Invoice Payment",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

