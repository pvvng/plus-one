import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const uuid = body.id;

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 로컬에서 테스트할 경우 무조건 통과
  if (ip === "::1" || ip === "127.0.0.1") {
    await supabase.from("click_logs").insert([{ uuid, ip, clicked_at: now }]);

    return NextResponse.json({
      success: true,
      message: "플러스원 성공! (로컬 테스트)",
    });
  }

  // 기존 클릭 기록 찾기
  const { data: existing, error: fetchError } = await supabase
    .from("clicks")
    .select("*")
    .eq("uuid", uuid)
    .eq("ip", ip)
    .limit(1);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existing && existing.length > 0) {
    const prevClick = new Date(existing[0].clicked_at);
    const diff = now.getTime() - prevClick.getTime();

    if (diff < 1000 * 60 * 60 * 24) {
      const msLeft = 1000 * 60 * 60 * 24 - diff;
      const hoursLeft = Math.floor(msLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((msLeft % (1000 * 60)) / 1000);

      return NextResponse.json(
        {
          success: false,
          message: `다음 플러스원까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초 남았어요.`,
        },
        { status: 429 }
      );
    } else {
      // 기존 사용자 & 24시간 경과 -> 업데이트
      await supabase
        .from("clicks")
        .update({ clicked_at: now.toISOString() })
        .eq("uuid", uuid)
        .eq("ip", ip);

      await supabase.from("click_logs").insert([{ uuid, ip, clicked_at: now }]);

      return NextResponse.json({
        success: true,
        message: "플러스원 성공!",
      });
    }
  } else {
    // 신규 사용자 추가
    await supabase.from("clicks").insert([{ uuid, ip, clicked_at: now }]);
    // 클릭 로그 기록
    await supabase.from("click_logs").insert([{ uuid, ip, clicked_at: now }]);

    return NextResponse.json({
      success: true,
      message: "플러스원 성공!",
    });
  }
}
