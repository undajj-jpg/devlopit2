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
    return <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />;
  }

  return (
    <div className="max-w-2xl flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-10">
            No messages yet. Start a conversation with your team.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="bg-gray-800 rounded-lg p-3">
            <div className="text-sm">{m.body}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(m.created_at).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
