"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
  org_name: string | null;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then((d) => setClients(d.clients ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-gray-400">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Email</th>
              <th className="pb-2 pr-4">Organization</th>
              <th className="pb-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-gray-800/50">
                <td className="py-3 pr-4">{c.name ?? "—"}</td>
                <td className="py-3 pr-4 text-gray-400">{c.email}</td>
                <td className="py-3 pr-4">{c.org_name ?? "—"}</td>
                <td className="py-3 text-gray-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
