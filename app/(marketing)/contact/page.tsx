import { LeadForm } from "@/components/contact/lead-form";

export const metadata = {
  title: "Get Your Free AI Visibility Scan | GEOPlusMarketing",
  description:
    "Find out how AI search engines see your brand. Get a free scan showing your visibility across ChatGPT, Perplexity, Google AI, and more.",
};

export default function ContactPage() {
  return (
    <section className="bg-surface pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">
            Free AI Visibility Scan
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Find Out If AI Can Find&nbsp;You
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Tell us about your business and we&apos;ll scan your brand across
            every major AI engine. You&apos;ll get a real visibility score and
            a prioritized action plan within 24 hours.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <LeadForm />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Phone", value: "(305) 555-1234", href: "tel:+13055551234" },
            { label: "Email", value: "info@geoplusmarketing.com", href: "mailto:info@geoplusmarketing.com" },
            { label: "Hours", value: "Mon–Fri 8am–6pm EST", href: null },
          ].map(({ label, value, href }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="mt-1 block text-sm font-semibold text-accent hover:underline"
                >
                  {value}
                </a>
              ) : (
                <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
