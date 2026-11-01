import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    const customers = await prisma.customer.findMany({
      where: {
        businessId: session.businessId,
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
                { company: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        invoices: {
          select: { status: true, totalAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const enriched = customers.map((c) => {
      const totalBilled = c.invoices.reduce((acc, i) => acc + Number(i.totalAmount), 0);
      const totalPaid = c.invoices
        .filter((i) => i.status === "PAID")
        .reduce((acc, i) => acc + Number(i.totalAmount), 0);
      const outstanding = c.invoices
        .filter((i) => i.status === "OVERDUE" || i.status === "PENDING" || i.status === "ISSUED")
        .reduce((acc, i) => acc + Number(i.totalAmount), 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        address: c.address,
        isDemo: c.isDemo,
        totalBilled,
        totalPaid,
        outstanding,
        invoiceCount: c.invoices.length,
        createdAt: c.createdAt,
      };
    });

    return NextResponse.json({ customers: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, phone, company, address, notes } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        businessId: session.businessId,
        name,
        email,
        phone,
        company: company || name,
        address,
        notes,
        isDemo: false,
      },
    });

    return NextResponse.json({ customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

