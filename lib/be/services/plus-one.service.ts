import { updateSession } from "../infra/session/update";
import { createClient } from "../infra/supabase/server";
import {
  LogSessionStatus,
  PlusOneServiceResult,
  PlusOneServiceStatus,
  ValidateLogSessionResult,
} from "../contants/types/plus-one";
import { getSession, SessionData } from "../infra/session/get";

import { getRemainTimeStatus } from "@/util/time/get-remain-time-status";

import {
  createLog,
  findClickLogById,
} from "../repositories/click_logs.repository";
import {
  findUserById,
  updateUserLastClickedAt,
} from "../repositories/user.repository";
import { getAuthenticatedUser } from "../repositories/auth.repository";

import { revalidateTag } from "next/cache";

import { RepositoryStatus } from "../contants/types/repository";
import {
  AuthError,
  PostgrestError,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export async function plusOneService({
  ip,
  now,
  isDev = false,
}: {
  ip: string;
  now: string;
  isDev?: boolean;
}): Promise<PlusOneServiceResult> {
  const supabase = await createClient(); // 클라이언트 생성
  const session = await getSession(); // 세션 생성

  // dev mode 처리
  if (isDev) {
    const createLogResult = await createLog({
      ip,
      now,
      client: supabase,
    });

    // 로그 생성 에러 처리
    if (createLogResult.status !== RepositoryStatus.SUCCESS) {
      return {
        status: PlusOneServiceStatus.CREATE_LOG_ERROR,
        error: createLogResult.error,
      };
    }

    return { status: PlusOneServiceStatus.SUCCESS };
  }

  const getUUIDResult = await getUUID({ client: supabase });
  if (!getUUIDResult.ok) {
    return {
      status: PlusOneServiceStatus.GET_UUID_ERROR,
      error: getUUIDResult.error,
    };
  }

  // 사용자 UUID (비회원은 undfiend)
  const uuid = getUUIDResult.uuid;

  // 사용자 세션 검증
  const sessionValidateResult = await validateLogSession({
    sessionData: { ...session },
    client: supabase,
  });
  switch (sessionValidateResult.status) {
    case LogSessionStatus.DB_ERROR:
      return {
        status: PlusOneServiceStatus.GET_SESSION_ERROR,
        error: sessionValidateResult.error,
      };
    case LogSessionStatus.TOO_EARLY:
      return {
        status: PlusOneServiceStatus.TOO_EARLY,
        remainTimeStatus: sessionValidateResult.remainTimeStatus,
      };
    case LogSessionStatus.INVALID_SESSION:
      await session.destroy(); // 유효하지 않은 세션 파괴
      return {
        status: PlusOneServiceStatus.INVALID_SESSION,
        warn: sessionValidateResult.warn,
      };
  }

  // 클릭 로그 생성
  const createLogResult = await createLog({
    ip,
    now,
    uuid,
    client: supabase,
  });

  // 로그 생성 에러 처리
  if (createLogResult.status !== RepositoryStatus.SUCCESS) {
    return {
      status: PlusOneServiceStatus.CREATE_LOG_ERROR,
      error: createLogResult.error,
    };
  }

  // 세션 업데이트
  const logData = createLogResult.data;
  const logId = logData.id;
  await updateSession({ logId, now });

  // 비회원 작업 종료
  if (!uuid) {
    return { status: PlusOneServiceStatus.SUCCESS };
  }

  // last_clicked_at 필드 업데이트
  const updateResult = await updateUserLastClickedAt({
    uuid,
    clickedAt: now,
    client: supabase,
  });

  if (updateResult.status !== RepositoryStatus.SUCCESS) {
    return {
      status: PlusOneServiceStatus.UPDATE_LAST_CLICKED_ERROR,
      error: updateResult.error,
    };
  }

  revalidateTag("activity");

  // 회원 작업 종료
  return { status: PlusOneServiceStatus.SUCCESS };
}

async function getUUID({
  client,
}: {
  client: SupabaseClient<Database>;
}): Promise<
  | { ok: true; uuid: string | undefined }
  | { ok: false; error: PostgrestError | AuthError | string }
> {
  // 로그인 유무 확인 (회원: uuid 존재, 비회원: uuid undefined)
  const getAuthUserResult = await getAuthenticatedUser({ client });

  // raw userdata 불러오는 중 오류 발생 (fatal)
  if (getAuthUserResult.status === RepositoryStatus.DB_ERROR) {
    return { ok: false, error: getAuthUserResult.error };
  }

  // 비회원
  if (getAuthUserResult.status === RepositoryStatus.NOT_FOUND) {
    return { ok: true, uuid: undefined };
  }

  const rawUserdata = getAuthUserResult.data;
  const uuid = rawUserdata.id;

  // raw uuid 검증
  const validateUUIDResult = await validateUUID({
    uuid,
    client,
  });

  // 로그인하였으나 DB에 존재하지 않는 사용자 (fatal)
  if (!validateUUIDResult.ok) {
    return { ok: false, error: validateUUIDResult.error };
  }

  return { ok: true, uuid };
}

async function validateUUID({
  uuid,
  client,
}: {
  uuid: string;
  client: SupabaseClient<Database>;
}): Promise<{ ok: false; error: PostgrestError | string } | { ok: true }> {
  const findUserResult = await findUserById({ uuid, client });
  if (findUserResult.status === RepositoryStatus.NOT_FOUND) {
    // fatal
    return { ok: false, error: findUserResult.error };
  }
  if (findUserResult.status === RepositoryStatus.DB_ERROR) {
    // fatal
    return { ok: false, error: findUserResult.error };
  }
  return { ok: true };
}

async function validateLogSession({
  sessionData,
  client,
}: {
  sessionData: SessionData;
  client: SupabaseClient<Database>;
}): Promise<ValidateLogSessionResult> {
  const logId = sessionData.logId;
  const clickedAt = sessionData.clickedAt;

  if (!logId || !clickedAt) {
    return { status: LogSessionStatus.NO_SESSION };
  }

  const findResult = await findClickLogById({ logId, client });

  if (findResult.status === RepositoryStatus.DB_ERROR) {
    return { status: LogSessionStatus.DB_ERROR, error: findResult.error };
  }

  if (findResult.status === RepositoryStatus.NOT_FOUND) {
    return {
      status: LogSessionStatus.INVALID_SESSION,
      warn: "DB에 세션 아이디가 존재하지 않음",
    };
  }

  // 클릭 로그
  const clickLog = findResult.data;

  const isValidSession =
    new Date(clickLog.clicked_at).getTime() === new Date(clickedAt).getTime();

  if (!isValidSession) {
    return {
      status: LogSessionStatus.INVALID_SESSION,
      warn: "DB에 저장된 값과 일치하지 않는 세션",
    };
  }

  const remainTimeStatus = getRemainTimeStatus(clickLog.clicked_at);
  // 클릭 불가 (fatal)
  if (!remainTimeStatus.canClick) {
    return {
      status: LogSessionStatus.TOO_EARLY,
      remainTimeStatus,
    };
  }

  // 클릭 가능
  return { status: LogSessionStatus.VALID };
}
