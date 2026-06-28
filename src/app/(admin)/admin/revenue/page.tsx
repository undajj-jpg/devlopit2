"use client";

import { useEffect, useState } from "react";

interface RevenueData {
  mrr: number;
  mrrByTier: Record<string, number>;
  trialConversion: number;
  activeProjects: number;
  trialProjects: number;
  churn30d: number;
  creditUtilization: number;
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/revenue")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data) return <div className="text-gray-500">Failed to load data.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Revenue Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">MRR</div>
          <div className="text-2xl font-bold">${data.mrr.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Active Projects</div>
          <div className="text-2xl font-bold">{data.activeProjects}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">Trial → Paid</div>
          <div className="text-2xl font-bold">{data.trialConversion}%</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-sm text-gray-400">30d Churn</div>
          <div className="text-2xl font-bold">{data.churn30d}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">MRR by Tier</h2>
          <div className="space-y-3">
            {Object.entries(data.mrrByTier).map(([tier, amount]) => (
              <div key={tier} className="flex justify-between">
                <span className="capitalize text-gray-300">{tier}</span>
                <span className="font-medium">${amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Credit Utilization</h2>
          <div className="text-3xl font-bold">{data.creditUtilization}%</div>
          <p className="text-sm text-gray-400 mt-2">
            {data.creditUtilization > 80
              ? "High utilization — upsell opportunity"
              : "Credits are being used efficiently"}
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Trials</h2>
        <div className="text-sm text-gray-400">
          {data.trialProjects} projects currently in trial
        </div>
      </div>
    </div>
  );
}
