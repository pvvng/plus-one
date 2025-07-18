"use server";

import { createClient } from "@/lib/be/infra/supabase/server";
import { Database } from "@/types/supabase";
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

type User = Database["public"]["Tables"]["users"]["Row"];

enum GetUserStatus {
  NOT_LOGGED_IN,
  DB_MISSING,
  ERROR,
  SUCCESS,
}

type GetUserResult =
  | { status: GetUserStatus.NOT_LOGGED_IN }
  | { status: GetUserStatus.DB_MISSING }
  | { status: GetUserStatus.ERROR }
  | { status: GetUserStatus.SUCCESS; data: User };

/**
 * #### 사용자의 로그인 정보를 기반으로 DB에 저장된 사용자 데이터를 반환하는 supabase action
 * @returns `GetUserStatus`
 * - NOT_LOGGED_IN - 로그인 하지 않은 사용자
 * - DB_MISSING - 로그인 하였으나 DB에 등록되지 않은 사용자
 * - ERROR - 에러 상황
 * - SUCCESS - userdata 반환 성공 (data 함께 반환)
 */
export async function getUserData(): Promise<GetUserResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    return { status: GetUserStatus.ERROR };
  }

  if (!user) {
    return { status: GetUserStatus.NOT_LOGGED_IN };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { status: GetUserStatus.ERROR };
  }

  if (!data) {
    return { status: GetUserStatus.DB_MISSING };
  }

  return {
    status: GetUserStatus.SUCCESS,
    data,
  };
}
