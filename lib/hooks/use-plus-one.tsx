"use client";

import CustomToast from "@/components/custom-toast";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";

export function usePlusOne({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const trigger = async () => {
    if (!executeRecaptcha) {
      return toast(
        <CustomToast success={false} message="reCAPTCHA 로딩 중입니다..." />
      );
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
        return toast(
          <CustomToast
            success={false}
            message={verified.message || "로봇 의심됨. 다시 시도해 주세요."}
          />
        );
      }

      const res = await fetch("/api/click");
      const data = await res.json();
      if (data.success) {
        onSuccess();
      }

      return toast(
        <CustomToast success={data.success} message={data.message} />
      );
    } catch {
      toast(
        <CustomToast
          success={false}
          message="오류가 발생했습니다. 다시 시도해 주세요."
        />
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { trigger, isLoading };
}
