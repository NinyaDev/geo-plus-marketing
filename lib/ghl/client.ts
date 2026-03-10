import { getConfig } from "../config";

export function isGhlConfigured(): boolean {
  const config = getConfig();
  return !!(config.ghl.pit && config.ghl.locationId);
}

function getGhlConfig() {
  const config = getConfig();
  if (!config.ghl.pit || !config.ghl.locationId) {
    throw new Error("GHL is not configured (missing GHL_PIT or GHL_LOCATION_ID)");
  }
  return {
    pit: config.ghl.pit,
    locationId: config.ghl.locationId,
    apiBase: config.ghl.apiBase,
  };
}

async function ghlFetch(path: string, options: RequestInit = {}) {
  const config = getGhlConfig();
  const url = `${config.apiBase}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${config.pit}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`GHL API error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

export interface GhlContactPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: Array<{ key: string; value: string }>;
}

/**
 * Create or update a contact in GoHighLevel.
 * Returns the GHL contact ID.
 */
export async function syncContactToGhl(
  payload: GhlContactPayload
): Promise<{ success: boolean; contactId?: string; error?: string }> {
  try {
    const config = getGhlConfig();

    const data = await ghlFetch("/contacts/", {
      method: "POST",
      body: JSON.stringify({
        locationId: config.locationId,
        firstName: payload.firstName,
        lastName: payload.lastName || "",
        email: payload.email,
        phone: payload.phone || "",
        companyName: payload.companyName || "",
        source: payload.source || "GEOPlusMarketing Website",
        tags: payload.tags || ["geoplus-lead", "website-contact"],
        ...(payload.customFields?.length
          ? { customFields: payload.customFields }
          : {}),
      }),
    });

    const contactId = data?.contact?.id || data?.id;
    return { success: true, contactId };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[GHL] Failed to sync contact:", message);
    return { success: false, error: message };
  }
}

/**
 * Add a note to an existing GHL contact.
 */
export async function addNoteToContact(
  contactId: string,
  body: string
): Promise<boolean> {
  try {
    await ghlFetch(`/contacts/${contactId}/notes`, {
      method: "POST",
      body: JSON.stringify({ body }),
    });
    return true;
  } catch (error) {
    console.error("[GHL] Failed to add note:", error);
    return false;
  }
}
