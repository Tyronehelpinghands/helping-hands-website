"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "sidebar" | "default";
};

export default function LogoutButton({
  className,
  variant = "default",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (variant === "sidebar") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white",
          className,
        )}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {loading ? "Uitloggen…" : "Uitloggen"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-white/25 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#F28C28] focus:ring-offset-2 focus:ring-offset-[#0B1F4D] disabled:opacity-60",
        className,
      )}
    >
      {loading ? "Uitloggen…" : "Uitloggen"}
    </button>
  );
}
