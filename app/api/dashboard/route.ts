import { NextResponse } from "next/server";
import { getDashboardStats, getLeads, getContent, getCampaigns } from "@/lib/data";

export async function GET() {
  const [stats, leads, content, campaigns] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getContent(),
    getCampaigns(),
  ]);

  return NextResponse.json({ stats, leads, content, campaigns });
}
