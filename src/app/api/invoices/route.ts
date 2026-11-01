import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";
import { paypalClient } from "@/server/paypal/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const invoices = await prisma.invoice.findMany({
      where: {
        businessId: session.businessId,
        ...(status ? { status: status as any } : {}),
        ...(query
          ? {
              OR: [
                { invoiceNumber: { contains: query, mode: "insensitive" } },
                { customer: { name: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        customer: true,
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { customerId, customerName, customerEmail, amount, description, dueDateDays } = body;

    let targetCustomerId = customerId;
    if (!targetCustomerId && (customerName || customerEmail)) {
      const cust = await prisma.customer.create({
        data: {
          businessId: session.businessId,
          name: customerName || "Direct Client",
          email: customerEmail || `billing-${Date.now()}@client.example.com`,
          company: customerName,
        },
      });
      targetCustomerId = cust.id;
    }

    if (!targetCustomerId) {
      const firstCust = await prisma.customer.findFirst({ where: { businessId: session.businessId } });
      if (!firstCust) throw new Error("No customer available. Please specify customer details.");
      targetCustomerId = firstCust.id;
    }

    const count = await prisma.invoice.count({ where: { businessId: session.businessId } });
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const numAmount = parseFloat(amount || "100");
    const dueDate = new Date(Date.now() + (dueDateDays || 14) * 86400000);

    const invoice = await prisma.invoice.create({
      data: {
        businessId: session.businessId,
        customerId: targetCustomerId,
        invoiceNumber,
        status: "ISSUED",
        dueDate,
        currency: "USD",
        subtotal: numAmount,
        totalAmount: numAmount,
        notes: description || "Professional Services & Engineering",
        items: {
          create: [
            {
              description: description || "Professional Services & Deliverables",
              quantity: 1,
              unitPrice: numAmount,
              amount: numAmount,
            },
          ],
        },
      },
      include: { customer: true, items: true },
    });

    // Generate verified PayPal Sandbox Order Link
    const ppOrder = await paypalClient.createOrder({
      businessId: session.businessId,
      invoiceId: invoice.id,
      amount: numAmount,
      currency: "USD",
      description: `${invoiceNumber}: ${description || "Services"}`,
    });

    const updated = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paypalOrderId: ppOrder.id,
        checkoutUrl: ppOrder.approvalUrl,
      },
      include: { customer: true, items: true },
    });

    return NextResponse.json({ invoice: updated, paypalOrder: ppOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

