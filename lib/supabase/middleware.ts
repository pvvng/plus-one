import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _ }) =>
            request.cookies.set(name, value)
          );
          // 새로운 응답 객체 만들 때는 request 포함해야 함
          supabaseResponse = NextResponse.next({ request });
          // 쿠키를 복사해서 동기화 유지
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 👇 이 사이에 코드를 넣지 말 것
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/not-allowed")) {
    // 미허가 페이지 리다이렉트
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 쿠키 포함된 응답 그대로 반환 (중간에 새로 만들었으면 복사 필수)
  return supabaseResponse;
}
