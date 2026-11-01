import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signSessionToken, verifySessionToken } from "@/server/security/auth";
import { hasPermission } from "@/server/security/permissions";

describe("Authentication & Security Module", () => {
  it("should securely hash and verify passwords using bcrypt", async () => {
    const raw = "SuperSecretPassword123!";
    const hashed = await hashPassword(raw);

    expect(hashed).not.toBe(raw);
    expect(await verifyPassword(raw, hashed)).toBe(true);
    expect(await verifyPassword("WrongPassword", hashed)).toBe(false);
  });

  it("should sign and verify valid JWT session tokens", async () => {
    const payload = {
      userId: "usr-123",
      email: "alex@apexdigital.io",
      name: "Alex Vance",
      businessId: "biz-456",
      businessName: "Apex Digital Dynamics",
      role: "OWNER",
    };

    const token = await signSessionToken(payload);
    expect(token).toBeDefined();

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe("OWNER");
  });

  it("should enforce role-based permissions hierarchy correctly", () => {
    expect(hasPermission("OWNER", "ADMIN")).toBe(true);
    expect(hasPermission("ADMIN", "MEMBER")).toBe(true);
    expect(hasPermission("MEMBER", "VIEWER")).toBe(true);
    expect(hasPermission("VIEWER", "ADMIN")).toBe(false);
    expect(hasPermission("MEMBER", "OWNER")).toBe(false);
  });
});

