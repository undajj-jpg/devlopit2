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
      <div className="max-w-4xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white/[0.02] border border-white/[0.06] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center mt-20">
        <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold mb-2">No project yet</h2>
        <p className="text-slate-500 mb-6">Get started by describing your project to our AI assistant.</p>
        <a
          href="/onboarding"
          className="inline-block rounded-xl gradient-primary px-6 py-3 text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5"
        >
          Start Onboarding
        </a>
      </div>
    );
  }

  const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    onboarding: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    pending_moderation: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
    building: { bg: "bg-indigo-500/10", text: "text-indigo-400", dot: "bg-indigo-400" },
    build_failed: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
    trial: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    past_due: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
    paused: { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-400" },
    archived: { bg: "bg-slate-500/10", text: "text-slate-500", dot: "bg-slate-500" },
  };

  const status = statusConfig[project.status] ?? statusConfig.paused;

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-extrabold">{project.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#131B2E] border border-white/[0.06] rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Status</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status.dot}`} />
            <span className={`text-sm font-semibold capitalize ${status.text}`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="bg-[#131B2E] border border-white/[0.06] rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Tier</div>
          <div className="text-lg font-bold capitalize gradient-text inline-block">{project.tier}</div>
        </div>

        <div className="bg-[#131B2E] border border-white/[0.06] rounded-2xl p-5">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Site</div>
          {project.vercel_subdomain ? (
            <a
              href={`https://${project.vercel_subdomain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              {project.vercel_subdomain}
            </a>
          ) : (
            <div className="text-slate-600 text-sm">Not deployed yet</div>
          )}
        </div>
      </div>

      {project.trial_ends_at && project.status === "trial" && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 flex items-center gap-3">
          <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div className="text-sm text-violet-300">
            Trial ends{" "}
            <span className="font-semibold">
              {new Date(project.trial_ends_at).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {project.status === "past_due" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <span className="text-sm text-red-300 font-medium">
              Payment is past due. Please update your billing to avoid service interruption.
            </span>
          </div>
          <a
            href="/portal/billing"
            className="inline-block text-sm text-red-400 font-semibold hover:text-red-300 transition-colors"
          >
            Update billing &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
