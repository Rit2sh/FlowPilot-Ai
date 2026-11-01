import { NextResponse } from "next/server";
import { prisma } from "@/server/database/prisma";
import { verifyPassword, signSessionToken, setSessionCookie } from "@/server/security/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: { business: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const primaryMembership = user.memberships[0];
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      businessId: primaryMembership ? primaryMembership.businessId : "",
      businessName: primaryMembership ? primaryMembership.business.name : "My Business",
      role: primaryMembership ? primaryMembership.role : "OWNER",
    };

    const token = await signSessionToken(sessionPayload);
    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: sessionPayload,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}

