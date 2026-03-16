import { NextResponse } from "next/server";
import { getDashboardStats, getLeads, getProspects, getContent } from "@/lib/data";

export async function GET() {
  const [stats, leads, prospects, content] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getProspects(),
    getContent(),
  ]);

  return NextResponse.json({ stats, leads, prospects, content });
}
