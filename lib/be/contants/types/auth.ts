import { AuthError, PostgrestError, User } from "@supabase/supabase-js";

export enum ExchangeSessionStatus {
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export type ExchangeCodeForSessionResult =
  | { status: ExchangeSessionStatus.ERROR; error: AuthError }
  | { status: ExchangeSessionStatus.SUCCESS };

export enum AuthUserStatus {
  NOT_FOUND = "NOT_FOUND",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export type GetAuthenticatedUserResult =
  | { status: AuthUserStatus.NOT_FOUND; error: string }
  | { status: AuthUserStatus.ERROR; error: AuthError }
  | { status: AuthUserStatus.SUCCESS; data: User };

export enum SessionLinkStatus {
  INVALID_SESSION = "INVALID_SESSION",
  DB_ERROR = "DB_ERROR", // fatal status
  SUCCESS = "SUCCESS",
}

export type SyncAnonymousSessionWithUserResult =
  | { status: SessionLinkStatus.INVALID_SESSION; warn: string }
  | { status: SessionLinkStatus.DB_ERROR; error: PostgrestError }
  | { status: SessionLinkStatus.SUCCESS };
