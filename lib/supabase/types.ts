export interface Business {
  id: string;
  telegram_user_id: string;
  name: string;
  service_type: string;
  city: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  website?: string;
  google_business_url?: string;
  description?: string;
  service_area?: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  business_id: string;
  source: "manual" | "landing_page" | "prospector" | "gpt_researcher";
  name?: string;
  email?: string;
  phone?: string;
  service_requested?: string;
  city?: string;
  website_url?: string;
  gbp_url?: string;
  quality_score?: number;
  status: string;
  notes?: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  business_id: string;
  campaign_id?: string;
  type:
    | "blog_post"
    | "social_post"
    | "landing_page"
    | "review_response"
    | "schema_markup"
    | "cta_image";
  title?: string;
  body: string;
  image_url?: string;
  target_keyword?: string;
  target_city?: string;
  target_service?: string;
  platform?: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  business_id: string;
  name: string;
  service: string;
  location: string;
  status: string;
  steps: unknown[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Analytics {
  id: string;
  business_id: string;
  metric_type: string;
  metric_value: Record<string, unknown>;
  source?: string;
  recorded_at: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  channel: string;
  messages: unknown[];
  created_at: string;
  updated_at: string;
}
