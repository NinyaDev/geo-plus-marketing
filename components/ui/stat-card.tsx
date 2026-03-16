import { cn } from "@/lib/utils/cn";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  accentColor?: "green" | "blue" | "purple" | "amber";
  className?: string;
}

const accentStyles = {
  green: {
    border: "border-l-green-500",
    iconBg: "bg-green-50",
    iconText: "text-green-600",
    valueTint: "text-green-700",
  },
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    valueTint: "text-blue-700",
  },
  purple: {
    border: "border-l-purple-500",
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    valueTint: "text-purple-700",
  },
  amber: {
    border: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    valueTint: "text-amber-700",
  },
};

export function StatCard({
  label,
  value,
  change,
  icon,
  accentColor,
  className,
}: StatCardProps) {
  const accent = accentColor ? accentStyles[accentColor] : null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md",
        accent && `border-l-4 ${accent.border}`,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p
            className={cn(
              "mt-1 text-3xl font-bold",
              accent ? accent.valueTint : "text-slate-900"
            )}
          >
            {value}
          </p>
          {change && (
            <p className="mt-1 text-sm font-medium text-slate-400">
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "rounded-xl p-3",
              accent ? `${accent.iconBg} ${accent.iconText}` : "bg-blue-50 text-blue-600"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
