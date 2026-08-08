import { isValidRole, type Profile } from "@/lib/supabase/types";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email?: string;
};

export type CurrentUserResult = {
  user: CurrentUser | null;
  profile: Profile | null;
};

/**
 * Server-side: haal de ingelogde Supabase-gebruiker + profiel/rol op.
 * Geeft { user: null, profile: null } terug als er geen sessie is of
 * Supabase niet geconfigureerd is — nooit een fout die de pagina crasht.
 */
export async function getCurrentUser(): Promise<CurrentUserResult> {
  if (!isSupabaseConfigured()) {
    return { user: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role, full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !isValidRole(profile.role)) {
    return { user: { id: user.id, email: user.email ?? undefined }, profile: null };
  }

  return {
    user: { id: user.id, email: user.email ?? undefined },
    profile: {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name,
      phone: profile.phone ?? null,
    } as Profile,
  };
}
