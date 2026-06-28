"use client";

import { useEffect, useState } from "react";

interface CreditCostType {
  id: string;
  label: string;
  description: string | null;
  credits: number;
}

export default function AdminSettingsPage() {
  const [costTypes, setCostTypes] = useState<CreditCostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editCredits, setEditCredits] = useState("");

  useEffect(() => {
    fetch("/api/admin/credit-costs")
      .then((r) => r.json())
      .then((d) => setCostTypes(d.costTypes ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (id: string) => {
    await fetch("/api/admin/credit-costs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, credits: parseFloat(editCredits) }),
    });
    setCostTypes((prev) =>
      prev.map((ct) =>
        ct.id === id ? { ...ct, credits: parseFloat(editCredits) } : ct
      )
    );
    setEditing(null);
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section>
        <h2 className="text-lg font-medium mb-4">Credit Cost Table</h2>
        <div className="space-y-2">
          {costTypes.map((ct) => (
            <div
              key={ct.id}
              className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded px-4 py-3"
            >
              <div>
                <div className="text-sm font-medium">{ct.label}</div>
                {ct.description && (
                  <div className="text-xs text-gray-500">{ct.description}</div>
                )}
              </div>
              {editing === ct.id ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editCredits}
                    onChange={(e) => setEditCredits(e.target.value)}
                    className="w-20 rounded border border-gray-700 bg-gray-800 px-2 py-1 text-sm text-white"
                    type="number"
                    step="0.5"
                  />
                  <button
                    onClick={() => handleSave(ct.id)}
                    className="rounded bg-green-600 px-2 py-1 text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="rounded bg-gray-700 px-2 py-1 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{ct.credits} credits</span>
                  <button
                    onClick={() => {
                      setEditing(ct.id);
                      setEditCredits(String(ct.credits));
                    }}
                    className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-medium">Platform Config</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-gray-400 block mb-1">Grace Period (days)</label>
            <input
              defaultValue="5"
              className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white"
              type="number"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">
              Absorb Underestimates
            </label>
            <select className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-white">
              <option value="true">Yes (Devlop absorbs overage)</option>
              <option value="false">No (charge client)</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
