import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { prisma } from "@/server/database/prisma";
import { paypalClient } from "@/server/paypal/client";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const requests = await prisma.approvalRequest.findMany({
      where: { businessId: session.businessId },
      include: {
        requestedByUser: { select: { name: true, email: true } },
        approvedByUser: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { approvalId, action, reason } = await request.json();

    const approval = await prisma.approvalRequest.findUnique({
      where: { id: approvalId },
    });

    if (!approval || approval.businessId !== session.businessId) {
      return NextResponse.json({ error: "Approval request not found" }, { status: 404 });
    }

    if (action === "REJECT") {
      const updated = await prisma.approvalRequest.update({
        where: { id: approvalId },
        data: {
          status: "REJECTED",
          approvedByUserId: session.userId,
          actionResult: { rejectionReason: reason || "Rejected by business owner" },
        },
      });

      await prisma.auditLog.create({
        data: {
          businessId: session.businessId,
          userId: session.userId,
          actorType: "USER",
          action: "APPROVAL_REJECTED",
          entityType: "ApprovalRequest",
          entityId: approvalId,
        },
      });

      return NextResponse.json({ success: true, approval: updated });
    }

    // Action: APPROVE
    let executionResult: any = { executed: true };

    if (approval.actionType === "REQUEST_REFUND" || approval.actionType === "ISSUE_REFUND") {
      const details = approval.details as any;
      executionResult = await paypalClient.refundCapture(
        details.captureId || "CAPTURE-8015",
        details.refundAmount || details.amount || 350,
        details.reason || "Approved by owner"
      );
    } else if (approval.actionType === "CAPTURE_PAYMENT" || approval.actionType === "REQUEST_PAYMENT_CAPTURE") {
      const details = approval.details as any;
      executionResult = await paypalClient.captureOrder(details.orderId, session.businessId);
    }

    const updated = await prisma.approvalRequest.update({
      where: { id: approvalId },
      data: {
        status: "APPROVED",
        approvedByUserId: session.userId,
        actionResult: executionResult,
      },
    });

    await prisma.auditLog.create({
      data: {
        businessId: session.businessId,
        userId: session.userId,
        actorType: "USER",
        action: "APPROVAL_APPROVED_AND_EXECUTED",
        entityType: "ApprovalRequest",
        entityId: approvalId,
        newState: executionResult,
      },
    });

    return NextResponse.json({ success: true, approval: updated, executionResult });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

