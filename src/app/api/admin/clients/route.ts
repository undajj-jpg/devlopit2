import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("clerk_id", userId)
    .single();

  if (!adminUser || !["admin", "pm"].includes(adminUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, email, name, role, created_at")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  const clients = await Promise.all(
    (users ?? []).map(async (u) => {
      const { data: org } = await supabase
        .from("organizations")
        .select("name")
        .eq("owner_id", u.id)
        .single();

      return { ...u, org_name: org?.name ?? null };
    })
  );

  return NextResponse.json({ clients });
}
