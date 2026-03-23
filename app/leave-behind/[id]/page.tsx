import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { PrintTrigger } from "./print-trigger";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "GEO+ AI Search Visibility", robots: "noindex" };
}

export default async function LeaveBehindPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let city = "Your City";
  let service = "Local Services";

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data: lead, error } = await supabase
        .from("leads")
        .select("city, service_requested")
        .eq("id", id)
        .single();

      if (error) {
        console.error("[Leave Behind] Supabase error:", error.message);
      }

      if (lead) {
        city = lead.city || city;
        service = lead.service_requested || service;
      }
    } catch (e) {
      console.error("[Leave Behind] Failed to fetch lead:", e);
    }
  }

  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        Leave-behind for <span className="font-semibold text-white">{service}</span> in{" "}
        <span className="font-semibold text-white">{city}</span>
        <span className="ml-3 text-slate-500">Print dialog will open automatically</span>
      </div>

      <div className="mx-auto max-w-[8in] px-8 py-6 print:px-0 print:py-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-600 pb-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              GEO<span className="text-blue-600">+</span>Marketing
            </h1>
            <p className="text-xs text-slate-500">AI Search Visibility Partner</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>geoplusmarketing.com</p>
            <p>info@geoplusmarketing.com</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-4 rounded-xl bg-slate-900 px-7 py-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
            AI Search Visibility for {service} in {city}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-white">
            Is AI Recommending Your Business?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
            80% of searchers now use AI summaries. When someone asks ChatGPT
            &ldquo;best {service.toLowerCase()} in {city}&rdquo;, will they hear
            about you — or your competitor?
          </p>
        </div>

        {/* The Problem — Stats */}
        <div className="mt-5">
          <h3 className="text-base font-bold text-slate-900">The AI Search Shift Is Here</h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
              <p className="text-2xl font-extrabold text-red-600">61%</p>
              <p className="mt-0.5 text-[10px] text-red-700/80">Drop in organic CTR with AI Overviews</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
              <p className="text-2xl font-extrabold text-amber-600">80%</p>
              <p className="mt-0.5 text-[10px] text-amber-700/80">Of searchers rely on AI summaries</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
              <p className="text-2xl font-extrabold text-blue-600">$750B</p>
              <p className="mt-0.5 text-[10px] text-blue-700/80">US revenue at risk by 2028</p>
            </div>
          </div>
        </div>

        {/* Why GEO Now */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3.5">
          <h3 className="text-sm font-bold text-amber-800">
            Why {service} Businesses in {city} Need GEO Now
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-amber-900/80">
            <li>AI engines are already recommending your competitors by name</li>
            <li>Once AI trusts a competitor, displacing them gets harder every month</li>
            <li>This is a first-mover market — optimize now to lock in the advantage</li>
            <li>GEO works alongside your existing SEO — no rip-and-replace</li>
          </ul>
        </div>

        {/* What We Do — 6 items in 2x3 grid */}
        <div className="mt-4">
          <h3 className="text-base font-bold text-slate-900">What GEO+ Does For You</h3>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            {[
              { title: "AI Visibility Scan", desc: "See how every major AI engine perceives your brand today." },
              { title: "Schema & Structured Data", desc: "JSON-LD markup so AI understands your services and location." },
              { title: "Content Optimization", desc: "Authority content that signals expertise to AI models." },
              { title: "Citation Consistency", desc: "Ensure your info matches everywhere AI looks." },
              { title: "Ongoing Monitoring", desc: "Weekly scans to track your visibility as models change." },
              { title: "Competitor Tracking", desc: "Know when competitors gain AI visibility and why." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-2 rounded-lg border border-slate-200 p-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3 w-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">{title}</p>
                  <p className="text-[10px] text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-5 rounded-xl bg-blue-600 px-7 py-5 text-center">
          <h3 className="text-xl font-extrabold text-white">
            Get Your Free AI Visibility Scan
          </h3>
          <p className="mt-1.5 text-sm text-blue-100">
            See exactly how AI engines perceive your brand. Results in 24 hours. No obligation.
          </p>
          <div className="mt-3 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-bold text-blue-600">
            geoplusmarketing.com/contact
          </div>
          <p className="mt-2 text-xs text-blue-200">
            (305) 555-1234 &middot; info@geoplusmarketing.com
          </p>
        </div>

        {/* Footer */}
        <div className="mt-3 border-t border-slate-200 pt-2 text-center text-[9px] text-slate-400">
          <p>GEOPlusMarketing &middot; AI Search Visibility &middot; geoplusmarketing.com &middot; Prepared {dateStr}</p>
        </div>
      </div>
    </>
  );
}
