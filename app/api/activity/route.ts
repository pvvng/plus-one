import { generatePastYearData } from "@/lib/generate-past-year-data";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

const INITIAL_DATA = {
  activity: generatePastYearData(new Date().toISOString()),
  count: 0,
};

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json({
      data: INITIAL_DATA,
    });
  }

  const session = await getSession();
  const sessionId = session.id;

  // 최초 접속하는 사용자는 세션 정보가 확인되지 않으므로 확실히 에러라고 볼 수 없다
  if (!sessionId) {
    console.warn("세션 정보가 확인되지 않습니다.");
    return NextResponse.json({
      success: true,
      data: INITIAL_DATA,
    });
  }

  const { data, error, count } = await supabase
    .from("click_logs")
    .select("clicked_at", { count: "exact" })
    .eq("uuid", sessionId);

  if (!data || error) {
    console.error("클릭 로그를 불러오는 중 에러가 발생했습니다: ", error);
    return NextResponse.json({
      success: false,
      data: INITIAL_DATA,
    });
  }

  const today = new Date().toISOString();
  const activityData = generatePastYearData(today); // 모든 날짜를 0으로 초기화

  // clicked_at 날짜 문자열들을 "YYYY-MM-DD" 형태로 변환
  const clickedDates = new Set(
    data.map((item) => item.clicked_at.split("T")[0])
  );

  // 일치하는 날짜는 count/level을 1로 변경
  const updated = activityData.map((entry) =>
    clickedDates.has(entry.date) ? { ...entry, count: 1, level: 1 } : entry
  );

  return NextResponse.json({
    success: true,
    data: {
      activity: updated,
      count,
    },
  });
}
