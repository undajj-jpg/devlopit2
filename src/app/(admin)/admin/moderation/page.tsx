"use client";

import { useEffect, useState } from "react";

interface ModerationItem {
  id: string;
  name: string;
  brief: Record<string, unknown>;
  moderation_status: string;
  moderation_notes: string | null;
  created_at: string;
}

interface AbuseReport {
  id: string;
  reported_url: string | null;
  reporter_email: string | null;
  reason: string;
  status: string;
  created_at: string;
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/moderation").then((r) => r.json()),
      fetch("/api/admin/abuse-reports").then((r) => r.json()),
    ])
      .then(([modData, abuseData]) => {
        setItems(modData.items ?? []);
        setReports(abuseData.reports ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (
    projectId: string,
    action: "approve" | "reject"
  ) => {
    await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, action }),
    });
    setItems((prev) => prev.filter((i) => i.id !== projectId));
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Moderation Queue</h1>
        {items.length === 0 ? (
          <div className="text-gray-500">No items pending moderation.</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.moderation_notes ?? "Flagged by AI moderation"}
                    </p>
                    <pre className="mt-2 text-xs text-gray-500 bg-gray-800 p-2 rounded max-h-40 overflow-y-auto">
                      {JSON.stringify(item.brief, null, 2)}
                    </pre>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      className="rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Abuse Reports</h2>
        {reports.length === 0 ? (
          <div className="text-gray-500">No abuse reports.</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="text-sm">{r.reason}</div>
                {r.reported_url && (
                  <div className="text-xs text-gray-500 mt-1">
                    URL: {r.reported_url}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(r.created_at).toLocaleString()} · {r.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
