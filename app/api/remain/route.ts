import { ONE_DAY_MS } from "@/constant";
import { buildAPIResponse } from "@/lib/build-response";
import { getTimeLeftUntil24Hours } from "@/lib/get-time-left";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return buildAPIResponse({
      success: false,
      message: "허용되지 않은 메서드입니다.",
      status: 405,
    });
  }

  const session = await getSession();
  const sessionId = session.id;

  if (!sessionId) {
    return buildAPIResponse({
      success: false,
      message: "클릭 기록이 존재하지 않습니다.",
      status: 401,
    });
  }

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 세션이 존재하는 경우엔 기존 클릭 확인
  const { data: existing, error: fetchError } = await supabase
    .from("clicks")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError) {
  }

  // 세션은 존재하는데 클릭 기록이 없는 경우
  if (!existing) {
    return buildAPIResponse({
      success: false,
      message: "클릭 기록이 존재하지 않습니다.",
      status: 401,
    });
  }

  // 기존 세션이 존재하는 경우
  const prevClick = new Date(existing.clicked_at);
  const diff = now.getTime() - prevClick.getTime();

  return NextResponse.json(
    {
      success: true,
      data: {
        ...getTimeLeftUntil24Hours(diff),
        canClick: diff >= ONE_DAY_MS,
      },
    },
    { status: 200 }
  );
}
