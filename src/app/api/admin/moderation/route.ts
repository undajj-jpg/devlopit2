import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, brief, moderation_status, moderation_notes, created_at")
    .in("moderation_status", ["pending", "flagged"])
    .order("created_at", { ascending: true });

  return NextResponse.json({ items: projects ?? [] });
}

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, action } = await req.json();

  const supabase = createServiceClient();

  if (action === "approve") {
    await supabase
      .from("projects")
      .update({ moderation_status: "approved", status: "building" })
      .eq("id", projectId);
  } else if (action === "reject") {
    await supabase
      .from("projects")
      .update({ moderation_status: "rejected", status: "archived" })
      .eq("id", projectId);
  }

  await supabase.from("audit_log").insert({
    actor_id: userId,
    project_id: projectId,
    action: `moderation_${action}`,
    payload: { action },
  });

  return NextResponse.json({ success: true });
}
