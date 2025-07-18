import { handlePlusOneCallback } from "@/lib/be/controllers/plus-one.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return handlePlusOneCallback(req);
}
