import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { ContentList } from "@/components/dashboard/content-list";
import { getDashboardStats, getLeads, getProspects, getContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | GEOPlusMarketing",
};

export default async function DashboardPage() {
  const [stats, leads, prospects, content] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getProspects(),
    getContent(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Stats + Leads + Prospects (all client-managed for live updates) */}
      <DashboardClient leads={leads} prospects={prospects} stats={stats} />

      {/* Content */}
      <ContentList content={content} />
    </div>
  );
}
