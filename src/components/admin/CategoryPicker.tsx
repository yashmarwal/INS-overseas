import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { DEFAULT_ICON, useCategories, type CategoryOption } from "@/hooks/useCategories";
import { addCategory, deleteCategory, updateCategory } from "@/lib/adminData";
import { GhostButton, MUTED, PrimaryButton, type Confirm } from "@/components/admin/AdminUI";

const field = "w-full h-12 px-4 rounded-xl border border-black/20 bg-white text-[15px] placeholder:text-[#8A8076] focus:outline-none focus:border-[#6B4C2A] focus:ring-2 focus:ring-[#6B4C2A]/20";
const chip = (on: boolean) =>
  `inline-flex items-center gap-2 h-11 px-4 rounded-full border text-[14px] font-medium transition-colors ${on ? "bg-[#6B4C2A] text-white border-[#6B4C2A] shadow-sm" : "bg-white text-[#1A1410] border-black/20 hover:border-[#6B4C2A] hover:bg-[#FBF9F4]"}`;

type Props = {
  selected: string;
  onSelect: (id: string) => void;
  /** how many products each category has (a category with products cannot be deleted) */
  counts: Record<string, number>;
  showToast: (type: "success" | "error", msg: string) => void;
  setConfirm: (c: Confirm) => void;
};

