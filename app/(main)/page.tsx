import ActivityCalendarController from "@/components/activity-calendar/controller";
import GoogleCaptcha from "@/components/recaptcha-wrapper";
import View from "@/components/view";
import Image from "next/image";

export default function Home() {
  return (
    <GoogleCaptcha>
      <main className="py-12 font-paperlogy">
        <section className="w-full max-w-screen-sm mx-auto p-5 space-y-3 text-center">
          <div>
            <Image
              src="/plusone.webp"
              alt="플러스원! 로고"
              width={120}
              height={120}
              priority
              className="mx-auto"
              draggable={false}
            />
            <h1 className="text-3xl font-semibold">플러스원!</h1>
            <h2 className="text-sm text-neutral-500">하루 한 번, 모두의 +1</h2>
          </div>
          <View />
        </section>
        <ActivityCalendarController />
      </main>
    </GoogleCaptcha>
  );
}
