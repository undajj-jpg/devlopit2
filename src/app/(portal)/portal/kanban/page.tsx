"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Database } from "@/types/database";

type ChangeRequest = Database["public"]["Tables"]["change_requests"]["Row"];
type KanbanColumn = "backlog" | "in_review" | "in_progress" | "done";

const COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "text-slate-400" },
  { id: "in_review", label: "In Review", color: "text-amber-400" },
  { id: "in_progress", label: "In Progress", color: "text-indigo-400" },
  { id: "done", label: "Done", color: "text-emerald-400" },
];

function Card({ cr }: { cr: ChangeRequest }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cr.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const complexityColors: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    high: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const complexity =
    (cr.ai_analysis as unknown as Record<string, unknown>)?.complexity as string;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-[#131B2E] border border-white/[0.06] rounded-xl p-4 cursor-grab active:cursor-grabbing space-y-3 hover:border-indigo-500/20 transition-colors duration-200 group"
    >
      <div className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{cr.title}</div>
      <div className="flex items-center gap-2">
        {cr.credit_cost != null && (
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-medium">
            {cr.credit_cost} credits
          </span>
        )}
        {complexity && (
          <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${complexityColors[complexity] ?? "bg-white/5 border-white/10"}`}>
            {complexity}
          </span>
        )}
      </div>
      {cr.status === "pending_approval" && (
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-xs text-amber-400 font-medium">Awaiting approval</span>
        </div>
      )}
    </div>
  );
}

export default function KanbanPage() {
  const [cards, setCards] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [estimating, setEstimating] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const p = d.projects?.[0];
        if (p) {
          setProjectId(p.id);
          return fetch(`/api/change-requests?projectId=${p.id}`);
        }
      })
      .then((r) => r?.json())
      .then((d) => {
        if (d?.changeRequests) setCards(d.changeRequests);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitRequest = useCallback(async () => {
    if (!newTitle.trim() || !newDesc.trim() || !projectId) return;
    setEstimating(true);

    try {
      const estRes = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDesc, projectId }),
      });
      const estimate = await estRes.json();

      const confirmed = window.confirm(
        `Estimated cost: ${estimate.credit_cost} credits\nComplexity: ${estimate.complexity}\nETA: ${estimate.eta_days} days\n\n${estimate.summary}\n\nApprove this change request?`
      );

      if (!confirmed) {
        setEstimating(false);
        return;
      }

      const crRes = await fetch("/api/change-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: newTitle,
          description: newDesc,
          aiAnalysis: estimate,
          creditCost: estimate.credit_cost,
        }),
      });

      if (crRes.ok) {
        const { id } = await crRes.json();

        await fetch("/api/change-requests", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: "approved" }),
        });

        const refreshRes = await fetch(
          `/api/change-requests?projectId=${projectId}`
        );
        const refreshData = await refreshRes.json();
        setCards(refreshData.changeRequests ?? []);
        setNewTitle("");
        setNewDesc("");
        setShowNewForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit change request");
    } finally {
      setEstimating(false);
    }
  }, [newTitle, newDesc, projectId]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const isColumn = COLUMNS.some((c) => c.id === overId);
    const targetColumn = isColumn
      ? (overId as KanbanColumn)
      : cards.find((c) => c.id === overId)?.kanban_column;

    if (!targetColumn) return;

    const cardId = active.id as string;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.kanban_column === targetColumn) return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, kanban_column: targetColumn } : c
      )
    );

    await fetch("/api/change-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cardId, kanbanColumn: targetColumn }),
    });
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-white/[0.02] border border-white/[0.06] rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const activeCard = cards.find((c) => c.id === activeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Change Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Drag cards between columns to update status</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          Request a Change
        </button>
      </div>

      {showNewForm && (
        <div className="bg-[#131B2E] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What do you want to change?"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 transition-all"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Describe the change in detail..."
            rows={4}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/25 transition-all resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSubmitRequest}
              disabled={estimating || !newTitle.trim() || !newDesc.trim()}
              className="rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {estimating ? "Estimating..." : "Submit & Get Estimate"}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="rounded-xl bg-white/[0.04] border border-white/[0.08] px-5 py-2.5 text-sm font-medium hover:bg-white/[0.08] transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnCards = cards.filter(
              (c) => c.kanban_column === col.id
            );
            return (
              <div
                key={col.id}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      col.id === "backlog" ? "bg-slate-400" :
                      col.id === "in_review" ? "bg-amber-400" :
                      col.id === "in_progress" ? "bg-indigo-400" : "bg-emerald-400"
                    }`} />
                    <h3 className={`text-sm font-semibold ${col.color}`}>
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-md font-medium">
                    {columnCards.length}
                  </span>
                </div>
                <SortableContext
                  items={columnCards.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[120px]" id={col.id}>
                    {columnCards.map((cr) => (
                      <Card key={cr.id} cr={cr} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeCard ? <Card cr={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
