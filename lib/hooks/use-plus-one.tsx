"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function usePlusOne({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const trigger = async () => {
    if (!executeRecaptcha) {
      alert("reCAPTCHA 로딩 중입니다...");
      return;
    }

    setIsLoading(true);

    try {
      const token = await executeRecaptcha("plus_one");
      const verify = await fetch("/api/recaptcha-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const verified = await verify.json();
      if (!verified.success) {
        return alert(verified.message || "로봇 의심됨. 다시 시도해 주세요.");
      }

      const res = await fetch("/api/click");
      const data = await res.json();
      if (data.success) {
        alert(data.message || "플러스원 성공!");
        onSuccess();
      } else {
        alert(data.message || "플러스원 실패. 다시 시도해 주세요.");
      }
    } catch (e) {
      alert("에러가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return { trigger, isLoading };
}
