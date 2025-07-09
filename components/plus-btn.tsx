"use client";

import { useEffect, useRef } from "react";

interface Props {
  isLoading: boolean;
  isError: boolean;
  canClick: boolean;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  onClick: () => void;
}

export default function PlusBtn({
  isLoading,
  isError,
  canClick,
  hoursLeft,
  minutesLeft,
  secondsLeft,
  onClick,
}: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") btnRef.current?.click();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const renderText = isLoading
    ? "로딩 중.."
    : canClick
    ? "플러스 원!"
    : `다음 클릭까지 ${hoursLeft}:${String(minutesLeft).padStart(
        2,
        "0"
      )}:${String(secondsLeft).padStart(2, "0")}`;

  return (
    <button
      ref={btnRef}
      disabled={isError || isLoading || !canClick}
      onClick={onClick}
      className="font-semibold rounded min-w-32 px-3 py-2 cursor-pointer shadow text-lg 
      disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:text-neutral-200 disabled:active:scale-none
      bg-blue-500 hover:bg-blue-600 active:scale-95 text-yellow-400 hover:text-amber-400"
    >
      {renderText}
    </button>
  );
}
