import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { brief } = await req.json();
  if (!brief?.project_name || !brief?.tier_recommendation) {
    return NextResponse.json({ error: "Invalid brief" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get or create organization
  let { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!org) {
    const { data: newOrg, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: brief.project_name, owner_id: user.id })
      .select("id")
      .single();

    if (orgError || !newOrg) {
      return NextResponse.json({ error: "Failed to create org" }, { status: 500 });
    }
    org = newOrg;
  }

  const slug = slugify(brief.project_name) + "-" + Date.now().toString(36);

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      org_id: org.id,
      name: brief.project_name,
      slug,
      tier: brief.tier_recommendation,
      status: "onboarding",
      brief,
    })
    .select("id")
    .single();

  if (error || !project) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    actor_id: user.id,
    project_id: project.id,
    action: "project_created",
    payload: { brief, tier: brief.tier_recommendation },
  });

  return NextResponse.json({ projectId: project.id });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: orgs } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id);

  const orgIds = orgs?.map((o) => o.id) ?? [];
  if (orgIds.length === 0) {
    return NextResponse.json({ projects: [] });
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .in("org_id", orgIds)
    .order("created_at", { ascending: false });

  return NextResponse.json({ projects: projects ?? [] });
}
