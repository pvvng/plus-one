"use client";

import Loader from "./loader";
import AnimatedNumber from "./animated-number";

interface PlusOneStatusProps {
  total: number;
  today: number;
  isLoading: boolean;
  error: string | null;
}

export default function PlusOneStatus({
  total,
  today,
  isLoading,
  error,
}: PlusOneStatusProps) {
  if (error) {
    return (
      <div className="text-center">
        <p className="font-semibold">에러 발생!</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-28 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <section className="min-h-28 flex flex-col gap-3 justify-center items-center">
      <h2>
        <span className="text-sm">지금까지 총</span>{" "}
        <AnimatedNumber
          value={total}
          className="text-4xl font-semibold text-blue-500"
        />{" "}
        <span className="text-sm">개의 플러스원</span>
      </h2>

      <p className="p-3 border border-neutral-200 dark:border-neutral-600 rounded">
        <span className="text-neutral-500 text-sm">오늘은</span>{" "}
        <AnimatedNumber value={today} className="font-bold" />
        <span className="text-neutral-500 text-sm">
          개의 플러스원이 추가됐어요.
        </span>
      </p>
    </section>
  );
}
