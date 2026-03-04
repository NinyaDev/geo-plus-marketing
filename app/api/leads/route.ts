import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { createLead } from "@/lib/data/leads";

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

    const result = await createLead({
      ...parsed.data,
      business_id: "biz_001",
      source: "contact_form",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead: result.lead });
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
