import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createLead } from "@/lib/data/leads";
import { isGhlConfigured, syncContactToGhl, addNoteToContact } from "@/lib/ghl/client";

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Valid email is required"),
  phone: z.string().optional().default(""),
  business_name: z.string().optional().default(""),
  service_type: z.string().min(1, "Service type is required"),
  city: z.string().min(1, "City is required"),
  message: z.string().optional().default(""),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 1. Save to Supabase (or mock)
    const result = await createLead({
      ...data,
      business_id: "biz_001",
      source: "contact_form",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // 2. Sync to GoHighLevel (non-blocking — don't fail the request if GHL is down)
    let ghlContactId: string | undefined;
    if (isGhlConfigured()) {
      const nameParts = data.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const ghlResult = await syncContactToGhl({
        firstName,
        lastName,
        email: data.email,
        phone: data.phone,
        companyName: data.business_name,
        source: "GEOPlusMarketing Website",
        tags: ["geoplus-lead", "website-contact", data.service_type],
      }).catch((err) => {
        console.error("[GHL] Sync failed:", err);
        return { success: false as const, error: String(err) };
      });

      if (ghlResult.success && ghlResult.contactId) {
        ghlContactId = ghlResult.contactId;

        // Attach lead details as a note
        const note = [
          `Service: ${data.service_type}`,
          `City: ${data.city}`,
          data.business_name && `Business: ${data.business_name}`,
          data.message && `Message: ${data.message}`,
          `Source: Website Contact Form`,
          `Lead ID: ${result.lead?.id}`,
        ]
          .filter(Boolean)
          .join("\n");

        addNoteToContact(ghlContactId, note).catch(console.error);
      }
    }

    return NextResponse.json({
      success: true,
      lead: result.lead,
      ...(ghlContactId ? { ghlContactId } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
