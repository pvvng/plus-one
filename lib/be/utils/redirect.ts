import { NextRequest, NextResponse } from "next/server";

/** 정상적인 사용자 리다이렉트 함수 */
export function redirectUser(req: NextRequest, origin: string, next: string) {
  const forwardedHost = req.headers.get("x-forwarded-host"); // 로드 밸런서 이전의 원래 origin
  const isLocalEnv = process.env.NODE_ENV === "development"; // 개발 모드 여부 확인
  if (isLocalEnv) {
    // 개발 환경에서는 로드 밸런서가 없다고 확신할 수 있으므로, X-Forwarded-Host를 신경 쓸 필요 없음
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

/** 사용자 에러 페이지로 리디렉트 */
export function redirectToAuthError(origin: string) {
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
