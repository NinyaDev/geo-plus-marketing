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

/** Bulk sync all records from leads table to GHL as contacts */
export async function PUT() {
  try {
    if (!isGhlConfigured()) {
      console.error("[GHL Sync] Not configured — missing GHL_PIT or GHL_LOCATION_ID");
      return NextResponse.json({ error: "GoHighLevel not configured (missing GHL_PIT or GHL_LOCATION_ID)" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      console.error("[GHL Sync] Supabase not configured");
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();

    // Query ALL records from leads table
    const { data: allLeads, error } = await supabase
      .from("leads")
      .select("*");

    console.log(`[GHL Sync] Supabase query returned ${allLeads?.length ?? 0} total records, error: ${error?.message ?? "none"}`);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Filter to only those with an email (in JS to avoid Supabase filter issues)
    const leads = (allLeads || []).filter((l) => l.email && l.email.trim() !== "");

    console.log(`[GHL Sync] ${leads.length} records have email addresses`);

    if (leads.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        totalInDb: allLeads?.length ?? 0,
        message: allLeads?.length
          ? `Found ${allLeads.length} records but none have email addresses`
          : "No records in leads table",
      });
    }

    let synced = 0;
    const errors: string[] = [];

    for (const lead of leads) {
      const nameParts = (lead.name || "").split(" ");
      const result = await syncContactToGhl({
        firstName: nameParts[0] || "Unknown",
        lastName: nameParts.slice(1).join(" ") || undefined,
        email: lead.email,
        phone: lead.phone,
        source: "GEOPlusMarketing Dashboard Sync",
        tags: ["geoplus-contact", lead.status || "lead"],
      }).catch((err) => ({ success: false as const, error: String(err) }));

      if (result.success) {
        synced++;
        console.log(`[GHL Sync] Synced: ${lead.name} (${lead.email})`);
      } else {
        const errMsg = `${lead.name || lead.email}: ${"error" in result ? result.error : "unknown error"}`;
        errors.push(errMsg);
        console.error(`[GHL Sync] Failed: ${errMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      total: leads.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (e) {
    console.error("[GHL Sync] Unexpected error:", e);
    return NextResponse.json({ error: "Bulk sync failed" }, { status: 500 });
  }
}

/** Change a lead/prospect status. Auto-syncs to GHL when status becomes "lead". */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const validStatuses = ["lead", "prospect", "contacted"];
    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `id and status (${validStatuses.join("/")}) required` },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();

    // Fetch the record
    const { data: record, error: fetchErr } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Update status
    const { error: updateErr } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Auto-sync to GHL when changing TO "lead" status
    let ghlContactId: string | undefined;
    if (status === "lead" && record.status !== "lead" && isGhlConfigured() && record.email) {
      const nameParts = (record.name || "").split(" ");
      const ghlResult = await syncContactToGhl({
        firstName: nameParts[0] || "Unknown",
        lastName: nameParts.slice(1).join(" ") || undefined,
        email: record.email,
        phone: record.phone,
        source: "GEOPlusMarketing Dashboard",
        tags: ["geoplus-lead", "dashboard-converted"],
      }).catch(() => ({ success: false as const, error: "GHL sync failed" }));

      if (ghlResult.success && "contactId" in ghlResult && ghlResult.contactId) {
        ghlContactId = ghlResult.contactId;
        const contactId = ghlResult.contactId;

        const note = [
          `Status changed to Lead via dashboard`,
          record.service_requested && `Service: ${record.service_requested}`,
          record.city && `City: ${record.city}`,
          record.notes && `Notes: ${record.notes}`,
        ].filter(Boolean).join("\n");

        addNoteToContact(contactId, note).catch(console.error);
      }
    }

    revalidatePath("/dashboard");
    return NextResponse.json({
      success: true,
      status,
      ghlContactId,
      ghlSynced: !!ghlContactId,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
