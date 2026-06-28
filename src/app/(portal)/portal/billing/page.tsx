"use client";

import { useEffect, useState } from "react";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const PLAN_PRICES: Record<string, number> = {
  starter: 99,
  growth: 299,
  scale: 799,
};

export default function BillingPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        if (d.projects?.[0]) setProject(d.projects[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  if (!project) {
    return <div className="text-gray-400">No project found.</div>;
  }

  const monthlyPrice = PLAN_PRICES[project.tier] ?? 0;
  const buyoutTotal = 12 * monthlyPrice;
  const buyoutRemaining = Math.max(0, (12 - project.months_paid) * monthlyPrice);
  const buyoutProgress = Math.min(100, (project.months_paid / 12) * 100);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Billing</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-gray-400">Current Plan</div>
            <div className="text-lg font-medium capitalize">{project.tier}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Billing</div>
            <div className="text-lg font-medium capitalize">
              {project.billing_interval ?? "—"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Monthly</div>
            <div className="text-lg font-medium">${monthlyPrice}/mo</div>
          </div>
        </div>
      </div>

      {/* Buyout tracker */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Buyout Tracker</h2>
        <p className="text-sm text-gray-400">
          After 12 months of payments, you can own your software outright.
        </p>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${buyoutProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            {project.months_paid} / 12 months paid
          </span>
          <span className="text-gray-400">
            ${buyoutRemaining.toLocaleString()} remaining of $
            {buyoutTotal.toLocaleString()}
          </span>
        </div>
        {project.months_paid >= 12 && !project.bought_out && (
          <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700">
            Request Buyout
          </button>
        )}
        {project.bought_out && (
          <div className="text-green-400 text-sm font-medium">
            Buyout complete — you own this software!
          </div>
        )}
      </div>

      {/* Credit top-ups */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Credit Top-ups</h2>
        <p className="text-sm text-gray-400">
          Need more credits this month? Purchase additional credits.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { credits: 5, price: 49 },
            { credits: 10, price: 89 },
            { credits: 20, price: 159 },
          ].map((pkg) => (
            <button
              key={pkg.credits}
              className="border border-gray-700 rounded-lg p-4 text-center hover:border-blue-500 transition-colors"
            >
              <div className="text-2xl font-bold">{pkg.credits}</div>
              <div className="text-sm text-gray-400">credits</div>
              <div className="text-sm font-medium mt-2">${pkg.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
