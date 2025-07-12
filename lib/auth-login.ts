"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

type Provider = "kakao" | "google";

interface AuthLogin {
  provider: Provider;
  redirectTo?: string;
}

export const authLogin = async ({
  provider,
  redirectTo: next = "/",
}: AuthLogin) => {
  const supabase = await createClient();
  const isDev = process.env.NODE_ENV === "development";
  const appUrl = isDev
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL!;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`, // redirect url
    },
  });

  // 로그인 성공
  if (data.url) {
    return redirect(data.url);
  }

  console.error("로그인 에러: ", error);
  return "로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
};
