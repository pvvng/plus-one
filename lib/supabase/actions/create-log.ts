import { createClient } from "../server";

export enum CreateLogStatus {
  SUCCESS,
  DB_ERROR,
}

type CreateLogResult =
  | { status: CreateLogStatus.SUCCESS; logId: string }
  | { status: CreateLogStatus.DB_ERROR; error: unknown };

interface CreateLogProps {
  ip: string;
  now: string;
  uuid?: string;
}

/**
 * #### 로그 생성 supabase action
 * @param ip - 사용자의 IP 주소 (string)
 * @param now - 현재 시간 (ISOString)
 * @param uuid - 현재 사용자 id (string | undefined)
 * @returns `CreateLogResult`
 * - SUCCESS - 로그 생성 성공 (logId 반환)
 * - DB_ERROR - 로그 생성 실패 (error 반환)
 */
export async function createLog({
  ip,
  now,
  uuid,
}: CreateLogProps): Promise<CreateLogResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("click_logs")
    .insert([{ ip, clicked_at: now, uuid: uuid ?? null }])
    .select("id")
    .single();

  if (error || !data?.id) {
    return { status: CreateLogStatus.DB_ERROR, error };
  }

  return { status: CreateLogStatus.SUCCESS, logId: data.id };
}
