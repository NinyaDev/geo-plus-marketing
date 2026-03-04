import Link from "next/link";

interface LandingTemplateProps {
  city: string;
  service: string;
  displayCity: string;
  displayService: string;
}

const faqs = [
  {
    q: "How quickly can you respond to service requests?",
    a: "We offer same-day service for most requests and 24/7 emergency availability. Our typical response time is under 2 hours.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes, we are fully licensed, bonded, and insured. We carry comprehensive liability and workers' compensation coverage.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Absolutely! We provide free, no-obligation estimates for all our services. Contact us today to schedule yours.",
  },
  {
    q: "What areas do you serve?",
    a: "We serve the entire metro area and surrounding communities within a 50-mile radius.",
  },
];

export function LandingTemplate({
  city,
  service,
  displayCity,
  displayService,
}: LandingTemplateProps) {
  const title = `${displayService} in ${displayCity}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dark pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]"
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            {displayCity} &middot; Trusted Local Experts
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
            Professional{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {displayService}
            </span>{" "}
            in {displayCity}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Looking for reliable {displayService.toLowerCase()} in {displayCity}?
            We deliver fast, professional service backed by 5-star reviews and
            years of local experience.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex h-14 items-center rounded-xl bg-accent px-8 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark"
            >
              Get a Free Quote Today
            </Link>
            <a
              href="tel:+13055551234"
              className="inline-flex h-14 items-center rounded-xl border border-slate-700 px-8 text-base font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Call (305) 555-1234
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Our {displayService} Services in {displayCity}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              `Emergency ${displayService}`,
              `Residential ${displayService}`,
              `Commercial ${displayService}`,
              "Inspections & Diagnostics",
              "Preventive Maintenance",
              "Installation & Upgrades",
            ].map((s) => (
              <div
                key={s}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900">{s}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why {displayCity} Trusts Us
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stat: "500+", label: "Jobs Completed" },
              { stat: "4.9★", label: "Customer Rating" },
              { stat: "24/7", label: "Availability" },
              { stat: "15+", label: "Years Experience" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-extrabold text-accent">{stat}</p>
                <p className="mt-1 text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-2xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-slate-900">
                  {q}
                  <span className="ml-2 text-slate-400 transition group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface-dark py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready for Expert {displayService} in {displayCity}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            Get a free quote today. No obligation, no pressure — just honest
            advice from {displayCity}&apos;s trusted professionals.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-14 items-center rounded-xl bg-accent px-10 text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-dark"
          >
            Get Your Free Quote
          </Link>
        </div>
      </section>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: `GEOPlusMarketing - ${title}`,
            description: `Professional ${displayService.toLowerCase()} services in ${displayCity}. Licensed, insured, and trusted by the local community.`,
            areaServed: {
              "@type": "City",
              name: displayCity,
            },
            serviceType: displayService,
            telephone: "+1-305-555-1234",
            url: `https://geoplusmarketing.com/landing/${city}/${service}`,
          }),
        }}
      />
    </>
  );
}
