import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getEstimateRateLimit } from "@/lib/rate-limit";

const ESTIMATOR_PROMPT = `You are a senior developer estimating effort for change requests on a web project built with Next.js, Tailwind CSS, and Supabase.

Use this credit cost reference table:
- Text / copy change: 0.5 credits
- Image swap: 0.5 credits
- Color / style tweak: 1 credit
- New section on existing page: 2 credits
- New page: 3 credits
- UI redesign of existing page: 6 credits
- New feature (small): 5 credits
- New feature (large): 10 credits
- New third-party integration: 8 credits
- Database schema change: 6 credits
- Performance optimization: 4 credits

Return a conservative JSON estimate. If the request spans multiple categories, sum the costs. Be realistic about complexity.

Respond with ONLY valid JSON:
{
  "credit_cost": <number>,
  "complexity": "low|medium|high",
  "eta_days": <number 1-10>,
  "summary": "<1-2 sentence summary of what will be done>",
  "plan_md": "<brief markdown implementation plan a developer can execute>"
}`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await getEstimateRateLimit().limit(userId);
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const { description, projectId } = await req.json();
  if (!description || !projectId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("brief, tier")
    .eq("id", projectId)
    .single();

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: ESTIMATOR_PROMPT,
    messages: [
      {
        role: "user",
        content: `Project context: ${project?.tier} tier. Brief: ${JSON.stringify(project?.brief ?? {})}\n\nChange request:\n${description}`,
      },
    ],
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";

  let estimate;
  try {
    estimate = JSON.parse(responseText);
  } catch {
    estimate = {
      credit_cost: 3,
      complexity: "medium",
      eta_days: 3,
      summary: "Could not auto-estimate. Manual review needed.",
      plan_md: "Manual estimation required.",
    };
  }

  return NextResponse.json(estimate);
}
