import { useEffect, useRef, useState } from "react";
import { updateRows } from "@/lib/adminData";

/** Moves `dragId` to where `targetId` is: dragging down lands after the target, dragging up lands before it. */
export function moveInList<T extends string>(list: T[], dragId: T, targetId: T): T[] {
  const from = list.indexOf(dragId);
  const to = list.indexOf(targetId);
  if (from < 0 || to < 0 || from === to) return list;
  const next = list.slice();
  next.splice(from, 1);
  next.splice(to, 0, dragId);
  return next;
}

/** Native drag-and-drop for a list of cards (no library). `itemProps(id)` goes on each draggable card. */
export function useDragReorder(onMove: (dragId: string, targetId: string) => void) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const reset = () => { setDragId(null); setOverId(null); };
  const itemProps = (id: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setDragId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id); // Firefox needs data to start a drag
    },
    onDragOver: (e: React.DragEvent) => {
      if (dragId && dragId !== id) { e.preventDefault(); setOverId(id); }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragId && dragId !== id) onMove(dragId, id);
      reset();
    },
    onDragEnd: reset,
  });
  return { dragId, overId, itemProps };
}

/** Runs async jobs a few at a time so saving a re-ordered list never fires 100 requests at once. */
export async function inBatches<T>(items: T[], size: number, job: (item: T) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(job));
}

/**
 * A list's saved order. `moveTo` re-orders instantly on screen and saves to Supabase (sort_order) about 0.7s later,
 * touching only the rows whose position changed. Leaving the page with an unsaved order saves it on the way out.
 */
export function useSavedOrder<T extends { id: string; sort_order: number }>(
  items: T[],
  refetch: () => Promise<unknown>,
  onFail: (permissionProblem: boolean) => void,
) {
  const [order, setOrder] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const orderRef = useRef<string[]>([]);
  const dirty = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (dirty.current) return; // never overwrite an order that is waiting to be saved
    const ids = items.map((p) => p.id);
    orderRef.current = ids;
    setOrder(ids);
  }, [items]);

  const persist = async () => {
    window.clearTimeout(timer.current);
    const current = new Map(itemsRef.current.map((p) => [p.id, p]));
    const changed = orderRef.current.map((id, i) => ({ id, i })).filter(({ id, i }) => current.get(id) && current.get(id)!.sort_order !== i);
    if (!changed.length) { dirty.current = false; setSaveState("idle"); return; }
    setSaveState("saving");
    let failed = false;
    let permission = false;
    await inBatches(changed, 6, async ({ id, i }) => {
      const r = await updateRows([id], { sort_order: i });
      if (!r.ok) { failed = true; if (r.kind === "permission") permission = true; }
    });
    dirty.current = false;
    await refetch();
    setSaveState(failed ? "error" : "saved");
    if (failed) onFail(permission);
    else window.setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 2500);
  };
  const persistRef = useRef(persist);
  persistRef.current = persist;
  useEffect(() => () => { if (dirty.current) void persistRef.current(); }, []);

  const moveTo = (dragId: string, targetId: string) => {
    const next = moveInList(orderRef.current, dragId, targetId);
    if (next === orderRef.current) return;
    orderRef.current = next;
    dirty.current = true;
    setOrder(next);
    setSaveState("idle");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void persistRef.current(), 700);
  };

  return { order, moveTo, saveState };
}
