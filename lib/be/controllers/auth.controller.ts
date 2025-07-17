import { NextRequest } from "next/server";
import { authService } from "../services/auth.service";
import { redirectToAuthError, redirectUser } from "../utils/redirect";
import { AuthServiceStatus } from "../contants/types/auth";

export async function handleOAuthCallback(req: NextRequest) {
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
    console.error("로그인 중 에러 발생: 코드가 존재하지 않음");
    return redirectToAuthError(origin);
  }

  // 서비스 호출
  const serviceResult = await authService(code);

  switch (serviceResult.status) {
    case AuthServiceStatus.AUTH_ERROR:
    case AuthServiceStatus.DB_ERROR:
      console.error(serviceResult.error);
      return redirectToAuthError(origin);
    case AuthServiceStatus.SUCCESS:
      return redirectUser(req, origin, next);
    default:
      console.error("정의되지 않은 인증 상태", serviceResult);
      return redirectToAuthError(origin);
  }
}
