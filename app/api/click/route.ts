import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { createNewUser } from "@/lib/create-new-user";
import { buildAPIResponse } from "@/lib/build-response";
import { getRemainTimeStatus } from "@/lib/get-remain-time-status";
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
  const isDev = process.env.NODE_ENV === "development";

  // 로컬에서 테스트할 경우 무조건 통과
  if ((ip === "::1" || ip === "127.0.0.1") && isDev) {
    // 유저 생성없이 로그만 추가
    await supabase
      .from("click_logs")
      .insert([{ ip, clicked_at: now.toISOString() }]);

    return buildAPIResponse({
      success: true,
      message: "플러스원 성공! (로컬 테스트)",
      status: 200,
    });
  }

  const session = await getSession();
  const { id: sessionId, clickedAt } = session;

  // 제대로 된 세션이 아닐 경우
  if (!sessionId || !clickedAt) {
    // 세션이 불완전하므로 파기
    await session.destroy();
    // 새 유저 생성
    return await createNewUser({ ip, now });
  }

  const remainTimeStatus = getRemainTimeStatus(clickedAt);

  // 남은 시간 세션의 값을 바탕으로 에러 처리
  if (!remainTimeStatus.canClick) {
    const { hoursLeft, minutesLeft, secondsLeft } = remainTimeStatus;

    return buildAPIResponse({
      success: false,
      message: `다음 플러스원까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초 남았어요.`,
      status: 429,
    });
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
      message: "플러스원 기록 조회 중 오류가 발생했습니다.",
      status: 500,
    });
  }

  // 세션은 존재하는데 클릭 기록이 없는 경우 -> 신규 사용자로 추가
  if (!existing) {
    console.warn(
      `세션 ID(${sessionId})에 대한 클릭 기록이 없습니다. 새 사용자로 처리합니다.`
    );

    await session.destroy();
    return await createNewUser({ ip, now });
  }

  // db clicked_at과 세션의 clicketAt 둘이 값이 다른 상황 -> 신규 사용자로 추가
  if (existing.clicked_at !== clickedAt) {
    await session.destroy();
    return await createNewUser({ ip, now });
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
