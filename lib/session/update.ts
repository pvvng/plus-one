import { getSession } from "./get";

/** 세션을 새 클릭 로그에 대한 값으로 업데이트 */
export async function updateSession({
  logId,
  now,
}: {
  logId: string;
  now: string;
}) {
  const session = await getSession();
  session.id = logId;
  session.clickedAt = now;
  await session.save();
}
