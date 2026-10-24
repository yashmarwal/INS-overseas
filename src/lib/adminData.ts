import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabaseConfig";
import { CATEGORY_SECTION } from "@/hooks/useCategories";
import { TERMS_SECTION } from "@/hooks/useProductTerms";
import { DETAILS_SECTION, hasAnyDetail, parseDetails, serializeDetails } from "@/hooks/useProductDetails";
import { compressImageDetailed } from "@/lib/compressImage";
import type { ProductDetails, ProductPhoto } from "@/data/productDetails";

/**
 * The one-time database setup, written for the signed-in admin so it can be pasted straight into Supabase.
 *  1. optional columns for product labels and "featured on homepage"
 *  2. Row Level Security: everyone can READ the website's content, but only this admin's login can add, edit or delete it
 *  3. the same for the image storage bucket, plus a size and file-type limit on uploads
 * It first removes the old "anyone can write" policies. Safe to run more than once.
 */
export function buildSetupSql(adminEmail: string): string {
  const email = (adminEmail || "YOUR-ADMIN-EMAIL").replace(/'/g, "''");
  const isAdmin = `lower(auth.jwt() ->> 'email') = lower('${email}')`;
  return `-- INS Overseas: database setup (run once; safe to run again)

-- 1. Optional columns for product labels and "show on homepage"
alter table public.site_images add column if not exists tag text;
alter table public.site_images add column if not exists featured boolean not null default false;

-- 2. Lock the content table: everyone can read it, only the admin can change it
alter table public.site_images enable row level security;

do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'site_images' loop
    execute format('drop policy %I on public.site_images', p.policyname);
  end loop;
end $$;

create policy "Anyone can read website content" on public.site_images for select to anon, authenticated using (true);
create policy "Only the admin can add"    on public.site_images for insert to authenticated with check (${isAdmin});
create policy "Only the admin can edit"   on public.site_images for update to authenticated using (${isAdmin}) with check (${isAdmin});
create policy "Only the admin can delete" on public.site_images for delete to authenticated using (${isAdmin});

-- 3. Lock the image storage the same way, and limit what can be uploaded
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects'
           and (coalesce(qual, '') like '%website-images%' or coalesce(with_check, '') like '%website-images%') loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

-- (photos stay visible to visitors: the bucket is public. Only the admin can list or replace files.)
create policy "Only the admin can list images" on storage.objects for select to authenticated using (bucket_id = 'website-images' and ${isAdmin});
create policy "Only the admin can upload images" on storage.objects for insert to authenticated with check (bucket_id = 'website-images' and ${isAdmin});
create policy "Only the admin can replace images" on storage.objects for update to authenticated using (bucket_id = 'website-images' and ${isAdmin}) with check (bucket_id = 'website-images' and ${isAdmin});
create policy "Only the admin can delete images" on storage.objects for delete to authenticated using (bucket_id = 'website-images' and ${isAdmin});

update storage.buckets
   set file_size_limit = 10485760,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
 where id = 'website-images';`;
}

export type DbResult = { ok: true } | { ok: false; kind: "permission" | "columns" | "other"; message: string };

const describe = (error: { message?: string; code?: string }): DbResult => {
  const msg = error.message || "unknown error";
  const kind = error.code === "PGRST204" || /column|schema cache/i.test(msg) ? "columns" : "other";
  return { ok: false, kind, message: msg };
};

/** Updates many rows at once. RLS blocks silently (0 rows, no error), so the returned rows are checked. */
export async function updateRows(ids: string[], patch: Record<string, unknown>): Promise<DbResult> {
  if (!ids.length) return { ok: true };
  const { data, error } = await supabase.from("site_images").update(patch).in("id", ids).select("id");
  if (error) return describe(error);
  if (!data || data.length === 0) return { ok: false, kind: "permission", message: "Supabase didn't allow the change." };
  if (data.length < ids.length) return { ok: false, kind: "other", message: `Only ${data.length} of ${ids.length} items were updated.` };
  return { ok: true };
}

/** Deletes rows and their files from storage. */
export async function deleteProducts(items: { id: string; storage_path: string }[]) {
  const paths = items.map((i) => i.storage_path).filter(Boolean);
  if (paths.length) await supabase.storage.from("website-images").remove(paths);
  const ids = items.map((i) => i.id);
  await supabase.from("site_images").delete().eq("section", TERMS_SECTION).in("storage_path", ids); // their own terms go with them
  // their details go with them too, and so do the extra photos those details point to
  const { data: detailRows } = await supabase.from("site_images").select("alt_text").eq("section", DETAILS_SECTION).in("storage_path", ids);
  const extraPaths = ((detailRows ?? []) as { alt_text: string }[]).flatMap((r) => parseDetails(r.alt_text).photos.map((p) => p.path)).filter(Boolean);
  if (extraPaths.length) await supabase.storage.from("website-images").remove(extraPaths);
  await supabase.from("site_images").delete().eq("section", DETAILS_SECTION).in("storage_path", ids);
  return supabase.from("site_images").delete().in("id", ids);
}

/** Do the optional tag/featured columns exist yet? */
export async function probeExtraColumns(): Promise<boolean> {
  const { error } = await supabase.from("site_images").select("tag,featured").limit(1);
  return !error;
}

export type Lockdown = "locked" | "open" | "unknown";

/**
 * Can an anonymous visitor (anyone with the site's public key) still write to the content table?
 * Sends an empty, invalid row WITHOUT any login. Once the database is locked, Postgres refuses it for permissions
 * (42501) before it even looks at the row; while it is still open it only complains that required fields are missing.
 * Either way nothing is saved. (If an empty row were ever accepted, it is deleted straight away.)
 */
export async function probeLockdown(): Promise<Lockdown> {
  const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data, error } = await anon.from("site_images").insert({}).select("id");
  if (data && data.length) {
    await anon.from("site_images").delete().in("id", data.map((r: { id: string }) => r.id));
    return "open";
  }
  if (!error) return "open";
  if (error.code === "42501" || /row-level security|permission denied/i.test(error.message)) return "locked";
  if (["23502", "23503", "23514", "22P02", "22023"].includes(error.code)) return "open";
  return "unknown";
}

