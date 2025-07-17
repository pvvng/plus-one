import { AuthError, PostgrestError } from "@supabase/supabase-js";

export enum AuthServiceStatus {
  EXCHANGE_CODE_ERROR = "EXCHANGE_CODE_ERROR",
  AUTH_USER_ERROR = "AUTH_USER_ERROR",
  FIND_USER_ERROR = "FIND_USER_ERROR",
  INSERT_USER_ERROR = "INSERT_USER_ERROR",
  SYNC_SESSION_ERROR = "SYNC_SESSION_ERROR",
  SUCCESS = "SUCCESS",
}

export type AuthServiceResult =
  | { status: AuthServiceStatus.EXCHANGE_CODE_ERROR; error: AuthError | string }
  | { status: AuthServiceStatus.AUTH_USER_ERROR; error: AuthError | string }
  | {
      status: AuthServiceStatus.FIND_USER_ERROR;
      error: PostgrestError | string;
    }
  | {
      status: AuthServiceStatus.INSERT_USER_ERROR;
      error: PostgrestError | string;
    }
  | {
      status: AuthServiceStatus.SYNC_SESSION_ERROR;
      error: PostgrestError | string;
    }
  | { status: AuthServiceStatus.SUCCESS };
