"use client";

import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  slug: string;
  tier: string;
  status: string;
  months_paid: number;
  build_attempts: number;
  trial_ends_at: string | null;
  created_at: string;
}

const STATUS_ORDER = [
  "onboarding",
  "pending_moderation",
  "building",
  "build_failed",
  "trial",
  "active",
  "past_due",
  "paused",
  "archived",
];

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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((d) => setProjects(d.projects ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-xs ${filter === "all" ? "bg-gray-700" : "bg-gray-800 text-gray-400"}`}
        >
          All ({projects.length})
        </button>
        {STATUS_ORDER.map((s) => {
          const count = projects.filter((p) => p.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded text-xs capitalize ${filter === s ? "bg-gray-700" : "bg-gray-800 text-gray-400"}`}
            >
              {s.replace("_", " ")} ({count})
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-gray-400">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Tier</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Months Paid</th>
              <th className="pb-2 pr-4">Trial Ends</th>
              <th className="pb-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-800/50">
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4 capitalize">{p.tier}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs capitalize ${statusColors[p.status] ?? ""}`}
                  >
                    {p.status.replace("_", " ")}
                  </span>
                  {p.build_attempts > 0 && p.status === "build_failed" && (
                    <span className="ml-1 text-xs text-red-500">
                      ({p.build_attempts} attempts)
                    </span>
                  )}
                </td>
                <td className="py-3 pr-4">{p.months_paid}/12</td>
                <td className="py-3 pr-4 text-gray-400">
                  {p.trial_ends_at
                    ? new Date(p.trial_ends_at).toLocaleDateString()
                    : "—"}
                </td>
                <td className="py-3 text-gray-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