// ── Custom product categories (one row each in site_images, section "product_category"; see hooks/useCategories) ──
export const slugifyCategory = (name: string) =>
  name.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const categoryRow = (label: string, moq: number, icon: string) => ({
  label,
  product_name: label,
  alt_text: JSON.stringify({ moq, icon }),
});

/** Adds a category. Its id comes from the name and never clashes with an existing one. */
export async function addCategory(label: string, moq: number, icon: string, takenIds: string[], sortOrder: number): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const base = slugifyCategory(label) || "category";
  let id = base;
  for (let n = 2; takenIds.includes(id); n++) id = `${base}-${n}`;
  const { error } = await supabase.from("site_images").insert({ section: CATEGORY_SECTION, url: "", storage_path: "", category: id, sort_order: sortOrder, ...categoryRow(label, moq, icon) });
  return error ? { ok: false, message: error.message || "unknown error" } : { ok: true, id };
}

/** Renames a category or changes its minimum order / icon. Products keep belonging to it. */
export const updateCategory = (rowId: string, label: string, moq: number, icon: string) => updateRows([rowId], categoryRow(label, moq, icon));

/** Removes a category (only call it when no product uses it). */
export async function deleteCategory(rowId: string): Promise<DbResult> {
  const { data, error } = await supabase.from("site_images").delete().eq("id", rowId).select("id");
  if (error) return describe(error);
  if (!data || data.length === 0) return { ok: false, kind: "permission", message: "Supabase didn't allow the change." };
  return { ok: true };
}

// ── Per-product minimum order / lead time (one row each in site_images, section "product_terms"; see hooks/useProductTerms) ──
/** Saves a product's own terms. Both empty = back to the category's defaults (the row is removed). */
export async function saveProductTerms(productId: string, existingRowId: string | undefined, moq: number | null, lead: number | null): Promise<DbResult> {
  if (!moq && !lead) {
    if (!existingRowId) return { ok: true };
    return deleteCategory(existingRowId); // (same "delete one row and check it happened" helper)
  }
  const alt = JSON.stringify({ ...(moq ? { moq } : {}), ...(lead ? { lead } : {}) });
  if (existingRowId) return updateRows([existingRowId], { alt_text: alt });
  const { error } = await supabase.from("site_images").insert({ section: TERMS_SECTION, label: "Product terms", url: "", storage_path: productId, category: "", product_name: "", alt_text: alt, sort_order: 0 });
  return error ? describe(error) : { ok: true };
}

// ── Per-product details: item code, size, material, colours, customisation, extra photos (section "product_details"; see hooks/useProductDetails) ──
/** Saves a product's details. Nothing filled in = the row is removed. */
export async function saveProductDetails(productId: string, existingRowId: string | undefined, d: Omit<ProductDetails, "rowId">): Promise<DbResult> {
  if (!hasAnyDetail(d)) {
    if (!existingRowId) return { ok: true };
    return deleteCategory(existingRowId); // (the same "delete one row and check it happened" helper)
  }
  const alt = serializeDetails(d);
  if (existingRowId) return updateRows([existingRowId], { alt_text: alt });
  const { error } = await supabase.from("site_images").insert({ section: DETAILS_SECTION, label: "Product details", url: "", storage_path: productId, category: "", product_name: "", alt_text: alt, sort_order: 0 });
  return error ? describe(error) : { ok: true };
}

