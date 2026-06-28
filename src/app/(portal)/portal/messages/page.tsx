"use client";

import { useEffect, useState, useRef, useCallback } from "react";
interface Message {
  id: string;
  body: string;
  author_id: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const p = d.projects?.[0];
        if (p) {
          setProjectId(p.id);
          return fetch(`/api/messages?projectId=${p.id}`);
        }
      })
      .then((r) => r?.json())
      .then((d) => {
        if (d?.messages) setMessages(d.messages);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || !projectId) return;
    const body = input;
    setInput("");

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, body }),
    });

    if (res.ok) {
      const { message } = await res.json();
      setMessages((prev) => [...prev, message]);
    }
  }, [input, projectId]);

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-white/[0.02] border border-white/[0.06] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Messages</h1>
        <p className="text-sm text-slate-500 mt-1">Communicate with your development team</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No messages yet</p>
            <p className="text-sm text-slate-600 mt-1">Start a conversation with your team.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="bg-[#131B2E] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-colors">
            <div className="text-sm text-white/90">{m.body}</div>
            <div className="text-xs text-slate-600 mt-2">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-xl gradient-primary px-6 py-3 text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}
