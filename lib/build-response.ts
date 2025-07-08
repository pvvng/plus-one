import { NextResponse } from "next/server";

interface BuildAPIResponseInput {
  success: boolean;
  status: number;
  message?: string;
}

export function buildAPIResponse({
  success,
  status,
  message,
}: BuildAPIResponseInput) {
  return NextResponse.json({ success, message }, { status });
}
