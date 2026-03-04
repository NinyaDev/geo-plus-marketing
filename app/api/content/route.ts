import { NextResponse } from "next/server";
import { getContent } from "@/lib/data/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;

  const content = await getContent({ type, status: "published" });
  return NextResponse.json({ content });
}
