"use client";

import Image from "next/image";
import { toast } from "sonner";
import CustomToast from "./custom-toast";
import { authLogin } from "@/lib/supabase/actions/auth-login";

export default function LoginButton() {
  const kakaoLogin = async () => {
    const error = await authLogin({ provider: "kakao" });

    if (error) {
      console.log(error);
      toast(<CustomToast success={false} message={error} />);
    }
  };

  return (
    <section className="max-w-xs flex justify-center mx-auto *:hover:scale-95 *:transition-all">
      <button
        onClick={kakaoLogin}
        className="shrink-0 flex w-full gap-2 items-center justify-center rounded p-2 px-4 cursor-pointer shadow dark:text-black"
        style={{ background: "#FEE500", border: "1px solid #FEE500" }}
      >
        <Image src="/kakao.svg" alt="kakao-icon" width={20} height={20} />
        <span>카카오 로그인</span>
      </button>
    </section>
  );
}
