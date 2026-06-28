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

const COLUMNS: { id: KanbanColumn; label: string }[] = [
  { id: "backlog", label: "Backlog" },
  { id: "in_review", label: "In Review" },
  { id: "in_progress", label: "In Progress" },
  { id: "done", label: "Done" },
];

function Card({ cr }: { cr: ChangeRequest }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: cr.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const complexityColors: Record<string, string> = {
    low: "bg-green-900/30 text-green-400",
    medium: "bg-yellow-900/30 text-yellow-400",
    high: "bg-red-900/30 text-red-400",
  };

  const complexity =
    (cr.ai_analysis as unknown as Record<string, unknown>)?.complexity as string;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing space-y-2"
    >
      <div className="text-sm font-medium">{cr.title}</div>
      <div className="flex items-center gap-2 text-xs">
        {cr.credit_cost != null && (
          <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">
            {cr.credit_cost} credits
          </span>
        )}
        {complexity && (
          <span
            className={`px-2 py-0.5 rounded ${complexityColors[complexity] ?? "bg-gray-700"}`}
          >
            {complexity}
          </span>
        )}
      </div>
      {cr.status === "pending_approval" && (
        <span className="text-xs text-yellow-400">Awaiting approval</span>
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
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const activeCard = cards.find((c) => c.id === activeId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Change Requests</h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          Request a Change
        </button>
      </div>

      {showNewForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What do you want to change?"
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
          />
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Describe the change in detail..."
            rows={4}
            className="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmitRequest}
              disabled={estimating || !newTitle.trim() || !newDesc.trim()}
              className="rounded bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {estimating ? "Estimating..." : "Submit & Get Estimate"}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="rounded bg-gray-700 px-4 py-2 text-sm hover:bg-gray-600"
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
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">
                    {col.label}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {columnCards.length}
                  </span>
                </div>
                <SortableContext
                  items={columnCards.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 min-h-[100px]" id={col.id}>
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
