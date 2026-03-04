import Link from "next/link";

export function DashboardTopbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Mobile brand */}
      <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-900 lg:hidden">
        GEO<span className="text-accent">Plus</span>
      </Link>
      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-slate-900"
        >
          View Site
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
          SP
        </div>
      </div>
    </header>
  );
}
