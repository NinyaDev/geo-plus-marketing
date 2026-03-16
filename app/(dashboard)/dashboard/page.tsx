import { StatCard } from "@/components/ui/stat-card";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { ContentList } from "@/components/dashboard/content-list";
import { getDashboardStats, getLeads, getProspects, getContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | GEOPlusMarketing",
};

function LeadsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ProspectsIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );
}

export default async function DashboardPage() {
  const [stats, leads, prospects, content] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getProspects(),
    getContent(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Leads"
          value={stats.total_leads}
          accentColor="green"
          icon={<LeadsIcon />}
        />
        <StatCard
          label="Prospects"
          value={stats.total_prospects}
          accentColor="blue"
          icon={<ProspectsIcon />}
        />
        <StatCard
          label="Published Content"
          value={`${stats.published_content}/${stats.total_content}`}
          accentColor="purple"
          icon={<ContentIcon />}
        />
      </div>

      {/* Leads + Prospects tables with clickable status + GHL Sync */}
      <DashboardClient leads={leads} prospects={prospects} />

      {/* Content */}
      <ContentList content={content} />
    </div>
  );
}
