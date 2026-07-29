"use server";

import { createClient } from "@/lib/supabase/server";

export type AppNotification = {
  id: string;
  title: string;
  body: string | null;
  category: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export async function getMyNotifications(limit = 20): Promise<{
  items: AppNotification[];
  unreadCount: number;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { items: [], unreadCount: 0 };

    const { data, error } = await supabase
      .from("app_notifications")
      .select("id, title, body, category, link, read_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { items: [], unreadCount: 0 };

    const items = (data ?? []) as AppNotification[];
    const unreadCount = items.filter((n) => !n.read_at).length;
    return { items, unreadCount };
  } catch {
    return { items: [], unreadCount: 0 };
  }
}
