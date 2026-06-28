import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, domain } = await req.json();
  if (!projectId || !domain) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("status, vercel_project_id")
    .eq("id", projectId)
    .single();

  if (!project || project.status === "trial") {
    return NextResponse.json(
      { error: "Custom domains require an active paid subscription" },
      { status: 403 }
    );
  }

  // Add domain to Vercel (would be done via Trigger.dev job in production)
  await supabase.from("domain_verifications").insert({
    project_id: projectId,
    domain,
    vercel_verification_status: "pending",
  });

  await supabase
    .from("projects")
    .update({ custom_domain: domain, custom_domain_verified: false })
    .eq("id", projectId);

  await supabase.from("audit_log").insert({
    actor_id: userId,
    project_id: projectId,
    action: "custom_domain_added",
    payload: { domain },
  });

  return NextResponse.json({ success: true });
}
