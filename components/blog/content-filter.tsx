"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const filters = [
  { label: "All", value: "" },
  { label: "Blog", value: "blog" },
  { label: "Social", value: "social" },
  { label: "Landing", value: "landing" },
  { label: "Email", value: "email" },
];

export function ContentFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("type") ?? "";

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            if (filter.value) {
              params.set("type", filter.value);
            } else {
              params.delete("type");
            }
            router.push(`/blog?${params.toString()}`);
          }}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            active === filter.value
              ? "bg-accent text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
