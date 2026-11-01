import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const records = await prisma.reconciliationRecord.findMany({
      where: { businessId: session.businessId },
      include: {
        transaction: true,
        payment: true,
        invoice: {
          include: { customer: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const total = records.length;
    const matched = records.filter((r) => r.status === "MATCHED").length;
    const discrepancies = records.filter((r) => r.status === "DISCREPANCY").length;
    const unmatched = records.filter((r) => r.status === "UNMATCHED").length;
    const health = total > 0 ? ((matched / total) * 100).toFixed(1) : "100.0";

    return NextResponse.json({
      records,
      stats: {
        total,
        matched,
        discrepancies,
        unmatched,
        health: `${health}%`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { recordId, invoiceId, notes } = await request.json();

    if (!recordId) {
      return NextResponse.json({ error: "recordId is required" }, { status: 400 });
    }

    const updated = await prisma.reconciliationRecord.update({
      where: { id: recordId },
      data: {
        ...(invoiceId ? { invoiceId } : {}),
        status: "RESOLVED",
        matchType: "MANUAL",
        confidenceScore: 1.00,
        resolvedByUserId: session.userId,
        resolvedAt: new Date(),
        notes: notes || "Reconciled and confirmed by operator",
      },
      include: { transaction: true, invoice: true },
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

