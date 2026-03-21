"use client";

import { useEffect, useState } from "react";
import { createAuthBrowserClient } from "@/lib/supabase/authClient";
import type { Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createAuthBrowserClient();

    supabase.auth.getSession().then((result: { data: { session: Session | null } }) => {
      setSession(result.data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, newSession: Session | null) => {
        setSession(newSession);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { session, isLoading };
}
