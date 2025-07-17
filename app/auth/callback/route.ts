import { NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/be/controllers/auth.controller";

export async function GET(req: NextRequest) {
  return handleOAuthCallback(req);
}
