"use client";

import { useEffect, useRef, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function PlusBtn({ isError = false }: { isError?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // reCAPTCHA 훅
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const handleClick = async () => {
    if (!executeRecaptcha) {
      return alert("reCAPTCHA 로딩 중입니다...");
    }
    setIsLoading(true);

    // reCAPTCHA token
    const token = await executeRecaptcha("plus_one");
    const tokenResponse = await fetch("/api/recaptcha-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const verified = await tokenResponse.json();
    if (!verified.success) {
      return alert(
        verified.message || "로봇 의심됨. 나중에 다시 시도해 주세요."
      );
    }

    // fingerprint ID
    const id = await getFingerprint();

    if (!id || !token) {
      return alert("플러스원 실패. 나중에 다시 시도해 주세요.");
    }

    const response = await fetch("/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    setIsLoading(false);

    if (data.success) {
      alert(data.message || "플러스원 성공!");
    } else {
      alert(data.message || "플러스원 실패. 나중에 다시 시도해 주세요.");
    }
  };

  // ⌨️ 엔터키 눌렀을 때 버튼 클릭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        btnRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderText = isLoading ? "플러스 중.." : "플러스 원!";

  return (
    <button
      id="plus-btn"
      ref={btnRef}
      disabled={isError || isLoading}
      aria-label="플러스원 버튼"
      title="플러스 원!"
      onClick={handleClick}
      className="font-semibold rounded min-w-32 px-3 py-2 cursor-pointer shadow text-lg 
      disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-200
      bg-blue-500 hover:bg-blue-600 active:scale-95 text-yellow-400 hover:text-amber-400"
    >
      {renderText}
    </button>
  );
}
