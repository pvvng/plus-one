"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import gsap from "gsap";

export default function PlusBtn() {
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  };

  const handleClick = async () => {
    const id = await getFingerprint();

    const response = await fetch("/api/click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (data.success) {
      alert(data.message || "플러스원 성공!");
    } else {
      alert(data.message || "플러스원 실패. 나중에 다시 시도해 주세요.");
    }
  };

  useLayoutEffect(() => {
    const els = charsRef.current;
    if (!els.length) return;

    const handleHover = () => {
      // 기존 애니메이션 강제 종료
      gsap.killTweensOf(els);

      gsap.to(els, {
        y: -6,
        duration: 0.2,
        ease: "power1.out",
        stagger: 0.05,
        yoyo: true,
        repeat: 1,
        overwrite: "auto",
        onComplete: () => {
          // 애니메이션 종료 후 y 위치 초기화
          gsap.set(els, { y: 0 });
        },
        onReverseComplete: () => {
          gsap.set(els, { y: 0 });
        },
      });
    };

    const btn = document.getElementById("plus-btn");
    btn?.addEventListener("mouseenter", handleHover);

    return () => {
      btn?.removeEventListener("mouseenter", handleHover);
    };
  }, []);

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

  const text = "플러스 원!";
  charsRef.current = [];

  return (
    <button
      id="plus-btn"
      ref={btnRef}
      onClick={handleClick}
      className="font-semibold rounded min-w-32 px-3 py-2 cursor-pointer shadow text-lg
      bg-blue-500 hover:bg-blue-600 active:scale-95 text-yellow-400 hover:text-amber-400"
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) charsRef.current[i] = el;
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </button>
  );
}
