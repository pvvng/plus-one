import { SupabaseClient } from "@supabase/supabase-js";
import {
  RepositoryGetResult,
  RepositoryInsertResult,
  RepositoryStatus,
  RepositoryUpdateResult,
} from "../contants/types/repository";
import { ClickLogs } from "../contants/types/supabase-table";
import { Database } from "@/types/supabase";

export async function updateClickLogUUID({
  uuid,
  logId,
  client: supabase,
}: {
  uuid: string;
  logId: string;
  client: SupabaseClient<Database>;
}): Promise<RepositoryUpdateResult> {
  const { error } = await supabase
    .from("click_logs")
    .update({ uuid: uuid })
    .eq("id", logId);

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS };
}

/** logId로 로그 데이터 호출 */
export async function findClickLogById({
  logId,
  client: supabase,
}: {
  logId: string;
  client: SupabaseClient<Database>;
}): Promise<RepositoryGetResult<ClickLogs>> {
  const { data, error } = await supabase
    .from("click_logs")
    .select("*")
    .eq("id", logId)
    .maybeSingle();

  if (!data) {
    return {
      status: RepositoryStatus.NOT_FOUND,
      error: "존재하지 않는 로그",
    };
  }

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS, data };
}

export async function createLog({
  ip,
  now,
  uuid,
  client: supabase,
}: {
  ip: string;
  now: string;
  uuid?: string;
  client: SupabaseClient<Database>;
}): Promise<
  RepositoryInsertResult<{
    id: string;
  }>
> {
  const { data, error } = await supabase
    .from("click_logs")
    .insert([{ ip, clicked_at: now, uuid: uuid ?? null }])
    .select("id")
    .maybeSingle();

  if (!data) {
    return {
      status: RepositoryStatus.NOT_FOUND,
      error: "존재하지 않는 로그",
    };
  }

  if (error) {
    return { status: RepositoryStatus.DB_ERROR, error };
  }

  return { status: RepositoryStatus.SUCCESS, data };
}
