import { getSession } from "./get";

/**
 * #### 세션을 새 클릭 로그에 대한 값으로 업데이트 하는 session infra
 * @param logId - 업데이트 할 클릭 로그 id
 * @param now - 업데이트 할 시간
 */
export async function updateSession({
  logId,
  now,
}: {
  logId: string | undefined;
  now: string;
}) {
  const session = await getSession();
  session.logId = logId;
  session.clickedAt = now;
  await session.save();
}
