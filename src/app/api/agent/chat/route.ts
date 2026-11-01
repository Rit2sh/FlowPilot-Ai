import { NextResponse } from "next/server";
import { getServerSession } from "@/server/security/auth";
import { financialAgent } from "@/server/ai/agent";
import { prisma } from "@/server/database/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationId } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const response = await financialAgent.processInstruction({
      instruction: message,
      conversationId,
      businessId: session.businessId,
      userId: session.userId,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[Agent Chat Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed processing agent instruction." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversationId");

    if (conversationId) {
      const messages = await prisma.aIMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
      });
      return NextResponse.json({ messages });
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { businessId: session.businessId },
      include: {
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

