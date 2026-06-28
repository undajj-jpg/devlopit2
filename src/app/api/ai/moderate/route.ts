import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const MODERATION_PROMPT = `You are a content moderation system for Devlop, a web development platform. Analyze the following project brief and determine if it violates any acceptable use policies.

Flag the brief if it involves ANY of:
- Phishing or scam websites
- Illegal activities or services
- Hate speech or discrimination
- Adult/pornographic content
- Malware distribution
- Counterfeit goods
- Gambling (unless legally licensed - flag for review)
- Weapons sales
- Drug sales (illegal substances)
- Identity theft or fraud tools
- Spam or bulk messaging platforms

Respond with JSON only:
{
  "approved": true/false,
  "flagged": true/false,
  "reason": "explanation if flagged, null if approved",
  "severity": "none|low|medium|high|critical"
}

If the project seems legitimate but borderline, set flagged=true with a low severity so a human can review.`;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brief, projectId } = await req.json();

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Review this project brief for content policy violations:\n\n${JSON.stringify(brief, null, 2)}`,
      },
    ],
    system: MODERATION_PROMPT,
  });

  const responseText =
    message.content[0].type === "text" ? message.content[0].text : "";
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    result = { approved: false, flagged: true, reason: "Failed to parse moderation response", severity: "medium" };
  }

  const supabase = createServiceClient();

  if (projectId) {
    const moderationStatus = result.flagged ? "flagged" : "approved";
    await supabase
      .from("projects")
      .update({
        moderation_status: moderationStatus,
        moderation_notes: result.reason,
        status: result.flagged ? "pending_moderation" : "building",
      })
      .eq("id", projectId);

    await supabase.from("audit_log").insert({
      actor_id: userId,
      project_id: projectId,
      action: "brief_moderation",
      payload: result,
    });
  }

  return NextResponse.json(result);
}
