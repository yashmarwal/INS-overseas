/*
  SUPABASE SETUP (one-time):

  1. supabase.com → your project → Storage → bucket "website-images" (Public: YES, so visitors can see the photos).
  2. Table "site_images": id (uuid), section, label, url, storage_path, created_at, plus sort_order, alt_text,
     product_name, category (and optional tag, featured).
  3. Authentication → Users → Add user: the admin's email + a strong password (tick "Auto Confirm User").
     Authentication → Sign In / Providers → turn OFF "Allow new users to sign up".
  4. Sign in at /admin. The Overview page shows the database-setup SQL, filled in with your admin email.
     Paste it into Supabase → SQL Editor and run it: it makes the database read-only for everyone except the admin.

  The key below is the PUBLIC "anon" key. It is meant to be visible; it is the database rules (step 4) that protect the data.
  Never put the "service_role" key anywhere in this project.
*/

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // The admin's login lives in sessionStorage: closing the tab signs them out.
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
