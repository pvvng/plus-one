import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  const { id, clickedAt } = session;
  return NextResponse.json(
    {
      success: true,
      data: { id, clickedAt },
    },
    { status: 200 }
  );
}
