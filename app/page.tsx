"use client";

import AnimatedNumber from "@/components/animated-number";
import Loader from "@/components/loader";
import PlusBtn from "@/components/plus-btn";
import { useCounts } from "@/lib/hooks/use-count";
import Image from "next/image";

export default function Home() {
  const { total, today, isLoading, error } = useCounts();

  if (error) {
    return (
      <div className="mt-25 text-center font-paperlogy space-y-3">
        <Image
          src="/plusone.webp"
          alt="LOGO"
          width={100}
          height={100}
          priority
          className="mx-auto"
          draggable={false}
        />
        <p className="text-xl font-semibold">에러 발생!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="w-full h-screen flex justify-center items-center p-5 font-paperlogy">
      <section className="space-y-3 text-center">
        <div>
          <Image
            src="/plusone.webp"
            alt="LOGO"
            width={100}
            height={100}
            priority
            className="mx-auto"
            draggable={false}
          />
          <h1 className="text-3xl font-semibold">플러스원!</h1>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <h2>
            <span className="text-sm">지금까지 총</span>{" "}
            <AnimatedNumber
              value={total}
              className="text-4xl font-semibold text-blue-500"
            />{" "}
            <span className="text-sm">개의 플러스원</span>
          </h2>
        )}
        <p className="p-3 border border-neutral-200 rounded">
          {isLoading ? (
            <span className="text-neutral-500">
              플러스원 개수를 불러오는 중입니다...
            </span>
          ) : (
            <>
              <span className="text-neutral-500 text-sm">오늘</span>{" "}
              <AnimatedNumber value={today} className="font-bold" />
              <span className="text-neutral-500 text-sm">
                개의 플러스원이 추가됐어요.
              </span>
            </>
          )}
        </p>
        <PlusBtn />
      </section>
    </main>
  );
}
