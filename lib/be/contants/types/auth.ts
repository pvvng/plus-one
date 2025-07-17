import { AuthError, PostgrestError } from "@supabase/supabase-js";

export enum AuthServiceStatus {
  DB_ERROR = "DB_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  SUCCESS = "SUCCESS",
}

export type AuthServiceResult =
  | { status: AuthServiceStatus.DB_ERROR; error: PostgrestError | string }
  | { status: AuthServiceStatus.AUTH_ERROR; error: AuthError | string }
  | { status: AuthServiceStatus.SUCCESS };
