import {
  RepositoryGetResult,
  RepositoryUpdateResult,
  RepositoryStatus,
  RepositoryInsertResult,
} from "../contants/types/repository";
import { Users } from "../contants/types/supabase-table";

import { createClient } from "../infra/supabase/server";

/** uuid로 DB 사용자 정보 호출 */
export async function findUserById({
  uuid,
}: {
  uuid: string;
}): Promise<RepositoryGetResult<Users>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", uuid)
    .maybeSingle();

  if (!data) {
    return {
      status: RepositoryStatus.NOT_FOUND,
      error: "존재하지 않는 사용자",
    };
  }

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS, data };
}

export async function updateUserLastClickedAt({
  uuid,
  clickedAt,
}: {
  uuid: string;
  clickedAt: string;
}): Promise<RepositoryUpdateResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ last_clicked_at: clickedAt })
    .eq("id", uuid);

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS };
}

/** 새 사용자 insert */
export async function insertUser({
  uuid,
  email,
  username,
  provider,
}: {
  uuid: string;
  email: string;
  username: string;
  provider: string;
}): Promise<
  RepositoryInsertResult<{
    id: string;
  }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: uuid,
      email,
      name: username,
      provider,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  if (!data) {
    return {
      status: RepositoryStatus.NOT_FOUND,
      error: "사용자 아이디 반환 실패",
    };
  }

  return { status: RepositoryStatus.SUCCESS, data };
}
