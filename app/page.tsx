"use client";

import PlusBtn from "@/components/plus-btn";
import PlusOneStatus from "@/components/plus-one-status";
import GoogleCaptcha from "@/components/recaptcha";
import { useCounts } from "@/lib/hooks/use-count";
import Image from "next/image";

export default function Home() {
  const countState = useCounts();

  return (
    <GoogleCaptcha>
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
          <PlusOneStatus {...countState} />
          <PlusBtn isError={Boolean(countState.error)} />
        </section>
      </main>
    </GoogleCaptcha>
  );
}
