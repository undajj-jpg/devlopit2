"use client";

import { useEffect, useState } from "react";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function DashboardPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.length > 0) setProject(d.projects[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold mb-2">No project yet</h2>
        <p className="text-gray-400 mb-4">Get started by describing your project.</p>
        <a
          href="/onboarding"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium hover:bg-blue-700"
        >
          Start Onboarding
        </a>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    onboarding: "bg-yellow-600/20 text-yellow-400",
    pending_moderation: "bg-orange-600/20 text-orange-400",
    building: "bg-blue-600/20 text-blue-400",
    build_failed: "bg-red-600/20 text-red-400",
    trial: "bg-purple-600/20 text-purple-400",
    active: "bg-green-600/20 text-green-400",
    past_due: "bg-red-600/20 text-red-400",
    paused: "bg-gray-600/20 text-gray-400",
    archived: "bg-gray-600/20 text-gray-500",
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Status</div>
          <span
            className={`inline-block rounded px-2 py-1 text-sm font-medium capitalize ${
              statusColors[project.status] ?? "bg-gray-800"
            }`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Tier</div>
          <div className="text-lg font-medium capitalize">{project.tier}</div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Site</div>
          {project.vercel_subdomain ? (
            <a
              href={`https://${project.vercel_subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              {project.vercel_subdomain}
            </a>
          ) : (
            <div className="text-gray-500 text-sm">Not deployed yet</div>
          )}
        </div>
      </div>

      {project.trial_ends_at && project.status === "trial" && (
        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
          <div className="text-sm text-purple-300">
            Trial ends{" "}
            {new Date(project.trial_ends_at).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      )}

      {project.status === "past_due" && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="text-sm text-red-300">
            Payment is past due. Please update your billing to avoid service interruption.
          </div>
          <a
            href="/portal/billing"
            className="inline-block mt-2 text-sm text-red-400 underline"
          >
            Update billing
          </a>
        </div>
      )}
    </div>
  );
}
