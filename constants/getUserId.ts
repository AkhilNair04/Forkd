// hooks/useUserId.ts
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) {
        setUserId(data?.user?.id ?? null);
      } else {
        console.error("Failed to get user:", error.message);
      }
    };

    fetchUser();
  }, []);

  return userId;
}
