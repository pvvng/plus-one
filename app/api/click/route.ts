import { ONE_DAY_MS } from "@/constant";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { createNewUser } from "@/lib/create-new-user";
import { getTimeLeftUntil24Hours } from "@/lib/get-time-left";
import { buildAPIResponse } from "@/lib/build-response";
import { NextRequest } from "next/server";

/**
 * 클릭 이벤트를 처리하는 API 엔드포인트
 * GET 요청: 클릭 이벤트 기록 및 플러스원 처리
 */
export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return buildAPIResponse({
      success: false,
      message: "허용되지 않은 메서드입니다.",
      status: 405,
    });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 로컬에서 테스트할 경우 무조건 통과
  if (ip === "::1" || ip === "127.0.0.1") {
    await supabase
      .from("click_logs")
      .insert([{ ip, clicked_at: now.toISOString() }]);

    return buildAPIResponse({
      success: true,
      message: "플러스원 성공! (로컬 테스트)",
      status: 200,
    });
  }

  const { id: sessionId } = await getSession();

  // 세션이 없으면 새로 생성
  if (!sessionId) {
    return await createNewUser({ ip, now });
  }

  // 세션이 존재하는 경우엔 기존 클릭 확인
  const { data: existing, error: fetchError } = await supabase
    .from("clicks")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError) {
    console.error("클릭 기록 조회 중 오류 발생:", fetchError);

    return buildAPIResponse({
      success: false,
      message: fetchError?.message,
      status: 500,
    });
  }

  // 세션은 존재하는데 클릭 기록이 없는 경우 -> 신규 사용자로 추가
  if (!existing) {
    return await createNewUser({ ip, now });
  }

  // 기존 세션이 존재하는 경우
  const prevClick = new Date(existing.clicked_at);
  const diff = now.getTime() - prevClick.getTime();

  // 24시간 이내에 다시 클릭한 경우
  if (diff < ONE_DAY_MS) {
    const { hoursLeft, minutesLeft, secondsLeft } =
      getTimeLeftUntil24Hours(diff);

    return buildAPIResponse({
      success: false,
      message: `다음 플러스원까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초 남았어요.`,
      status: 429,
    });
  }

  // 기존 사용자 & 24시간 경과 -> 업데이트
  await supabase
    .from("clicks")
    .update({ ip, clicked_at: now.toISOString() })
    .eq("id", sessionId);

  // 클릭 로그 작성
  await supabase
    .from("click_logs")
    .insert([{ uuid: sessionId, ip, clicked_at: now.toISOString() }]);

  return buildAPIResponse({
    success: true,
    message: "플러스원 성공!",
    status: 200,
  });
}
