import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const business = await prisma.business.findUnique({
      where: { id: session.businessId },
      include: {
        connectedAccounts: true,
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    return NextResponse.json({ business });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, email, paypalEmail } = body;

    const updated = await prisma.business.update({
      where: { id: session.businessId },
      data: {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
      },
    });

    if (paypalEmail) {
      await prisma.connectedAccount.upsert({
        where: {
          businessId_provider_environment: {
            businessId: session.businessId,
            provider: "PAYPAL",
            environment: "SANDBOX",
          },
        },
        update: { accountEmail: paypalEmail, status: "CONNECTED" },
        create: {
          businessId: session.businessId,
          provider: "PAYPAL",
          accountEmail: paypalEmail,
          status: "CONNECTED",
          environment: "SANDBOX",
        },
      });
    }

    return NextResponse.json({ success: true, business: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

