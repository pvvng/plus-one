import { getSession } from "@/lib/be/infra/session/get";
import { updateSession } from "@/lib/be/infra/session/update";
import {
  createLog,
  CreateLogStatus,
} from "@/lib/be/infra/supabase/actions/create-log";
import {
  LogSessionStatus,
  validateLogSession,
} from "@/lib/be/infra/supabase/actions/validate-log-session";
import { createClient } from "@/lib/be/infra/supabase/server";
import { buildAPIResponse } from "@/util/build-response";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

function getClientIP(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}

function isLocalTest(ip: string) {
  const isDev = process.env.NODE_ENV === "development";
  return isDev && ["::1", "127.0.0.1"].includes(ip);
}

interface HandlePlusOneProps {
  ip: string;
  now: string;
  uuid?: string;
  isDev?: boolean;
}

async function handlePlusOne({
  ip,
  now,
  uuid,
  isDev = false,
}: HandlePlusOneProps) {
  const createLogResult = await createLog({ ip, now, uuid });

  if (createLogResult.status === CreateLogStatus.DB_ERROR) {
    console.error("로그 생성 실패: ", createLogResult.error);
    return buildAPIResponse({
      success: false,
      message: "플러스원 생성 실패. 잠시 후 다시 시도해주세요",
      status: 500,
    });
  }

  const logId = createLogResult.logId;
  await updateSession({ logId, now });

  revalidateTag("activity");

  return buildAPIResponse({
    success: true,
    message: `플러스원 성공!${isDev ? " (로컬 테스트)" : ""}`,
    status: 200,
  });
}

async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
}

async function handleInvalidOrEarlySession(
  uuid: string | undefined,
  ip: string
) {
  const result = await validateLogSession();

  if (result.status === LogSessionStatus.TOO_EARLY) {
    const { hoursLeft, minutesLeft, secondsLeft } = result.remainTimeStatus;
    console.warn(
      `[플러스원 차단] uuid: ${uuid}, ip: ${ip}, 남은 시간: ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`
    );
    return buildAPIResponse({
      success: false,
      message: `다음 플러스원까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초 남았어요.`,
      status: 429,
    });
  }

  if (
    result.status === LogSessionStatus.INVALID_SESSION ||
    result.status === LogSessionStatus.VALID
  ) {
    const session = await getSession();
    try {
      await session.destroy();
    } catch (e) {
      console.error("세션 파괴 실패", e);
    }
  }

  return null; // 세션 상태 문제 없음
}

/**
 * 클릭 이벤트를 처리하는 API 엔드포인트
 * GET 요청: 클릭 이벤트 기록 및 플러스원 처리
 */
export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const now = new Date().toISOString();

  // 로컬에서 테스트할 경우 무조건 통과
  if (isLocalTest(ip)) {
    return await handlePlusOne({ ip, now, isDev: true });
  }

  const uuid = await getCurrentUserId();

  // 세션 검증
  const sessionError = await handleInvalidOrEarlySession(uuid, ip);
  if (sessionError) return sessionError;

  return await handlePlusOne({ uuid, ip, now });
}
