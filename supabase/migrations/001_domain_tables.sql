-- businesses: client profiles
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  website TEXT,
  google_business_url TEXT,
  description TEXT,
  service_area JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- leads: captured + prospected leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  source TEXT NOT NULL,  -- 'manual', 'landing_page', 'prospector', 'gpt_researcher'
  name TEXT,
  email TEXT,
  phone TEXT,
  service_requested TEXT,
  city TEXT,
  website_url TEXT,
  gbp_url TEXT,
  quality_score INTEGER,  -- 1-10 prospecting score
  status TEXT DEFAULT 'new',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- content: generated content
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  campaign_id UUID,
  type TEXT NOT NULL,  -- 'blog_post', 'social_post', 'landing_page', 'review_response', 'schema_markup', 'cta_image'
  title TEXT,
  body TEXT NOT NULL,
  image_url TEXT,
  target_keyword TEXT,
  target_city TEXT,
  target_service TEXT,
  platform TEXT,
  status TEXT DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'planning',
  steps JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  source TEXT,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- conversations: persistent chat history
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  channel TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_businesses_telegram_user ON businesses(telegram_user_id);
CREATE INDEX idx_leads_business ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_content_business ON content(business_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_campaigns_business ON campaigns(business_id);
CREATE INDEX idx_analytics_business ON analytics(business_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
