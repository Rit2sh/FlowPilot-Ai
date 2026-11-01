import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rules = await prisma.automationRule.findMany({
      where: { businessId: session.businessId },
      include: {
        executions: {
          take: 5,
          orderBy: { executedAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const reminders = await prisma.reminder.findMany({
      where: { businessId: session.businessId },
      include: {
        customer: true,
        invoice: true,
      },
      orderBy: { scheduledFor: "asc" },
    });

    return NextResponse.json({ rules, reminders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, ruleId, name, description, triggerEvent, actionType } = body;

    if (action === "toggle") {
      const existing = await prisma.automationRule.findUnique({ where: { id: ruleId } });
      if (!existing) return NextResponse.json({ error: "Rule not found" }, { status: 404 });

      const updated = await prisma.automationRule.update({
        where: { id: ruleId },
        data: { isEnabled: !existing.isEnabled },
      });
      return NextResponse.json({ rule: updated });
    }

    const newRule = await prisma.automationRule.create({
      data: {
        businessId: session.businessId,
        name: name || "New Automation Rule",
        description: description || "Automated payment follow-up workflow",
        triggerEvent: triggerEvent || "INVOICE_OVERDUE",
        conditionConfig: { daysOverdue: 3 },
        actionType: actionType || "PREPARE_DRAFT_REMINDER",
        actionConfig: { channel: "EMAIL", requireApproval: true },
        isEnabled: true,
      },
    });

    return NextResponse.json({ rule: newRule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

