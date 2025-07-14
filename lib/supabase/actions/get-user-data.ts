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
