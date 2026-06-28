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

  const [
    { data: project },
    { data: changeRequests },
    { data: messages },
    { data: credits },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase.from("change_requests").select("*").eq("project_id", projectId),
    supabase.from("project_messages").select("*").eq("project_id", projectId),
    supabase.from("credit_ledger").select("*").eq("project_id", projectId),
  ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    project,
    change_requests: changeRequests,
    messages,
    credit_history: credits,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="devlop-export-${projectId}.json"`,
    },
  });
}
