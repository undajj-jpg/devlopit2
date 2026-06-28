import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data } = await supabase
    .from("project_secrets")
    .select("id, key, value_last4, target, managed_by")
    .eq("project_id", projectId)
    .eq("managed_by", "client");

  return NextResponse.json({ secrets: data ?? [] });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, key, value, target } = await req.json();
  if (!projectId || !key || !value || !target) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("vercel_project_id")
    .eq("id", projectId)
    .single();

  // In production: write to Vercel env vars via API here
  // await vercelApi.addEnvVar(project.vercel_project_id, key, value, target)

  const valueLast4 = value.slice(-4);

  const { data, error } = await supabase
    .from("project_secrets")
    .insert({
      project_id: projectId,
      key,
      value_last4: valueLast4,
      managed_by: "client",
      target,
    })
    .select("id, key, value_last4, target")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from("audit_log").insert({
    actor_id: userId,
    project_id: projectId,
    action: "secret_added",
    payload: { key, target, vercel_project_id: project?.vercel_project_id },
  });

  return NextResponse.json({ secret: data });
}
