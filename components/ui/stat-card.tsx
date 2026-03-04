import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                change.startsWith("+") ? "text-green-600" : "text-red-600"
              )}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">{icon}</div>
        )}
      </div>
    </div>
  );
}
