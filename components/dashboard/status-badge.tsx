"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

type LeadStatus = "lead" | "prospect" | "contacted";

const statusConfig: Record<LeadStatus, { label: string; bg: string; text: string }> = {
  lead: { label: "Lead", bg: "bg-green-100", text: "text-green-700" },
  prospect: { label: "Prospect", bg: "bg-blue-100", text: "text-blue-700" },
  contacted: { label: "Contacted", bg: "bg-amber-100", text: "text-amber-700" },
};

const allStatuses: LeadStatus[] = ["lead", "prospect", "contacted"];

interface StatusBadgeProps {
  id: string;
  status: LeadStatus;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

export function StatusBadge({ id, status, onStatusChange }: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const config = statusConfig[status] || statusConfig.prospect;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-80",
          config.bg,
          config.text
        )}
      >
        {config.label}
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {allStatuses
            .filter((s) => s !== status)
            .map((s) => {
              const c = statusConfig[s];
              return (
                <button
                  key={s}
                  onClick={() => {
                    onStatusChange(id, s);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-slate-50"
                >
                  <span className={cn("h-2 w-2 rounded-full", c.bg)} />
                  {c.label}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
