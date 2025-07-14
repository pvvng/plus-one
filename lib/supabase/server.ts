import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies as defaultCookies } from "next/headers";

/** get server-rendered supabase client */
export async function createClient(
  cookieOverride?: ReturnType<typeof defaultCookies>
) {
  const cookieStore = await (cookieOverride ?? defaultCookies());

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키 못 만지니까 그냥 무시해도 됨
          }
        },
      },
    }
  );
}
