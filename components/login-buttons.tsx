"use client";

import { authLogin } from "@/lib/auth-login";
import Image from "next/image";
import { toast } from "sonner";
import CustomToast from "./custom-toast";

export default function LoginButtons() {
  const kakaoLogin = async () => {
    const error = await authLogin({ provider: "kakao" });

    if (error) {
      console.log(error);
      toast(<CustomToast success={false} message={error} />);
    }
  };

  const googleLogin = async () => {
    const error = await authLogin({ provider: "google" });

    if (error) {
      console.log(error);
      toast(<CustomToast success={false} message={error} />);
    }
  };

  return (
    <section className="flex flex-col gap-3 max-w-xs mx-auto *:hover:scale-95 *:transition-all">
      <button
        onClick={kakaoLogin}
        className="flex gap-2 items-center justify-center rounded p-2 px-4 cursor-pointer shadow"
        style={{ background: "#FEE500", border: "1px solid #FEE500" }}
      >
        <Image src="/kakao.svg" alt="kakao-icon" width={20} height={20} />
        <span>카카오 로그인</span>
      </button>
      <button
        onClick={googleLogin}
        className="flex gap-2 items-center justify-center rounded p-2 px-4 cursor-pointer border border-neutral-100 shadow"
      >
        <Image src="/google.svg" alt="google-icon" width={20} height={20} />
        <span>구글 로그인</span>
      </button>
    </section>
  );
}
