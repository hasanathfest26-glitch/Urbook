import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseEnabled = Boolean(url && key);

export function createClient() {
  if (!url || !key) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return createBrowserClient(url, key);
}
