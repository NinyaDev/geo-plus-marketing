import { registerBusinessTool, getBusinessTool } from "./business";
import { generateGeoContentTool } from "./content";
import { createSocialPostTool } from "./social-post";
import { draftReviewResponseTool } from "./review-response";
import { addLeadTool } from "./lead";
import { generateLeadReportTool } from "./lead-report";
import { generateLandingPageTool } from "./landing-page";
import { prospectBusinessesTool } from "./prospect";
import { runGeoAuditTool } from "./geo-audit";
import { buildCitationsTool } from "./citations";
import { generateSchemaTool } from "./schema";
import { generateCtaImageTool } from "./cta-image";
import { generateStatusReportTool } from "./status-report";
import { createCampaignTool } from "./campaign";
import { deepResearchTool } from "./deep-research";

export const allTools = {
  register_business: registerBusinessTool,
  get_business: getBusinessTool,
  generate_geo_content: generateGeoContentTool,
  create_social_post: createSocialPostTool,
  draft_review_response: draftReviewResponseTool,
  add_lead: addLeadTool,
  generate_lead_report: generateLeadReportTool,
  generate_landing_page: generateLandingPageTool,
  prospect_businesses: prospectBusinessesTool,
  run_geo_audit: runGeoAuditTool,
  build_citations: buildCitationsTool,
  generate_schema: generateSchemaTool,
  generate_cta_image: generateCtaImageTool,
  generate_status_report: generateStatusReportTool,
  create_campaign: createCampaignTool,
  deep_research: deepResearchTool,
};
