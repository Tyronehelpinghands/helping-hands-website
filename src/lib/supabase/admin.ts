import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Server-only Supabase client with the service role key.
 * Never import this from client components or expose the key as NEXT_PUBLIC_*.
 */
export function getServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isAdminConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getServiceRoleKey());
}

export function createAdminClient(): SupabaseClient {
  const url = getSupabaseUrl();
  const key = getServiceRoleKey();

  if (!url || !key) {
    throw new Error(
      "Supabase admin is niet geconfigureerd. Stel NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in.",
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
