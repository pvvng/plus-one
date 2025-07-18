import { getSession } from "@/lib/be/infra/session/get";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const { logId, clickedAt } = session;
  return NextResponse.json(
    {
      success: true,
      data: { logId, clickedAt },
    },
    { status: 200 }
  );
}
