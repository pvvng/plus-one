import { supabase } from "./supabase";
import { getSession } from "./session";
import { buildAPIResponse } from "./build-response";
import { NextResponse } from "next/server";

interface CreateNewUserProps {
  ip: string;
  now: Date;
}

export async function createNewUser({
  ip,
  now,
}: CreateNewUserProps): Promise<NextResponse> {
  // 신규 사용자 추가
  const { data, error } = await supabase
    .from("clicks")
    .insert([{ ip, clicked_at: now.toISOString() }])
    .select("id")
    .single();

  const uuid = data?.id as string;

  if (!uuid) {
    console.error("플러스원 생성 실패: UUID가 없습니다.");

    return buildAPIResponse({
      success: false,
      message: "플러스원 생성 실패. 나중에 다시 시도해 주세요.",
      status: 500,
    });
  }

  if (error) {
    console.error("플러스원 생성 중 오류 발생:", error);

    return buildAPIResponse({
      success: false,
      message: error?.message,
      status: 500,
    });
  }

  // 클릭 로그 기록
  await supabase
    .from("click_logs")
    .insert([{ uuid, ip, clicked_at: now.toISOString() }]);

  // 세션에 ID 저장
  const session = await getSession();
  session.id = uuid;
  await session.save();

  return buildAPIResponse({
    success: true,
    message: "플러스원 성공!",
    status: 200,
  });
}
