import { NextRequest, NextResponse } from "next/server";

const URL = "https://www.google.com/recaptcha/api/siteverify";
const secret = process.env.RECAPTCHA_SECRET_KEY!;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "reCAPTCHA 토큰이 없습니다.",
    });
  }

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  const isHuman = data.success && data.score > 0.5;

  if (!isHuman) {
    return NextResponse.json(
      { success: false, message: "로봇 의심됨 (reCAPTCHA)" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "reCAPTCHA 인증 성공",
  });
}
