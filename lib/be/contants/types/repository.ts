import { AuthError, PostgrestError } from "@supabase/supabase-js";

export enum RepositoryStatus {
  NOT_FOUND = "NOT_FOUND",
  DB_ERROR = "DB_ERROR",
  SUCCESS = "SUCCESS",
}

export type RepositoryGetResult<T> =
  | { status: RepositoryStatus.NOT_FOUND; error: string }
  | { status: RepositoryStatus.DB_ERROR; error: PostgrestError }
  | { status: RepositoryStatus.SUCCESS; data: T };

export type RepositoryUpdateResult =
  | { status: RepositoryStatus.DB_ERROR; error: PostgrestError }
  | { status: RepositoryStatus.SUCCESS };

export type RepositoryInsertResult<T> =
  | { status: RepositoryStatus.NOT_FOUND; error: string }
  | { status: RepositoryStatus.DB_ERROR; error: PostgrestError }
  | { status: RepositoryStatus.SUCCESS; data: T };

export type RepositoryAuthResult<T> =
  | { status: RepositoryStatus.NOT_FOUND; error: string }
  | { status: RepositoryStatus.DB_ERROR; error: AuthError }
  | { status: RepositoryStatus.SUCCESS; data: T };
