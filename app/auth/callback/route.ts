import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** 정상적인 사용자 리다이렉트 함수 */
const redirectUser = (req: NextRequest, origin: string, next: string) => {
  const forwardedHost = req.headers.get("x-forwarded-host"); // 로드 밸런서 이전의 원래 origin
  const isLocalEnv = process.env.NODE_ENV === "development"; // 개발 모드 여부 확인
  if (isLocalEnv) {
    // 개발 환경에서는 로드 밸런서가 없다고 확신할 수 있으므로, X-Forwarded-Host를 신경 쓸 필요 없음
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
};

/** 사용자 에러 페이지로 리디렉트 */
const redirectToAuthError = (origin: string) => {
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
};

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
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

  const supabase = await createClient();
  const { error: exchangeCodeForSessionError } =
    await supabase.auth.exchangeCodeForSession(code); // 코드를 세션 쿠키로 교환

  // 코드 세션 변경 실패
  if (exchangeCodeForSessionError) {
    console.error("인증 코드 -> 세션 교환 실패:", exchangeCodeForSessionError);
    return redirectToAuthError(origin);
  }

  // 사용자 정보 분해
  const {
    data: { user },
    error: fetchAuthUserError,
  } = await supabase.auth.getUser();

  // 사용자 확인 실패
  if (!user || fetchAuthUserError) {
    console.error(
      "사용자 정보 가져오기 실패:",
      fetchAuthUserError ?? "사용자 없음"
    );
    return redirectToAuthError(origin);
  }

  const uuid = user.id;

  // 이전에 이미 가입한 사용자인지 확인
  const { data: existing, error: fetchExistingUserError } = await supabase
    .from("users")
    .select("id")
    .eq("id", uuid)
    .maybeSingle();

  // 이미 존재하는 사용자라면 정상 리디렉트
  if (existing) {
    return redirectUser(req, origin, next);
  }

  // 기존 사용자 조회 중 에러
  if (fetchExistingUserError) {
    console.error("기존 사용자 조회 실패:", fetchExistingUserError);
    return redirectToAuthError(origin);
  }

  // 사용자 정보 획득
  const userMetadata = user.user_metadata;
  const username: string =
    userMetadata.name ??
    userMetadata.full_name ??
    userMetadata.user_name ??
    `사용자_${Date.now()}`;
  const email: string = user.email ?? userMetadata.emai ?? "";
  const provider = user.app_metadata.provider || "unknown";

  // 새 사용자 추가
  const { error: insertNewUserError } = await supabase.from("users").insert({
    id: uuid,
    email,
    name: username,
    provider,
  });

  // 사용자 추가 에러처리
  if (insertNewUserError) {
    console.error("새로운 사용자 추가 실패:", insertNewUserError);
    return redirectToAuthError(origin);
  }

  return redirectUser(req, origin, next);
}
