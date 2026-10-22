import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabaseConfig";

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
  return supabase.from("site_images").delete().in("id", items.map((i) => i.id));
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
