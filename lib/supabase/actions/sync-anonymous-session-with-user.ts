import { getSession } from "@/lib/session/get";
import { createClient } from "../server";

export enum SessionLinkStatus {
  INVALID_SESSION,
  DB_ERROR, // fatal status
  SUCCESS,
}

/**
 * 익명 log session과 현재 유저와의 싱크 맞추는 함수
 * @param uuid - 사용자 id
 * @returns `SessionLinkStatus`
 * - INVALID_SESSION - 유효하지 않은 세션
 * - DB_ERROR - DB 에러 발생 (fatal)
 * - SUCCESS - 성공적으로 싱크 맞춰짐
 */
export async function syncAnonymousSessionWithUser({ uuid }: { uuid: string }) {
  const supabase = await createClient();
  const session = await getSession();
  const sessionId = session.id;
  const clickedAt = session.clickedAt;

  if (!session || !sessionId || !clickedAt) {
    await session.destroy();
    return { status: SessionLinkStatus.INVALID_SESSION };
  }

  // 비회원 상태에서 클릭한 세션이 존재할 경우엔 해당 세션과 유저 연동시키기
  const { data: isValid, error: fetchClickLogError } = await supabase
    .from("click_logs")
    .select("uuid")
    .eq("id", sessionId)
    .maybeSingle();

  if (!isValid) {
    await session.destroy();
    return { status: SessionLinkStatus.INVALID_SESSION };
  }

  if (fetchClickLogError) {
    console.error("클릭 정보를 불러오는 중 오류 발생: ", fetchClickLogError);
    return { status: SessionLinkStatus.DB_ERROR };
  }

  const [{ error: updateLogError }, { error: updateLastClickError }] =
    await Promise.all([
      supabase.from("click_logs").update({ uuid: uuid }).eq("id", sessionId),
      supabase
        .from("users")
        .update({ last_clicked_at: clickedAt })
        .eq("id", uuid),
    ]);

  // 에러 발생 시 사용자 정보를 업데이트 하는데 실패했다는 에러 반환
  if (updateLastClickError || updateLogError) {
    console.error("로그 업데이트 에러: ", updateLogError);
    console.error("클릭 시간 업데이트 에러: ", updateLastClickError);
    return { status: SessionLinkStatus.DB_ERROR };
  }

  return { status: SessionLinkStatus.SUCCESS };
}
