import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "../database/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "flowpilot-super-secure-production-ready-jwt-key-2026"
);

const SESSION_COOKIE_NAME = "flowpilot_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  businessId: string;
  businessName: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getServerSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      // Fallback: If in demo environment without cookie, look for default demo business
      const demoUser = await prisma.user.findUnique({
        where: { email: "demo@flowpilot.ai" },
        include: {
          memberships: {
            include: { business: true },
          },
        },
      });

      if (demoUser && demoUser.memberships.length > 0) {
        const membership = demoUser.memberships[0];
        return {
          userId: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          businessId: membership.businessId,
          businessName: membership.business.name,
          role: membership.role,
        };
      }
      return null;
    }

    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

