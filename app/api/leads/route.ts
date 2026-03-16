import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { createLead } from "@/lib/data/leads";
import { isGhlConfigured, syncContactToGhl, addNoteToContact } from "@/lib/ghl/client";
import { isSupabaseConfigured, getSupabaseAdmin } from "@/lib/supabase/client";

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

    // 1. Save to Supabase (or mock) — map form fields to DB columns
    const result = await createLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service_requested: data.service_type,
      city: data.city,
      notes: data.message,
      metadata: data.business_name ? { business_name: data.business_name } : {},
      business_id: null,
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

    revalidatePath("/dashboard");
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

/** Convert a prospect to a lead and optionally sync to GHL */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== "convert") {
      return NextResponse.json({ error: "id and action='convert' required" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch the prospect
    const { data: prospect, error: fetchErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !prospect) {
      return NextResponse.json({ error: "Prospect not found" }, { status: 404 });
    }

    // Update status to "new" (real lead)
    const { error: updateErr } = await supabase
      .from("leads")
      .update({ status: "new" })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Sync to GHL if configured and has email
    let ghlContactId: string | undefined;
    if (isGhlConfigured() && prospect.email) {
      const nameParts = (prospect.name || "").split(" ");
      const ghlResult = await syncContactToGhl({
        firstName: nameParts[0] || "Unknown",
        lastName: nameParts.slice(1).join(" ") || undefined,
        email: prospect.email,
        phone: prospect.phone,
        source: "GEOPlusMarketing Prospect Conversion",
        tags: ["geoplus-lead", "converted-prospect"],
      }).catch(() => ({ success: false as const, error: "GHL sync failed" }));

      if (ghlResult.success && "contactId" in ghlResult) {
        ghlContactId = ghlResult.contactId;
      }
    }

    revalidatePath("/dashboard");
    return NextResponse.json({
      success: true,
      converted: true,
      ghlContactId,
    });
  } catch {
    return NextResponse.json({ error: "Failed to convert prospect" }, { status: 500 });
  }
}
