import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { PrintTrigger } from "../../[id]/print-trigger";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Lead Details Sheet", robots: "noindex" };
}

function formatPhone(phone?: string | null): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function LeadSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured()) return notFound();

  let lead: Record<string, unknown> | null = null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[Lead Sheet] Supabase error:", error.message);
      return notFound();
    }
    lead = data;
  } catch (e) {
    console.error("[Lead Sheet] Failed to fetch lead:", e);
    return notFound();
  }

  if (!lead) return notFound();

  const meta = (lead.metadata || {}) as Record<string, unknown>;
  const name = String(lead.name || "Unknown");
  const businessName = String(meta.business_name || "—");
  const email = String(lead.email || "—");
  const phone = formatPhone(lead.phone as string);
  const city = String(lead.city || "—");
  const service = String(lead.service_requested || "—");
  const source = String(lead.source || "—");
  const status = String(lead.status || "—");
  const notes = String(lead.notes || "");
  const score = lead.quality_score ? `${lead.quality_score}/10` : "—";
  const created = formatDate(lead.created_at as string);
  const website = String(meta.website_url || lead.website_url || "—");

  return (
    <>
      <PrintTrigger />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page { size: letter; margin: 0.5in; }
            @media print {
              body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .no-print { display: none !important; }
            }
          `,
        }}
      />

      {/* Top bar (hidden on print) */}
      <div className="no-print bg-slate-900 px-6 py-3 text-center text-sm text-slate-300">
        Lead sheet for <span className="font-semibold text-white">{name}</span>
        <span className="ml-3 text-slate-500">Print dialog will open automatically</span>
      </div>

      <div className="mx-auto max-w-[8in] px-8 py-6 print:px-0 print:py-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-600 pb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              GEO<span className="text-blue-600">+</span>Marketing
            </h1>
            <p className="text-sm text-slate-500">Lead Details — Internal Use</p>
          </div>
          <p className="text-xs text-slate-400">Generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>

        {/* Lead Name Banner */}
        <div className="mt-5 rounded-xl bg-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white">{name}</h2>
              {businessName !== "—" && (
                <p className="mt-0.5 text-sm text-slate-400">{businessName}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
                {status}
              </span>
              {score !== "—" && (
                <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-300">
                  Score: {score}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="mt-5">
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Email", value: email },
              { label: "Phone", value: phone },
              { label: "City", value: city },
              { label: "Service Requested", value: service },
              { label: "Source", value: source },
              { label: "Added", value: created },
              { label: "Website", value: website },
              { label: "Business", value: businessName },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-slate-200 px-3.5 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">Notes</h3>
          <div className="min-h-[100px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            {notes ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{notes}</p>
            ) : (
              <p className="text-sm italic text-slate-400">No notes recorded</p>
            )}
          </div>
        </div>

        {/* Blank area for handwritten notes — flex-grow to fill remaining page */}
        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-400">Follow-up Notes</h3>
          <div className="min-h-[160px] flex-1 rounded-lg border-2 border-dashed border-slate-200 px-4 py-3">
            <p className="text-[10px] text-slate-300">Use this space for handwritten follow-up notes</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t border-slate-200 pt-2.5 text-center text-[10px] text-slate-400">
          <p>INTERNAL USE ONLY — GEOPlusMarketing Lead Sheet</p>
        </div>
      </div>
    </>
  );
}
