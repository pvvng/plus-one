// utils
import { redirectToAuthError, redirectUser } from "../utils/redirect";
import { extractUserInfo } from "../utils/extract-user-info";
// service
import {
  getAuthenticatedUser,
  handleExchangeCodeForSession,
  syncAnonymousSessionWithUser,
} from "../services/auth.service";
// repo
import { findUserById, insertUser } from "../repositories/user.repository";
import { RepositoryStatus } from "../contants/types/repository";
// types
import {
  AuthUserStatus,
  ExchangeSessionStatus,
  SessionLinkStatus,
} from "../contants/types/auth";
// next
import { NextRequest } from "next/server";

export async function handleOAuthCallback(req: NextRequest) {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 👇 code parse

  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const origin = url.origin;
  const code = searchParams.get("code"); // 인증 코드

  // 리다이렉트 링크
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // "next"가 상대 경로가 아니라면, 기본값을 사용
    next = "/";
  }

  // 코드 존재하지 않음
  if (!code) {
    return redirectToAuthError(origin);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 👇 exchange code &

  const exchangeCodeResult = await handleExchangeCodeForSession(code);

  if (exchangeCodeResult.status == ExchangeSessionStatus.ERROR) {
    console.error(exchangeCodeResult.error);
    return redirectToAuthError(origin);
  }

  // 로그인한 사용자 정보 호출
  const authUserResult = await getAuthenticatedUser();

  // 사용자 확인 실패
  if (authUserResult.status !== AuthUserStatus.SUCCESS) {
    console.error("사용자 정보 가져오기 실패:", authUserResult.error);
    return redirectToAuthError(origin);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 👇 check user validation

  const user = authUserResult.data;
  const uuid = user.id;

  // 이전에 이미 가입한 사용자인지 확인
  const findUserByIdResult = await findUserById({ uuid });

  // 기존 사용자 조회 중 에러
  if (findUserByIdResult.status === RepositoryStatus.DB_ERROR) {
    console.error("사용자 조회 실패:", findUserByIdResult.error);
    return redirectToAuthError(origin);
  }

  // +++++++++ 👇 세션 <-> last_cliced_at 동기화

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
      return redirectToAuthError(origin);
    }
    return redirectUser(req, origin, next);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 👇 최초 로그인

  // 사용자 정보 획득
  const { username, email, provider } = extractUserInfo(user);

  // 새 사용자 추가
  const insertUserResult = await insertUser({
    uuid,
    email,
    username,
    provider,
  }); // repo

  // 사용자 추가 에러처리
  if (insertUserResult.status !== RepositoryStatus.SUCCESS) {
    console.error("새로운 사용자 추가 실패:", insertUserResult.error);
    return redirectToAuthError(origin);
  }

  // 새로운 사용자 추가 후 세션 존재한다면 동기화
  const result = await syncAnonymousSessionWithUser({
    uuid: insertUserResult.data.id,
  });

  if (result.status === SessionLinkStatus.DB_ERROR) {
    return redirectToAuthError(origin);
  }

  return redirectUser(req, origin, next);
}
