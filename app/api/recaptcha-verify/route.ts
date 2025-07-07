import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;

  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({
      success: false,
      message: "reCAPTCHA 토큰이 없습니다.",
    });
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
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
