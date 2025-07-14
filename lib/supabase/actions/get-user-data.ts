import { createClient } from "../server";
import { Database } from "@/types/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];

export enum GetUserStatus {
  NOT_LOGGED_IN,
  DB_MISSING,
  ERROR,
  SUCCESS,
}

type GetUserResult =
  | { status: GetUserStatus.NOT_LOGGED_IN }
  | { status: GetUserStatus.DB_MISSING }
  | { status: GetUserStatus.ERROR }
  | { status: GetUserStatus.SUCCESS; data: User };

/**
 * #### 사용자의 로그인 정보를 기반으로 DB에 저장된 사용자 데이터를 반환하는 supabase action
 * @returns `GetUserStatus`
 * - NOT_LOGGED_IN - 로그인 하지 않은 사용자
 * - DB_MISSING - 로그인 하였으나 DB에 등록되지 않은 사용자
 * - ERROR - 에러 상황
 * - SUCCESS - userdata 반환 성공 (data 함께 반환)
 */
export async function getUserData(): Promise<GetUserResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError) {
    return { status: GetUserStatus.ERROR };
  }

  if (!user) {
    return { status: GetUserStatus.NOT_LOGGED_IN };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return { status: GetUserStatus.ERROR };
  }

  if (!data) {
    return { status: GetUserStatus.DB_MISSING };
  }

  return {
    status: GetUserStatus.SUCCESS,
    data,
  };
}
