import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code"); // 인증 코드

  // 리다이렉트 링크
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // "next"가 상대 경로가 아니라면, 기본값을 사용
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code); // 코드를 세션 쿠키로 교환

    if (!error) {
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
    }
  }

  // 에러 페이지로 리디렉션하여 사용자에게 안내
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
