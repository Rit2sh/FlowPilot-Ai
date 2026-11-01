import { SessionPayload } from "./auth";

export const ROLE_HIERARCHY: Record<string, number> = {
  VIEWER: 1,
  MEMBER: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function hasPermission(userRole: string, requiredRole: "VIEWER" | "MEMBER" | "ADMIN" | "OWNER"): boolean {
  const currentLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return currentLevel >= requiredLevel;
}

export function enforceBusinessIsolation(session: SessionPayload, targetBusinessId: string) {
  if (session.businessId !== targetBusinessId) {
    throw new Error("Unauthorized: Access to another business's data is strictly forbidden.");
  }
}