/** Shrinks one extra photo and uploads it (the same way product photos are). Throws a plain-English reason if it cannot. */
export async function uploadProductPhoto(file: File, productId: string): Promise<ProductPhoto> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("photos must be JPG, PNG or WebP");
  if (file.size > 25 * 1024 * 1024) throw new Error("that photo is over 25 MB");
  const res = await compressImageDetailed(file);
  if (res.unreadable) throw new Error("that file isn't a readable photo");
  const ext = res.file.name.split(".").pop() || "jpg";
  const path = `product_extra_${productId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
  const { error } = await supabase.storage.from("website-images").upload(path, res.file, { upsert: true, cacheControl: "31536000", contentType: res.file.type });
  if (error) throw new Error(error.message || "the upload failed");
  return { url: supabase.storage.from("website-images").getPublicUrl(path).data.publicUrl, path };
}

/** Deletes photo files from storage (ones the admin removed, or uploaded and then did not keep). */
export async function removePhotoFiles(paths: string[]) {
  const list = paths.filter(Boolean);
  if (list.length) await supabase.storage.from("website-images").remove(list);
}

/** Gives codes to the pieces that have none (one batch of new rows, plus an update for those that already have a details row). */
export async function assignCodes(plan: { productId: string; rowId?: string; code: string; current: Omit<ProductDetails, "rowId"> }[]): Promise<DbResult> {
  const inserts = plan
    .filter((p) => !p.rowId)
    .map((p) => ({ section: DETAILS_SECTION, label: "Product details", url: "", storage_path: p.productId, category: "", product_name: "", alt_text: serializeDetails({ ...p.current, code: p.code }), sort_order: 0 }));
  if (inserts.length) {
    const { error } = await supabase.from("site_images").insert(inserts);
    if (error) return describe(error);
  }
  for (const p of plan.filter((x) => x.rowId)) {
    const r = await updateRows([p.rowId!], { alt_text: serializeDetails({ ...p.current, code: p.code }) });
    if (!r.ok) return r;
  }
  return { ok: true };
}

// ── Popularity stats (the product_events table; see lib/track) ────────────────────────────────────────────────
/** The one-time setup for popularity stats, written for the signed-in admin. Visitors may only ADD an event; only this login can read or delete them. */
export function buildEventsSql(adminEmail: string): string {
  const email = (adminEmail || "YOUR-ADMIN-EMAIL").replace(/'/g, "''");
  const isAdmin = `lower(auth.jwt() ->> 'email') = lower('${email}')`;
  return `-- INS Overseas: popularity stats (run once; safe to run again)
create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  product_id text not null check (char_length(product_id) between 1 and 80),
  event text not null check (event in ('view', 'share', 'quote', 'enquire')),
  created_at timestamptz not null default now()
);
create index if not exists product_events_created_at_idx on public.product_events (created_at);

alter table public.product_events enable row level security;

do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'product_events' loop
    execute format('drop policy %I on public.product_events', p.policyname);
  end loop;
end $$;

-- visitors can only ADD a row (nothing else); only this admin login can read or delete them
create policy "Visitors can record an event" on public.product_events for insert to anon, authenticated with check (true);
create policy "Only the admin can read events" on public.product_events for select to authenticated using (${isAdmin});
create policy "Only the admin can delete events" on public.product_events for delete to authenticated using (${isAdmin});

grant insert on public.product_events to anon, authenticated;
grant select, delete on public.product_events to authenticated;

-- Optional tidy-up, now and then: keep only the last 180 days
-- delete from public.product_events where created_at < now() - interval '180 days';`;
}

/** Does the product_events table exist (and can the admin read it)? */
export async function probeEventsTable(): Promise<"ready" | "missing"> {
  const { error } = await supabase.from("product_events").select("id").limit(1);
  return error ? "missing" : "ready";
}

export type EventRow = { product_id: string; event: string; created_at: string };
/** Events since a date, fetched in pages (the database returns at most 1000 rows at a time). */
export async function fetchEventsSince(sinceIso: string): Promise<EventRow[]> {
  const rows: EventRow[] = [];
  for (let from = 0; from < 30000; from += 1000) {
    const { data, error } = await supabase
      .from("product_events")
      .select("product_id,event,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...((data ?? []) as EventRow[]));
    if (!data || data.length < 1000) break;
  }
  return rows;
}
