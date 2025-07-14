import { buildAPIResponse } from "@/util/build-response";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateSession } from "@/lib/session/update";
import {
  LogSessionStatus,
  validateLogSession,
} from "@/lib/supabase/actions/validate-log-session";
import { createLog, CreateLogStatus } from "@/lib/supabase/actions/create-log";
import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/session/get";

/**
 * 클릭 이벤트를 처리하는 API 엔드포인트
 * GET 요청: 클릭 이벤트 기록 및 플러스원 처리
 */
export async function POST(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const now = new Date().toISOString();
  const isDev = process.env.NODE_ENV === "development";

  // 로컬에서 테스트할 경우 무조건 통과
  if ((ip === "::1" || ip === "127.0.0.1") && isDev) {
    // 유저 연동없이 로그만 추가
    const createLogResult = await createLog({ ip, now });
    if (createLogResult.status === CreateLogStatus.DB_ERROR) {
      console.error("로그 생성 실패: ", createLogResult.error);

      return buildAPIResponse({
        success: false,
        message: "플러스원 생성 실패. 잠시 후 다시 시도해주세요",
        status: 500,
      });
    }

    // 세션 업데이트
    const logId = createLogResult.logId;
    await updateSession({ logId, now });

    revalidateTag("activity");

    return buildAPIResponse({
      success: true,
      message: "플러스원 성공! (로컬 테스트)",
      status: 200,
    });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const uuid = user?.id;

  // 세션 검증
  const validateLogSessionResult = await validateLogSession();

  // 유효하지만 유효기간이 남은 세션
  if (validateLogSessionResult.status === LogSessionStatus.TOO_EARLY) {
    const { hoursLeft, minutesLeft, secondsLeft } =
      validateLogSessionResult.remainTimeStatus;

    console.warn(
      `[플러스원 차단] uuid: ${uuid}, ip: ${ip}, 남은 시간: ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`
    );

    return buildAPIResponse({
      success: false,
      message: `다음 플러스원까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초 남았어요.`,
      status: 429,
    });
  }
  // 유효하지 않은 세션 혹은 유효한 세션이지만 만료 기간이 지났음에도 삭제되지 않은 세션
  if (
    validateLogSessionResult.status === LogSessionStatus.INVALID_SESSION ||
    validateLogSessionResult.status === LogSessionStatus.VALID
  ) {
    const session = await getSession();
    await session.destroy; // 세션 파괴
  }

  // 클릭 로그 작성
  const createLogResult = await createLog({ uuid, ip, now });
  if (createLogResult.status === CreateLogStatus.DB_ERROR) {
    console.error("로그 생성 실패: ", createLogResult.error);

    return buildAPIResponse({
      success: false,
      message: "플러스원 생성 실패. 잠시 후 다시 시도해주세요",
      status: 500,
    });
  }
  const logId = createLogResult.logId;
  // 세션 업데이트
  await updateSession({ logId, now });

  // 스트릭 데이터 revalidate
  revalidateTag("activity");

  return buildAPIResponse({
    success: true,
    message: "플러스원 성공!",
    status: 200,
  });
}
