import { NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { hashPassword, signSessionToken, setSessionCookie } from "@/server/security/auth";

export async function POST(request: Request) {
  try {
    const { email, password, name, businessName } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const slug = (businessName || `${name}'s Workspace`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now().toString(36)}`;

    // Create user and business in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: "OWNER",
        },
      });

      const business = await tx.business.create({
        data: {
          name: businessName || `${name}'s Operations`,
          slug,
          email,
        },
      });

      await tx.businessMember.create({
        data: {
          businessId: business.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      return { user, business };
    });

    const sessionPayload = {
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
      businessId: result.business.id,
      businessName: result.business.name,
      role: "OWNER",
    };

    const token = await signSessionToken(sessionPayload);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionPayload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}

