import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const payload = await req.json();
  const { type, payload: data } = payload;

  const supabase = createServiceClient();

  if (type === "deployment.created" || type === "deployment.ready" || type === "deployment.error") {
    const vercelDeploymentId = data?.deployment?.id;
    const status = type === "deployment.ready" ? "ready" : type === "deployment.error" ? "error" : "building";

    if (vercelDeploymentId) {
      await supabase
        .from("deployments")
        .update({ status })
        .eq("vercel_deployment_id", vercelDeploymentId);

      if (status === "ready") {
        const { data: deployment } = await supabase
          .from("deployments")
          .select("project_id, environment")
          .eq("vercel_deployment_id", vercelDeploymentId)
          .single();

        if (deployment?.environment === "production") {
          const { data: project } = await supabase
            .from("projects")
            .select("status, deploy_date")
            .eq("id", deployment.project_id)
            .single();

          if (project && !project.deploy_date) {
            const now = new Date();
            const trialEnd = new Date(now.getTime() + 10 * 86400000);

            await supabase
              .from("projects")
              .update({
                status: "trial",
                deploy_date: now.toISOString(),
                trial_ends_at: trialEnd.toISOString(),
              })
              .eq("id", deployment.project_id);
          }

          await supabase
            .from("deployments")
            .update({ is_current_production: false })
            .eq("project_id", deployment.project_id)
            .neq("vercel_deployment_id", vercelDeploymentId);

          await supabase
            .from("deployments")
            .update({ is_current_production: true })
            .eq("vercel_deployment_id", vercelDeploymentId);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
