import { createClient } from "./server";

interface CreateLogProps {
  ip: string;
  now: string;
  uuid?: string;
}

/** 로그 생성 action */
export async function createLog({ ip, now, uuid }: CreateLogProps) {
  const supabase = await createClient();

  // uuid가 undfiend면 비회원 유저로 취급 (uuid null)
  const { data, error } = await supabase
    .from("click_logs")
    .insert([{ ip, clicked_at: now, uuid: uuid ?? null }])
    .select("id")
    .single();

  if (error) {
    console.error(error);
  }

  const logId = data?.id || null;

  return logId;
}
