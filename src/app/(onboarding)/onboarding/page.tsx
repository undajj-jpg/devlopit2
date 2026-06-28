"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import type { Brief } from "@/types/database";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function OnboardingPage() {
  const { user } = useUser();
  const [brief, setBrief] = useState<Brief | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      user.update({ unsafeMetadata: { timezone: tz } }).catch(() => {});
    }
  }, [user]);

  const handleSubmitMessage = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/ai/wizard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) throw new Error("Failed");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantContent } : m
            )
          );
        }

        const jsonMatch = assistantContent.match(
          /```json\s*([\s\S]*?)\s*```/
        );
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[1]) as Brief;
            setBrief(parsed);
          } catch {
            // not valid JSON yet
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleApprove = useCallback(async () => {
    if (!brief || !agreed) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const { projectId } = await res.json();

      const modRes = await fetch("/api/ai/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, projectId }),
      });

      if (!modRes.ok) throw new Error("Moderation failed");

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [brief, agreed]);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto animate-glow">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold">Brief Submitted!</h1>
          <p className="text-slate-400 leading-relaxed">
            Your project is being reviewed and built. We&apos;ll email you when
            it&apos;s live. This typically takes up to 10 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0B1120] text-white">
      <header className="border-b border-white/[0.06] px-6 py-4 bg-[#0B1120]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold">
            <span className="gradient-text">Devlop</span>
            <span className="text-slate-500 font-normal ml-2">AI Project Assistant</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-20 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <p className="text-lg text-slate-300 font-medium">Hi! I&apos;m your Devlop assistant.</p>
                <p className="text-slate-500">Tell me about the project you want to build.</p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                    m.role === "user"
                      ? "gradient-primary text-white"
                      : "bg-[#131B2E] border border-white/[0.06] text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-[#131B2E] border border-white/[0.06] rounded-2xl px-5 py-4">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmitMessage}
            className="border-t border-white/[0.06] p-4 flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project..."
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 transition-all"
              disabled={isLoading || !!brief}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !!brief}
              className="rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>

        {brief && (
          <div className="w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l border-white/[0.06] p-6 overflow-y-auto bg-[#0D1425]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold">Your Project Brief</h2>
            </div>
            <div className="space-y-5 text-sm">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project</span>
                <p className="font-bold text-white mt-1">{brief.project_name}</p>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Recommended Tier</span>
                <p className="mt-1">
                  <span className="inline-block rounded-lg gradient-primary px-3 py-1 text-white font-semibold text-xs capitalize">
                    {brief.tier_recommendation}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Industry</span>
                  <p className="text-white mt-1">{brief.industry}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Target Users</span>
                  <p className="text-white mt-1">{brief.target_users}</p>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Core Features</span>
                <ul className="mt-2 space-y-2">
                  {brief.core_features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              {brief.tech_requirements.length > 0 && (
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tech Requirements</span>
                  <ul className="mt-2 space-y-2">
                    {brief.tech_requirements.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300">
                        <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Style</span>
                  <p className="text-slate-300 mt-1">{brief.style_notes}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pages</span>
                  <p className="text-slate-300 mt-1">{brief.estimated_pages.join(", ")}</p>
                </div>
              </div>

              <hr className="border-white/[0.06]" />

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-600 accent-indigo-500"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  I agree to the{" "}
                  <a href="/msa" className="text-indigo-400 hover:text-indigo-300 underline" target="_blank">
                    Master Service Agreement
                  </a>{" "}
                  and understand I do not own the software until a 12-month
                  buyout is completed. I own my content and end-user data at all
                  times.
                </span>
              </label>

              <button
                onClick={handleApprove}
                disabled={!agreed || submitting}
                className="w-full rounded-xl gradient-primary py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {submitting ? "Submitting..." : "Approve & Start Build"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
