import { LandingTemplate } from "@/components/landing/landing-template";
import type { Metadata } from "next";

function toDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  const { city, service } = await params;
  const displayCity = toDisplayName(city);
  const displayService = toDisplayName(service);
  const title = `Is Your ${displayService} Business Visible to AI in ${displayCity}? | GEOPlusMarketing`;
  const description = `80% of searchers use AI summaries. Find out if ChatGPT, Perplexity, and Google AI recommend your ${displayService.toLowerCase()} business in ${displayCity}. Get a free AI visibility scan.`;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city, service } = await params;
  const displayCity = toDisplayName(city);
  const displayService = toDisplayName(service);

  return (
    <LandingTemplate
      city={city}
      service={service}
      displayCity={displayCity}
      displayService={displayService}
    />
  );
}
