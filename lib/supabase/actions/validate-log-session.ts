import { getRemainTimeStatus } from "@/util/time/get-remain-time-status";
import { createClient } from "../server";
import { getSession } from "@/lib/session/get";

export enum LogSessionStatus {
  NO_SESSION,
  INVALID_SESSION,
  TOO_EARLY,
  VALID,
}

type ValidateLogSessionResult =
  | { status: LogSessionStatus.NO_SESSION }
  | { status: LogSessionStatus.INVALID_SESSION }
  | {
      status: LogSessionStatus.TOO_EARLY;
      remainTimeStatus: ReturnType<typeof getRemainTimeStatus>;
    }
  | { status: LogSessionStatus.VALID };

/**
 * #### 로그 세션 검증 supabase action
 * @returns `LogSessionStatus`
 * - NO_SESSION - 세션이 존재하지 않음
 * - INVALID_SESSION - 유효하지 않은 세션
 * - TOO_EARLY - 아직 만료되지 않은 세션 (현재 시간 상태 반환: `ReturnType<typeof getRemainTimeStatus>`)
 * - VALID - 유효하며 만료된 세션
 */
export async function validateLogSession(): Promise<ValidateLogSessionResult> {
  const supabase = await createClient();
  const session = await getSession();
  const { id: sessionId, clickedAt } = session;

  if (!session || !sessionId || !clickedAt) {
    return { status: LogSessionStatus.NO_SESSION };
  }

  const { data: clickLog, error: fetchClickLogError } = await supabase
    .from("click_logs")
    .select("clicked_at")
    .eq("id", sessionId)
    .single();

  if (fetchClickLogError || !clickLog) {
    return { status: LogSessionStatus.INVALID_SESSION };
  }

  const isValidSession =
    new Date(clickLog.clicked_at).getTime() === new Date(clickedAt).getTime();

  if (!isValidSession) {
    return { status: LogSessionStatus.INVALID_SESSION };
  }

  const remainTimeStatus = getRemainTimeStatus(clickLog.clicked_at);
  if (!remainTimeStatus.canClick) {
    return { status: LogSessionStatus.TOO_EARLY, remainTimeStatus };
  }

  return { status: LogSessionStatus.VALID };
}
