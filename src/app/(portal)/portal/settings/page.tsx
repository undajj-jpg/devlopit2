"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { Database } from "@/types/database";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function SettingsPage() {
  const { user } = useUser();
  const [project, setProject] = useState<Project | null>(null);
  const [domain, setDomain] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [secretTarget, setSecretTarget] = useState<"production" | "preview" | "development">("production");
  const [secrets, setSecrets] = useState<Array<{ id: string; key: string; value_last4: string | null; target: string }>>([]);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const p = d.projects?.[0];
        if (p) {
          setProject(p);
          if (p.custom_domain) setDomain(p.custom_domain);
          return fetch(`/api/secrets?projectId=${p.id}`);
        }
      })
      .then((r) => r?.json())
      .then((d) => {
        if (d?.secrets) setSecrets(d.secrets);
      })
      .finally(() => setLoading(false));

    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => {
        if (d.code) setReferralCode(d.code);
      })
      .catch(() => {});
  }, []);

  const handleAddDomain = async () => {
    if (!domain || !project) return;
    await fetch("/api/domains", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, domain }),
    });
    alert("Domain added. Check DNS instructions.");
  };

  const handleAddSecret = async () => {
    if (!newKey || !newValue || !project) return;
    const res = await fetch("/api/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        key: newKey,
        value: newValue,
        target: secretTarget,
      }),
    });
    if (res.ok) {
      const { secret } = await res.json();
      setSecrets((prev) => [...prev, secret]);
      setNewKey("");
      setNewValue("");
    }
  };

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Profile</h2>
        <div className="text-sm text-gray-400">
          <div>Email: {user?.primaryEmailAddress?.emailAddress}</div>
          <div>Name: {user?.fullName ?? "—"}</div>
        </div>
      </section>

      {/* Custom Domain */}
      {project && !["onboarding", "building", "trial"].includes(project.status) && (
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Custom Domain</h2>
          <div className="flex gap-2">
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
            />
            <button
              onClick={handleAddDomain}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Add Domain
            </button>
          </div>
          {project.custom_domain_verified && (
            <div className="text-green-400 text-sm mt-2">Domain verified</div>
          )}
        </section>
      )}

      {/* Secrets */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Environment Variables</h2>
        <div className="space-y-2 mb-4">
          {secrets.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center bg-gray-800 rounded px-3 py-2 text-sm"
            >
              <span className="font-mono">{s.key}</span>
              <span className="text-gray-500">
                ****{s.value_last4} ({s.target})
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="KEY_NAME"
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white font-mono"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="value"
            type="password"
            className="rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
          />
          <select
            value={secretTarget}
            onChange={(e) => setSecretTarget(e.target.value as "production" | "preview" | "development")}
            className="rounded border border-gray-700 bg-gray-800 px-2 py-2 text-sm text-white"
          >
            <option value="production">Production</option>
            <option value="preview">Preview</option>
            <option value="development">Development</option>
          </select>
          <button
            onClick={handleAddSecret}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </section>

      {/* Referrals */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Referrals</h2>
        {referralCode ? (
          <div>
            <div className="text-sm text-gray-400 mb-2">Your referral code:</div>
            <code className="bg-gray-800 px-3 py-2 rounded text-sm">
              {referralCode}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Share this code. When someone subscribes, you both get bonus
              credits.
            </p>
          </div>
        ) : (
          <button
            onClick={async () => {
              const res = await fetch("/api/referrals", { method: "POST" });
              const d = await res.json();
              if (d.code) setReferralCode(d.code);
            }}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
          >
            Generate Referral Code
          </button>
        )}
      </section>

      {/* Data Export */}
      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Data Export</h2>
        <p className="text-sm text-gray-400 mb-3">
          Export your content and data at any time. You always own your content
          and your end-users&apos; data.
        </p>
        <button
          onClick={() => {
            if (project) {
              window.open(`/api/export?projectId=${project.id}`, "_blank");
            }
          }}
          className="rounded bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600"
        >
          Export Data
        </button>
      </section>
    </div>
  );
}
