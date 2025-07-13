"use client";

import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";

/** plus one count realtime subscribe hook */
export function useCounts() {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchCounts = async () => {
    if (!supabase) return;

    setIsLoading(true);

    // 오늘 자정 (UTC 기준 2025-07-09T15:00:00.000Z 이후의 결과만 불러오기)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // 자정으로 기준시 설정
    const todayISO = startOfToday.toISOString(); // 한국 자정 -> UTC로 변환

    const [
      { count: totalCount, error: fetchTotalError },
      { count: todayCount, error: fetchTodayError },
    ] = await Promise.all([
      supabase
        .from("click_logs")
        .select("clicked_at", { count: "exact", head: true }),
      supabase
        .from("click_logs")
        .select("clicked_at", { count: "exact", head: true })
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
  }, [supabase]);

  return { total, today, isLoading, error };
}
