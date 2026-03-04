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
  const title = `${displayService} in ${displayCity} | GEOPlusMarketing`;
  const description = `Professional ${displayService.toLowerCase()} services in ${displayCity}. Licensed, insured, and trusted by the local community. Get a free quote today.`;

  return { title, description };
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
