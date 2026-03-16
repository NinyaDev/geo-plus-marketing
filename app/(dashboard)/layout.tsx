import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <DashboardTopbar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
