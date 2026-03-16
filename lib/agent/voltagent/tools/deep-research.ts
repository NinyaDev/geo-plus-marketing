import { tool } from "ai";
import { z } from "zod";
import { getConfig } from "@/lib/config";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/client";
import { getOrCreateBusinessId } from "./helpers";

export const deepResearchTool = tool({
  description:
    "Run comprehensive deep research using GPT Researcher (Python sidecar). Produces detailed reports with citations. Falls back to Grok research if GPT Researcher is unavailable.",
  inputSchema: z.object({
    telegramUserId: z.string().describe("Telegram user ID of the franchisee"),
    businessId: z.string().optional().describe("Business ID (auto-resolved if not provided)"),
    query: z
      .string()
      .describe("Research query (e.g., 'best plumbing companies in Miami and their marketing strategies')"),
    reportType: z
      .enum(["research_report", "business_brief", "competitor_analysis"])
      .default("research_report")
      .describe("Type of report to generate"),
  }),
  execute: async (params) => {
    const businessId = params.businessId || (await getOrCreateBusinessId(params.telegramUserId));
    const config = getConfig();
    const gptResearcherUrl = config.gptResearcher.url;

    // Try GPT Researcher first
    try {
      const response = await fetch(`${gptResearcherUrl}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: params.query,
          report_type: params.reportType,
          source: "web",
        }),
        signal: AbortSignal.timeout(120000), // 2 min timeout
      });

      if (response.ok) {
        const data = await response.json();
        const report = data.report || data.output || JSON.stringify(data);

        if (isSupabaseConfigured()) {
          const supabase = getSupabaseAdmin();
          await supabase.from("content").insert({
            business_id: businessId,
            type: "blog_post",
            title: `Research: ${params.query.substring(0, 100)}`,
            body: report,
            status: "draft",
            metadata: {
              content_subtype: "deep_research",
              report_type: params.reportType,
              source: "gpt_researcher",
            },
          });
        }

        return {
          success: true,
          source: "gpt_researcher",
          reportType: params.reportType,
          report,
        };
      }
    } catch {
      // GPT Researcher not available — fall back to Grok
    }

    // Fallback: use Grok for research
    try {
      const { generateText } = await import("ai");
      const { researchModel } = await import("../models");

      const prompt = `You are a thorough business research analyst. Conduct comprehensive research on the following topic:

Query: ${params.query}
Report Type: ${params.reportType}

Provide a detailed report with:
1. Executive Summary
2. Key Findings (with specific data points and examples)
3. Market Analysis
4. Competitive Landscape
5. Opportunities & Threats
6. Actionable Recommendations

Be specific, cite real-world patterns, and provide actionable intelligence.`;

      const result = await generateText({
        model: researchModel,
        prompt,
      });

      const report = result.text;

      if (isSupabaseConfigured()) {
        const supabase = getSupabaseAdmin();
        await supabase.from("content").insert({
          business_id: businessId,
          type: "blog_post",
          title: `Research: ${params.query.substring(0, 100)}`,
          body: report,
          status: "draft",
          metadata: {
            content_subtype: "deep_research",
            report_type: params.reportType,
            source: "grok_fallback",
          },
        });
      }

      return {
        success: true,
        source: "grok_fallback",
        reportType: params.reportType,
        report,
        note: "GPT Researcher unavailable — used Grok research instead.",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: `Research failed: ${errorMessage}`,
      };
    }
  },
});
