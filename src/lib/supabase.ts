/*
  SUPABASE SETUP (one-time):

  1. Go to supabase.com → New Project → name it "ins-overseas"
  2. Go to Storage → Create bucket → name: "website-images" → Public: YES
  3. Go to Table Editor → New Table:
       Table name: site_images
       Columns:
         - id: uuid, primary key, default: gen_random_uuid()
         - section: text, not null
         - label: text, not null
         - url: text, not null
         - storage_path: text, not null
         - created_at: timestamptz, default: now()
  4. Go to Settings → API → copy Project URL and anon key into .env
  5. Go to Storage → website-images → Policies → Add policy:
       "Allow public read"  → SELECT → For all users
       "Allow anon upload"  → INSERT, UPDATE, DELETE → For anon users
*/

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabaseConfig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
