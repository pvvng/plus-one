import { Database } from "@/types/supabase";
import { AuthError, SupabaseClient, User } from "@supabase/supabase-js";
import {
  RepositoryAuthResult,
  RepositoryStatus,
} from "../contants/types/repository";

export async function getAuthenticatedUser({
  client: supabase,
}: {
  client: SupabaseClient<Database>;
}): Promise<RepositoryAuthResult<User>> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: RepositoryStatus.NOT_FOUND,
      error: "사용자 없음",
    };
  }

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS, data: user };
}

export async function logout({
  client: supabase,
}: {
  client: SupabaseClient<Database>;
}): Promise<{ ok: false; error: AuthError } | { ok: true }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 실패:", error);
    return { ok: false, error };
  }

  return { ok: true };
}
