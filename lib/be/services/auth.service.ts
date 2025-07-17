// types
import {
  AuthUserStatus,
  ExchangeCodeForSessionResult,
  ExchangeSessionStatus,
  GetAuthenticatedUserResult,
  SessionLinkStatus,
  SyncAnonymousSessionWithUserResult,
} from "../contants/types/auth";
// infra
import { createClient } from "../infra/supabase/server";
import { getSession } from "../infra/session/get";
import { updateSession } from "../infra/session/update";

// repo
import {
  findUserById,
  updateUserLastClickedAt,
} from "../repositories/user.repository";
import { RepositoryStatus } from "../contants/types/repository";
import {
  findClickLogById,
  updateClickLogUUID,
} from "../repositories/clicked_at.repository";

/** auth 코드 세션으로 전환 */
export async function handleExchangeCodeForSession(
  code: string
): Promise<ExchangeCodeForSessionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return {
      status: ExchangeSessionStatus.ERROR,
      error,
    };
  }
  return { status: ExchangeSessionStatus.SUCCESS };
}

/** 현재 로그인한 사용자 auth 정보 호출 */
export async function getAuthenticatedUser(): Promise<GetAuthenticatedUserResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: AuthUserStatus.NOT_FOUND, error: "사용자 없음" };
  }
  if (error) {
    return { status: AuthUserStatus.ERROR, error };
  }

  return { status: AuthUserStatus.SUCCESS, data: user };
}

export async function handleExistingUserFlow({ uuid }: { uuid: string }) {
  // 이전에 이미 가입한 사용자인지 확인
  const findUserByIdResult = await findUserById({ uuid });

  // 기존 사용자 조회 중 에러
  if (findUserByIdResult.status === RepositoryStatus.DB_ERROR) {
    return; // DB 에러 enum
  }

  // 이미 존재하는 사용자라면 세션 업데이트 후 정상 리디렉트
  if (findUserByIdResult.status === RepositoryStatus.SUCCESS) {
    const result = await syncAnonymousSessionWithUser({
      uuid: findUserByIdResult.data.id,
      lastClickedAt: findUserByIdResult.data.last_clicked_at,
    });
    if (result.status === SessionLinkStatus.INVALID_SESSION) {
      console.warn("warning: ", result.warn);
    }
    if (result.status === SessionLinkStatus.DB_ERROR) {
      console.error("세션 동기화 중 에러 발생: ", result.error);
      return;
    }
    return; //
  }

  return; // 최초 로그인 처리
}

/**
 * #### 익명 log session과 현재 유저와의 싱크 맞추는 함수
 * @param uuid - 사용자 id
 * @param lastClickedAt - DB 기준 사용자의 마지막 plusone 시간 (optional)
 * @returns `SessionLinkStatus`
 * - INVALID_SESSION - 유효하지 않은 세션
 * - DB_ERROR - DB 에러 발생 (fatal)
 * - SUCCESS - 성공적으로 싱크 맞춰짐
 */
export async function syncAnonymousSessionWithUser({
  uuid,
  lastClickedAt,
}: {
  uuid: string;
  lastClickedAt?: string | null;
}): Promise<SyncAnonymousSessionWithUserResult> {
  const session = await getSession(); // 세션 호출
  const sessionId = session.logId;
  const clickedAt = session.clickedAt;

  // lastClickedAt이 있다면 기존 세션과 무관하게 세션을 lastClickedAt 기준으로 업데이트
  if (lastClickedAt && lastClickedAt.trim()) {
    // 쿠키를 삭제하지 않는 이상 logId가 아닌
    // lastClickedAt으로 시간을 판별하므로 logId는 정의되지 않아도 괜찮다.
    // TODO: 다만, 확실하게 하려면 last_logId를 저장하는 필드가 users table에 필요할것 같다
    await updateSession({ logId: undefined, now: lastClickedAt });

    // 등록되지 않은 logId가 있다면 클릭 로그와 연동
    if (sessionId) {
      const updateClickLogUUIDResult = await updateClickLogUUID({
        uuid,
        logId: sessionId,
      });
      if (updateClickLogUUIDResult.status === RepositoryStatus.DB_ERROR) {
        return {
          status: SessionLinkStatus.DB_ERROR,
          error: updateClickLogUUIDResult.error,
        };
      }
    }

    return { status: SessionLinkStatus.SUCCESS };
  }

  // last_clicked_at과 session 모두 존재하지 않으면 pass
  if (!sessionId || !clickedAt) {
    return {
      status: SessionLinkStatus.INVALID_SESSION,
      warn: "동기화할 세션/기록 없음",
    };
  }

  // 세션이 존재하는 경우엔 동기화가 필요
  // 현재 세션이 정말 유효한 세션인지 검증
  const findClickLogByIdResult = await findClickLogById({ logId: sessionId });

  // 세션 불러오는 중 에러 발생
  if (findClickLogByIdResult.status === RepositoryStatus.DB_ERROR) {
    return {
      status: SessionLinkStatus.DB_ERROR,
      error: findClickLogByIdResult.error,
    };
  }

  // 유효하지 않은 세션 처리 (DB에 존재하지 않음)
  if (findClickLogByIdResult.status === RepositoryStatus.NOT_FOUND) {
    await session.destroy(); // 확실히 문제있는 세션 파괴

    return {
      status: SessionLinkStatus.INVALID_SESSION,
      warn: "유효한 세션이 아님",
    };
  }

  const logId = findClickLogByIdResult.data.id;

  // 세션 기준으로 사용자 last_clicked_at 필드 업데이트
  const UpdateUserLastClickedAtResult = await updateUserLastClickedAt({
    uuid,
    clickedAt,
  });
  if (UpdateUserLastClickedAtResult.status === RepositoryStatus.DB_ERROR) {
    return {
      status: SessionLinkStatus.DB_ERROR,
      error: UpdateUserLastClickedAtResult.error,
    };
  }

  // 클릭 로그에 현재 사용자 추가
  const updateClickLogUUIDResult = await updateClickLogUUID({ uuid, logId });

  if (updateClickLogUUIDResult.status === RepositoryStatus.DB_ERROR) {
    return {
      status: SessionLinkStatus.DB_ERROR,
      error: updateClickLogUUIDResult.error,
    };
  }

  return { status: SessionLinkStatus.SUCCESS };
}
