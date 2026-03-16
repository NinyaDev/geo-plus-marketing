"use client";

import { useRouter } from "next/navigation";
import { LeadsTable } from "./leads-table";
import { ProspectsTable } from "./prospects-table";
import type { Lead } from "@/lib/data/demo-data";

interface DashboardClientProps {
  leads: Lead[];
  prospects: Lead[];
}

export function DashboardClient({ leads, prospects }: DashboardClientProps) {
  const router = useRouter();

  async function handleStatusChange(id: string, newStatus: Lead["status"]) {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!res.ok) {
        console.error("Failed to update status:", await res.text());
      }

      // Refresh server data after a short delay to let revalidation happen
      setTimeout(() => router.refresh(), 500);
    } catch (err) {
      console.error("Status update error:", err);
    }
  }

  return (
    <div className="space-y-6">
      <LeadsTable leads={leads} onStatusChange={handleStatusChange} />
      <ProspectsTable prospects={prospects} onStatusChange={handleStatusChange} />
    </div>
  );
}
