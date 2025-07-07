"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    setIsLoading(true);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayISO = startOfToday.toISOString();

    const [
      { count: totalCount, error: fetchTotalError },
      { count: todayCount, error: fetchTodayError },
    ] = await Promise.all([
      supabase.from("click_logs").select("*", { count: "exact", head: true }),
      supabase
        .from("click_logs")
        .select("*", { count: "exact", head: true })
        .gte("clicked_at", todayISO),
    ]);

    if (fetchTotalError || fetchTodayError) {
      setError(
        "데이터를 불러오는 중 오류가 발생했습니다. 새로고침 후 다시 시도해주세요."
      );
      return setIsLoading(false);
    }

    setTotal(totalCount ?? 0);
    setToday(todayCount ?? 0);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCounts();

    const channel = supabase
      .channel("realtime:click_logs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "click_logs" },
        () => {
          fetchCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { total, today, isLoading, error };
}
