import {
  RepositoryGetResult,
  RepositoryStatus,
  RepositoryUpdateResult,
} from "../contants/types/repository";
import { ClickLogs } from "../contants/types/supabase-table";
import { createClient } from "../infra/supabase/server";

export async function updateClickLogUUID({
  uuid,
  logId,
}: {
  uuid: string;
  logId: string;
}): Promise<RepositoryUpdateResult> {
  const supabase = await createClient();
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
}: {
  logId: string;
}): Promise<RepositoryGetResult<ClickLogs>> {
  const supabase = await createClient();

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
