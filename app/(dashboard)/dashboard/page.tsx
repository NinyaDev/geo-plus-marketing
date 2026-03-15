import { StatCard } from "@/components/ui/stat-card";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { ContentList } from "@/components/dashboard/content-list";
import { CampaignStatus } from "@/components/dashboard/campaign-status";
import { getDashboardStats, getLeads, getContent, getCampaigns } from "@/lib/data";
import { formatCurrency } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | GEOPlusMarketing",
};

export default async function DashboardPage() {
  const [stats, leads, content, campaigns] = await Promise.all([
    getDashboardStats(),
    getLeads(),
    getContent(),
    getCampaigns(),
  ]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Leads"
          value={stats.total_leads}
          change={`+${stats.leads_this_month} this month`}
        />
        <StatCard
          label="Conversion Rate"
          value={`${stats.conversion_rate}%`}
          change="+2.3% vs last month"
        />
        <StatCard
          label="Published Content"
          value={`${stats.published_content}/${stats.total_content}`}
        />
        <StatCard
          label="Campaign Revenue"
          value={formatCurrency(stats.total_revenue)}
          change={`${stats.active_campaigns} active`}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LeadsTable leads={leads} />
        <div className="space-y-6">
          <CampaignStatus campaigns={campaigns} />
          <ContentList content={content} />
        </div>
      </div>
    </div>
  );
}
