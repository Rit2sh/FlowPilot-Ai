import { NextResponse } from "next/server";
import { aiProvider } from "@/server/ai/provider";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await aiProvider.checkStatus();
  return NextResponse.json(status);
}

