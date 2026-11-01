import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    const transactions = await prisma.transaction.findMany({
      where: { businessId: session.businessId },
      include: {
        customer: true,
        invoice: true,
        payment: true,
      },
      orderBy: { transactionDate: "desc" },
    });

    const rows = transactions.map((t) => ({
      id: t.id,
      date: t.transactionDate.toISOString().split("T")[0],
      description: t.description,
      customerName: t.customer?.name || "Direct Deposit",
      customerEmail: t.customer?.email || "N/A",
      invoiceNumber: t.invoice?.invoiceNumber || "N/A",
      externalReference: t.externalReference || "N/A",
      type: t.type,
      amount: Number(t.amount),
      currency: t.currency,
      status: t.status,
      isDemo: t.isDemo,
    }));

    if (format === "csv") {
      const header = "ID,Date,Customer,Email,Invoice,Reference,Type,Amount,Currency,Status\n";
      const csvContent = rows
        .map(
          (r) =>
            `"${r.id}","${r.date}","${r.customerName}","${r.customerEmail}","${r.invoiceNumber}","${r.externalReference}","${r.type}",${r.amount},"${r.currency}","${r.status}"`
        )
        .join("\n");

      return new NextResponse(header + csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="flowpilot_ledger.csv"',
        },
      });
    }

    return NextResponse.json({ rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

