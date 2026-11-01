import { NextResponse } from "next/server";
import { aiProvider } from "@/server/ai/provider";

export async function GET() {
  const status = await aiProvider.checkStatus();
  return NextResponse.json(status);
}
