import { useSyncExternalStore } from "react";

// Whether the "Download catalogue" dialog is open, from any page (the navbar button, the Products page button, the mobile menu).
// This file is deliberately tiny: the dialog itself and the product data load only after the first click.
type State = { open: boolean; everOpened: boolean; initialKey: string };
let state: State = { open: false, everOpened: false, initialKey: "all" };
const subs = new Set<() => void>();
const set = (s: State) => { state = s; subs.forEach((f) => f()); };

export const openCatalogue = (initialKey = "all") => set({ open: true, everOpened: true, initialKey });
export const closeCatalogue = () => set({ ...state, open: false });
export const useCatalogueUi = () => useSyncExternalStore((cb) => { subs.add(cb); return () => { subs.delete(cb); }; }, () => state, () => state);

/** Starts fetching the dialog's code and the PDF tools while the visitor's pointer is still on its way to the button. */
export const warmCatalogue = () => { for (const load of [() => import("@/components/ui/CatalogueHost"), () => import("@/lib/catalogPdf"), () => import("jspdf")]) load().catch(() => { /* the real attempt, on Download, reports it */ }); };
