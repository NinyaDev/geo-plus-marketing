import { StatCard } from "@/components/ui/stat-card";
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
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Leads"
          value={stats.total_leads}
        />
        <StatCard
          label="Prospects"
          value={stats.total_prospects}
        />
        <StatCard
          label="Published Content"
          value={`${stats.published_content}/${stats.total_content}`}
        />
      </div>

      {/* Leads + Prospects tables with clickable status */}
      <DashboardClient leads={leads} prospects={prospects} />

      {/* Content */}
      <ContentList content={content} />
    </div>
  );
}
