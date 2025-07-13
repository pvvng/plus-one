import { getRemainTimeStatus } from "@/util/time/get-remain-time-status";
import { createClient } from "../server";
import { getSession } from "@/lib/session/get";

type ValidateLogSessionResult =
  | { status: "NO_SESSION" }
  | { status: "INVALID_SESSION" }
  | {
      status: "TOO_EARLY";
      remainTimeStatus: ReturnType<typeof getRemainTimeStatus>;
    }
  | { status: "VALID" };

export async function validateLogSession(): Promise<ValidateLogSessionResult> {
  const supabase = await createClient();
  const session = await getSession();
  const { id: sessionId, clickedAt } = session;

  if (!session || !sessionId || !clickedAt) {
    return { status: "NO_SESSION" };
  }

  const { data: clickLog, error: fetchClickLogError } = await supabase
    .from("click_logs")
    .select("clicked_at")
    .eq("id", sessionId)
    .single();

  if (fetchClickLogError || !clickLog) {
    await session.destroy();
    return { status: "INVALID_SESSION" };
  }

  const isValidSession =
    new Date(clickLog.clicked_at).getTime() === new Date(clickedAt).getTime();

  if (!isValidSession) {
    await session.destroy();
    return { status: "INVALID_SESSION" };
  }

  const remainTimeStatus = getRemainTimeStatus(clickLog.clicked_at);
  if (!remainTimeStatus.canClick) {
    return { status: "TOO_EARLY", remainTimeStatus };
  }

  return { status: "VALID" };
}
