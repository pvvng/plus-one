import { createClient } from "../server";

export enum LogoutStatus {
  SUCCESS,
  ERROR,
}

/**
 * #### supabase 로그아웃 액션
 * @returns `LogoutStatus`
 * - SUCCESS - 로그아웃 성공
 * - ERROR - 에러 상황 (error 원인 반환)
 */
export async function logout(): Promise<{
  status: LogoutStatus;
  error?: unknown;
}> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 실패:", error);
    return { status: LogoutStatus.ERROR, error };
  }

  return { status: LogoutStatus.SUCCESS };
}
