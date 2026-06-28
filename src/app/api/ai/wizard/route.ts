import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { wizardRateLimit } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `You are the Devlop onboarding assistant. Understand exactly what a client wants to build so a dev team can execute precisely. Ask focused questions one or two at a time, conversationally — not form-like.

Cover these areas through natural conversation:
- What type of project (landing page, SaaS app, portal, etc.)
- Industry and target users
- Core features and functionality
- Design preferences and style references
- Any third-party integrations needed
- Timeline expectations

After 6-10 exchanges, when you have enough context, generate the brief as a JSON block wrapped in \`\`\`json markers:
{
  "project_name": "",
  "tier_recommendation": "starter|growth|scale",
  "tier_reasoning": "",
  "industry": "",
  "target_users": "",
  "core_features": [],
  "tech_requirements": [],
  "style_notes": "",
  "estimated_pages": [],
  "initial_kanban_items": [],
  "roadmap": []
}

Tier guidance:
- Starter: landing pages, marketing sites, simple brochure sites
- Growth: MVPs, SaaS apps, client portals, e-commerce
- Scale: ERPs, platforms, complex multi-tenant apps, heavy integrations

Be honest about which tier fits. Never promise specific timelines beyond the 10-day initial deploy. Be warm but efficient.`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await wizardRateLimit.limit(userId);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toTextStreamResponse();
}
