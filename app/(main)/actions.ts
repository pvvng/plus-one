"use server";

import { createClient } from "@/lib/supabase/server";
import { generatePastYearData } from "@/util/time/generate-past-year-data";
import { getKoreanDate } from "@/util/time/get-korean-date";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

async function _getActivity({
  userId,
  cookieStore,
}: {
  userId?: string;
  cookieStore: ReturnType<typeof cookies>;
}) {
  const today = getKoreanDate();
  const activityData = generatePastYearData(today); // 모든 날짜를 0으로 초기화

  const INITIAL_DATA = {
    activity: [...activityData],
    count: 0,
  };

  if (!userId) {
    return {
      success: true,
      data: INITIAL_DATA,
    };
  }

  const supabase = await createClient(cookieStore);
  const { data, error, count } = await supabase
    .from("click_logs")
    .select("clicked_at", { count: "exact" })
    .eq("uuid", userId);

  console.log(data, error, count);
  if (!data || error) {
    console.error("클릭 로그를 불러오는 중 에러가 발생했습니다: ", error);
    return {
      success: false,
      data: INITIAL_DATA,
    };
  }

  // clicked_at 날짜 문자열들을 "YYYY-MM-DD" 형태로 변환
  const clickedDates = new Set(
    data.map((item) => item.clicked_at.split("T")[0])
  );

  // 일치하는 날짜는 count/level을 1로 변경
  const updated = activityData.map((entry) =>
    clickedDates.has(entry.date) ? { ...entry, count: 1, level: 1 } : entry
  );

  return {
    success: true,
    data: {
      activity: updated,
      count: count ?? 0,
    },
  };
}

/** activity 스트릭 데이터 호출 + 캐시 함수 */
export async function getActivity(userId: string | undefined) {
  const cookieStore = cookies();

  return unstable_cache(
    () => _getActivity({ userId, cookieStore }),
    ["activity_cache_key"],
    {
      revalidate: (60 * 60 * 24) / 2, // 반나절
      tags: ["activity"],
    }
  )();
}
