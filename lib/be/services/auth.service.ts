// infra
import { createClient } from "../infra/supabase/server";
import { getSession, SessionData } from "../infra/session/get";
import { updateSession } from "../infra/session/update";
// util
import { extractUserInfo } from "../utils/extract-user-info";
// repo
import {
  findUserById,
  insertUser,
  updateUserLastClickedAt,
} from "../repositories/user.repository";
import { updateClickLogUUID } from "../repositories/clicked_at.repository";
import { RepositoryStatus } from "../contants/types/repository";
// types
import {
  AuthError,
  PostgrestError,
  SupabaseClient,
  User,
} from "@supabase/supabase-js";
import { AuthServiceResult, AuthServiceStatus } from "../contants/types/auth";

export async function authService(code: string): Promise<AuthServiceResult> {
  const supabase = await createClient(); // client 생성

  // exchange code to session
  const exchangeCodeResult = await handleExchangeCode(code, {
    client: supabase,
  });
  if (!exchangeCodeResult.ok) {
    // 에러 enum 반환
    return {
      status: AuthServiceStatus.EXCHANGE_CODE_ERROR,
      error: exchangeCodeResult.error,
    };
  }

  // check user authentication
  const getAuthUserResult = await getAuthenticatedUser({ client: supabase });
  if (!getAuthUserResult.ok) {
    // 에러 enum 반환
    return {
      status: AuthServiceStatus.AUTH_USER_ERROR,
      error: getAuthUserResult.error,
    };
  }

  // extract data
  const user = getAuthUserResult.data;
  const { uuid, username, email, provider } = extractUserInfo(user);

  // 사용자 검색
  const findUserResult = await findUserById({ uuid, client: supabase });
  // DB 에러
  if (findUserResult.status === RepositoryStatus.DB_ERROR) {
    return {
      status: AuthServiceStatus.FIND_USER_ERROR,
      error: findUserResult.error,
    };
  }
  // 신규 사용자
  if (findUserResult.status === RepositoryStatus.NOT_FOUND) {
    // insert new user
    const insertUserResult = await insertUser({
      uuid,
      username,
      email,
      provider,
      client: supabase,
    });
    // insert error 처리
    if (insertUserResult.status !== RepositoryStatus.SUCCESS) {
      return {
        status: AuthServiceStatus.INSERT_USER_ERROR,
        error: insertUserResult.error,
      };
    }
  }

  // 👇 sync session with user tables`s last_clicked_at(lsa) field

  // get session
  const session = await getSession();
  const logId = session.logId;
  const clickedAt = session.clickedAt;

  // findUserResult.status 가 NOT_FOUND면 last_clicked_at은 null이다.
  // (단, 제대로 데이터가 insert 되었음을 전제함.)
  const lastClickedAt =
    findUserResult.status === RepositoryStatus.SUCCESS
      ? findUserResult.data.last_clicked_at
      : null;

  const syncResult = await syncUserSession({
    sessionData: { logId, clickedAt },
    userinfo: { uuid, lastClickedAt },
    client: supabase,
    update: updateSession,
    destroy: () => session.destroy(),
  });
  // sync error 처리
  if (!syncResult.ok) {
    return {
      status: AuthServiceStatus.SYNC_SESSION_ERROR,
      error: syncResult.error,
    };
  }

  // 로그인 성공
  return { status: AuthServiceStatus.SUCCESS };
}

async function handleExchangeCode(
  code: string,
  { client: supabase }: { client: SupabaseClient }
): Promise<{ ok: false; error: AuthError } | { ok: true }> {
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) return { ok: false, error };
  return { ok: true };
}

async function getAuthenticatedUser({
  client: supabase,
}: {
  client: SupabaseClient;
}): Promise<
  { ok: false; error: AuthError | string } | { ok: true; data: User }
> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "사용자 없음" };
  if (error) return { ok: false, error };
  return { ok: true, data: user };
}

async function syncUserSession({
  sessionData,
  userinfo,
  client,
  update,
  destroy,
}: {
  sessionData: SessionData;
  userinfo: {
    uuid: string;
    lastClickedAt: string | null;
  };
  client: SupabaseClient;
  update: typeof updateSession;
  destroy: () => void;
}): Promise<{ ok: false; error: PostgrestError } | { ok: true }> {
  // case1 & case2 -> lca를 기준으로 세션 업데이트
  if (userinfo.lastClickedAt && userinfo.lastClickedAt.trim() !== "") {
    await update({
      logId: sessionData.logId,
      now: userinfo.lastClickedAt,
    });
    return { ok: true };
  }

  // case3 -> session을 기준으로 lca 업데이트
  if (sessionData.clickedAt) {
    // 현재 사용자 lsa 업데이트
    const result = await updateUserLastClickedAt({
      uuid: userinfo.uuid,
      clickedAt: sessionData.clickedAt,
      client,
    });
    if (result.status !== RepositoryStatus.SUCCESS) {
      return { ok: false, error: result.error };
    }
  }

  // 현재 세션의 로그 아이디가 존재하면 uuid 연동
  if (sessionData.logId) {
    const result = await updateClickLogUUID({
      uuid: userinfo.uuid,
      logId: sessionData.logId,
      client,
    });
    if (result.status !== RepositoryStatus.SUCCESS) {
      return { ok: false, error: result.error };
    }
  }

  // case3 & case4
  // case4는 session, lca 모두 invalid한 경우
  return { ok: true };
}
