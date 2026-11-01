import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { paypalClient } from "@/server/paypal/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const capture = await paypalClient.captureOrder(orderId, session.businessId);

    return NextResponse.json(capture);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

