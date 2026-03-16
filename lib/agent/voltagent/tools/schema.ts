import { tool } from "ai";
import { z } from "zod";
import { getOrCreateBusinessId } from "./helpers";

export const generateSchemaTool = tool({
  description:
    "Generate JSON-LD structured data (schema.org) for a local service business. Produces valid LocalBusiness or industry-specific schema markup ready to paste into a website.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    businessName: z.string().describe("Business name"),
    service: z.string().describe("Primary service type"),
    city: z.string().describe("City"),
    state: z.string().optional().describe("State"),
    zipCode: z.string().optional().describe("ZIP code"),
    streetAddress: z.string().optional().describe("Street address"),
    phone: z.string().optional().describe("Phone number"),
    website: z.string().optional().describe("Website URL"),
    googleBusinessUrl: z.string().optional().describe("Google Business Profile URL"),
    openingHours: z
      .string()
      .optional()
      .describe("Opening hours (e.g., 'Mo-Fr 08:00-18:00')"),
    priceRange: z
      .string()
      .optional()
      .describe("Price range (e.g., '$$')"),
    description: z.string().optional().describe("Business description"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    // Map common service types to schema.org types
    const schemaTypeMap: Record<string, string> = {
      plumber: "Plumber",
      plumbing: "Plumber",
      electrician: "Electrician",
      hvac: "HVACBusiness",
      dentist: "Dentist",
      dental: "Dentist",
      lawyer: "Attorney",
      attorney: "Attorney",
      locksmith: "Locksmith",
      roofing: "RoofingContractor",
      roofer: "RoofingContractor",
      painting: "HousePainter",
      painter: "HousePainter",
      moving: "MovingCompany",
      mover: "MovingCompany",
    };

    const serviceKey = params.service.toLowerCase();
    const schemaType =
      Object.entries(schemaTypeMap).find(([key]) =>
        serviceKey.includes(key)
      )?.[1] || "LocalBusiness";

    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: params.businessName,
      description:
        params.description ||
        `${params.businessName} provides professional ${params.service} services in ${params.city}${params.state ? `, ${params.state}` : ""}.`,
      url: params.website,
      telephone: params.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: params.city,
        addressRegion: params.state,
        postalCode: params.zipCode,
        ...(params.streetAddress && { streetAddress: params.streetAddress }),
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        description: `${params.city}${params.state ? `, ${params.state}` : ""} area`,
      },
      areaServed: {
        "@type": "City",
        name: params.city,
      },
      ...(params.priceRange && { priceRange: params.priceRange }),
      ...(params.openingHours && {
        openingHoursSpecification: parseOpeningHours(params.openingHours),
      }),
      ...(params.googleBusinessUrl && {
        sameAs: [params.googleBusinessUrl],
      }),
    };

    // Remove undefined values
    const cleanSchema = JSON.parse(JSON.stringify(schema));
    const jsonLd = JSON.stringify(cleanSchema, null, 2);

    const htmlSnippet = `<script type="application/ld+json">\n${jsonLd}\n</script>`;

    return {
      success: true,
      schemaType,
      jsonLd,
      htmlSnippet,
      message: `Generated ${schemaType} JSON-LD schema. Paste the HTML snippet into your website's <head> section.`,
    };
  },
});

function parseOpeningHours(
  hours: string
): Array<{ "@type": string; dayOfWeek: string[]; opens: string; closes: string }> {
  const dayMap: Record<string, string> = {
    Mo: "Monday",
    Tu: "Tuesday",
    We: "Wednesday",
    Th: "Thursday",
    Fr: "Friday",
    Sa: "Saturday",
    Su: "Sunday",
  };

  // Parse formats like "Mo-Fr 08:00-18:00"
  const match = hours.match(/^([A-Za-z,-]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/);
  if (!match) {
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:00",
        closes: "17:00",
      },
    ];
  }

  const [, dayRange, opens, closes] = match;
  const days: string[] = [];

  if (dayRange.includes("-")) {
    const [start, end] = dayRange.split("-");
    const allDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const startIdx = allDays.indexOf(start);
    const endIdx = allDays.indexOf(end);
    if (startIdx >= 0 && endIdx >= 0) {
      for (let i = startIdx; i <= endIdx; i++) {
        days.push(dayMap[allDays[i]]);
      }
    }
  } else {
    for (const d of dayRange.split(",")) {
      if (dayMap[d]) days.push(dayMap[d]);
    }
  }

  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: days,
      opens,
      closes,
    },
  ];
}
