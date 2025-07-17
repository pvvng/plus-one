import { getRemainTimeStatus } from "@/util/time/get-remain-time-status";
import { AuthError, PostgrestError } from "@supabase/supabase-js";

export enum PlusOneServiceStatus {
  CREATE_LOG_ERROR = "CREATE_LOG_ERROR",
  GET_UUID_ERROR = "GET_UUID_ERROR",
  INVALID_SESSION = "INVALID_SESSION",
  GET_SESSION_ERROR = "GET_SESSION_ERROR",
  TOO_EARLY = "TOO_EARLY",
  UPDATE_LAST_CLICKED_ERROR = "UPDATE_LAST_CLICKED_ERROR",
  SUCCESS = "SUCCESS",
}

export type PlusOneServiceResult =
  | {
      status: PlusOneServiceStatus.CREATE_LOG_ERROR;
      error: PostgrestError | string;
    }
  | {
      status: PlusOneServiceStatus.UPDATE_LAST_CLICKED_ERROR;
      error: PostgrestError;
    }
  | {
      status: PlusOneServiceStatus.GET_UUID_ERROR;
      error: PostgrestError | AuthError | string;
    }
  | {
      status: PlusOneServiceStatus.GET_UUID_ERROR;
      error: PostgrestError | AuthError | string;
    }
  | {
      status: PlusOneServiceStatus.INVALID_SESSION;
      warn: string;
    }
  | {
      status: PlusOneServiceStatus.GET_SESSION_ERROR;
      error: PostgrestError | AuthError | string;
    }
  | {
      status: PlusOneServiceStatus.TOO_EARLY;
      remainTimeStatus: ReturnType<typeof getRemainTimeStatus>;
    }
  | { status: PlusOneServiceStatus.SUCCESS };

export enum LogSessionStatus {
  NO_SESSION = "NO_SESSION", // 세션 없음 -> 클릭가능
  VALID = "VALID", // 세션 존재하나 유효기간 지남 -> 클릭 가능
  INVALID_SESSION = "INVALID_SESSION", // 유효하지 않은 세션 -> 세션 삭제 후 리디렉트 (fatal)
  TOO_EARLY = "TOO_EARLY", // 유효기간 존재 (fatal)
  DB_ERROR = "DB_ERROR", // DB 호출 중 에러 발생 (fatal)
}

export type ValidateLogSessionResult =
  | { status: LogSessionStatus.NO_SESSION }
  | { status: LogSessionStatus.INVALID_SESSION; warn: string }
  | { status: LogSessionStatus.DB_ERROR; error: PostgrestError }
  | {
      status: LogSessionStatus.TOO_EARLY;
      remainTimeStatus: ReturnType<typeof getRemainTimeStatus>;
    }
  | { status: LogSessionStatus.VALID };
