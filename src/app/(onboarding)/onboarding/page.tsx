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
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="max-w-md text-center space-y-4">
          <div className="text-5xl">&#10003;</div>
          <h1 className="text-2xl font-bold">Brief Submitted!</h1>
          <p className="text-gray-400">
            Your project is being reviewed and built. We&apos;ll email you when
            it&apos;s live. This typically takes up to 10 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4">
        <h1 className="text-xl font-bold">
          Devlop — Tell us what you want to build
        </h1>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center mt-20">
                <p className="text-lg">Hi! I&apos;m your Devlop assistant.</p>
                <p>Tell me about the project you want to build.</p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmitMessage}
            className="border-t border-gray-800 p-4 flex gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project..."
              className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              disabled={isLoading || !!brief}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim() || !!brief}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>

        {brief && (
          <div className="w-full lg:w-[450px] border-t lg:border-t-0 lg:border-l border-gray-800 p-6 overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Your Project Brief</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400">Project:</span>{" "}
                <span className="font-medium">{brief.project_name}</span>
              </div>
              <div>
                <span className="text-gray-400">Recommended Tier:</span>{" "}
                <span className="inline-block rounded bg-blue-600/20 px-2 py-0.5 text-blue-400 font-medium capitalize">
                  {brief.tier_recommendation}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Industry:</span>{" "}
                {brief.industry}
              </div>
              <div>
                <span className="text-gray-400">Target Users:</span>{" "}
                {brief.target_users}
              </div>
              <div>
                <span className="text-gray-400">Core Features:</span>
                <ul className="mt-1 list-disc list-inside text-gray-300">
                  {brief.core_features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              {brief.tech_requirements.length > 0 && (
                <div>
                  <span className="text-gray-400">Tech Requirements:</span>
                  <ul className="mt-1 list-disc list-inside text-gray-300">
                    {brief.tech_requirements.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <span className="text-gray-400">Style:</span>{" "}
                {brief.style_notes}
              </div>
              <div>
                <span className="text-gray-400">Pages:</span>{" "}
                {brief.estimated_pages.join(", ")}
              </div>

              <hr className="border-gray-700" />

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-600"
                />
                <span className="text-xs text-gray-400">
                  I agree to the{" "}
                  <a
                    href="/msa"
                    className="text-blue-400 underline"
                    target="_blank"
                  >
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
                className="w-full rounded-lg bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