// Step 1 of "Add a product": pick a category, or make a new one. Custom categories can be renamed, given another minimum
// order or icon, and deleted once they are empty. Built-in categories are fixed.
export default function CategoryPicker({ selected, onSelect, counts, showToast, setConfirm }: Props) {
  const { all, custom, refetch } = useCategories();
  const [mode, setMode] = useState<null | "new" | CategoryOption>(null);
  const [name, setName] = useState("");
  const [moq, setMoq] = useState("200");
  const [icon, setIcon] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const open = (m: "new" | CategoryOption) => {
    setMode(m);
    setError("");
    if (m === "new") { setName(""); setMoq("200"); setIcon(""); }
    else { setName(m.label); setMoq(String(m.moq ?? 200)); setIcon(m.icon === DEFAULT_ICON ? "" : m.icon); }
  };
  const close = () => { setMode(null); setError(""); };

  const validate = (): { label: string; qty: number } | null => {
    const label = name.trim().replace(/\s+/g, " ");
    const qty = Number(moq);
    const editingId = mode && mode !== "new" ? mode.id : null;
    if (label.length < 2) { setError("Give the category a name (at least 2 letters)."); return null; }
    if (label.length > 40) { setError("Please keep the name under 40 characters."); return null; }
    if (all.some((c) => c.id !== editingId && c.label.trim().toLowerCase() === label.toLowerCase())) { setError("There is already a category with this name."); return null; }
    if (!Number.isInteger(qty) || qty < 1 || qty > 100000) { setError("The minimum order must be a whole number, like 200."); return null; }
    return { label, qty };
  };

  const save = async () => {
    const v = validate();
    if (!v || !mode) return;
    setBusy(true);
    const ic = icon.trim() || DEFAULT_ICON;
    if (mode === "new") {
      const r = await addCategory(v.label, v.qty, ic, all.map((c) => c.id), custom.length);
      setBusy(false);
      if (!r.ok) { setError(`Couldn't add it: ${r.message}`); return; }
      await refetch();
      onSelect(r.id);
      close();
      showToast("success", `Category “${v.label}” added and selected. Add its first product below: it shows on your Products page as soon as it has one.`);
    } else {
      const r = await updateCategory(mode.rowId!, v.label, v.qty, ic);
      setBusy(false);
      if (!r.ok) { setError(`Couldn't save: ${r.message}`); return; }
      await refetch();
      close();
      showToast("success", `Saved “${v.label}”.`);
    }
  };

  const askDelete = (c: CategoryOption) => {
    const n = counts[c.id] ?? 0;
    if (n > 0) { setError(`“${c.label}” still has ${n} product${n > 1 ? "s" : ""}. Move or remove ${n > 1 ? "them" : "it"} first (Products list below), then you can delete the category.`); return; }
    setConfirm({
      title: `Delete “${c.label}”?`,
      message: "The category is removed from the product list and from your Products page filters. You can always create it again.",
      confirmLabel: "Delete category",
      onConfirm: async () => {
        const r = await deleteCategory(c.rowId!);
        if (!r.ok) { showToast("error", `Couldn't delete it: ${r.message}`); return; }
        await refetch();
        if (selected === c.id) onSelect("leather-journals");
        close();
        showToast("success", `Category “${c.label}” deleted.`);
      },
    });
  };

  return (
    <div>
      <div className="mt-3 flex flex-wrap gap-2">
        {all.map((c) => {
          const on = selected === c.id;
          return (
            <span key={c.id} className="inline-flex items-center gap-1">
              <button type="button" aria-pressed={on} onClick={() => onSelect(c.id)} className={chip(on)}>
                <span aria-hidden>{c.icon}</span> {c.label}
                {c.custom && <span className={`text-[12px] tabular-nums ${on ? "text-white/80" : ""}`} style={on ? undefined : { color: MUTED }}>{counts[c.id] ?? 0}</span>}
              </button>
              {c.custom && (
                <button type="button" onClick={() => open(c)} aria-label={`Edit the category ${c.label}`} className="w-9 h-9 rounded-full border border-black/15 bg-white text-[#1A1410] flex items-center justify-center hover:bg-[#FBF9F4] hover:border-[#6B4C2A]">
                  <Pencil size={14} />
                </button>
              )}
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => (mode === "new" ? close() : open("new"))}
          aria-expanded={mode === "new"}
          className="inline-flex items-center gap-2 h-11 px-4 rounded-full border border-dashed border-[#6B4C2A] text-[#6B4C2A] text-[14px] font-medium hover:bg-[#6B4C2A]/5 transition-colors"
        >
          <Plus size={16} /> New category
        </button>
      </div>

      {mode && (
        <div className="mt-4 rounded-2xl border border-[#6B4C2A]/30 bg-[#FBF9F4] p-4 sm:p-5" role="group" aria-label={mode === "new" ? "New category" : "Edit category"}>
          <h3 className="text-[15px] font-semibold">{mode === "new" ? "New category" : `Edit “${mode.label}”`}</h3>
          <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
            It becomes a filter button on your Products page as soon as it has at least one product.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_170px_110px]">
            <div>
              <label htmlFor="cat-name" className="text-[13px] font-semibold">Category name</label>
              <input id="cat-name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} maxLength={40} placeholder="e.g. Wooden Gift Boxes" className={`${field} mt-1.5`} autoFocus />
            </div>
            <div>
              <label htmlFor="cat-moq" className="text-[13px] font-semibold">Minimum order</label>
              <div className="relative mt-1.5">
                <input id="cat-moq" inputMode="numeric" value={moq} onChange={(e) => { setMoq(e.target.value.replace(/[^0-9]/g, "")); setError(""); }} className={`${field} pr-14 tabular-nums`} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: MUTED }}>pcs</span>
              </div>
            </div>
            <div>
              <label htmlFor="cat-icon" className="text-[13px] font-semibold">Icon <span className="font-normal" style={{ color: MUTED }}>(optional)</span></label>
              <input id="cat-icon" value={icon} onChange={(e) => setIcon(Array.from(e.target.value).slice(0, 2).join(""))} placeholder={DEFAULT_ICON} aria-label="Icon (an emoji)" className={`${field} mt-1.5 text-center`} />
            </div>
          </div>

          {error && <p role="alert" className="mt-3 text-[13px] font-medium text-[#B42318]">{error}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <PrimaryButton busy={busy} onClick={() => void save()}>{mode === "new" ? "Create category" : "Save changes"}</PrimaryButton>
            <GhostButton onClick={close}>Cancel</GhostButton>
            {mode !== "new" && <GhostButton danger onClick={() => askDelete(mode)} className="sm:ml-auto">Delete category</GhostButton>}
          </div>
        </div>
      )}
    </div>
  );
}
