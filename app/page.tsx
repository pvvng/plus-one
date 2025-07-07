import Footer from "@/components/footer";
import GoogleCaptcha from "@/components/recaptcha-wrapper";
import View from "@/components/view";
import Image from "next/image";

export default function Home() {
  return (
    <GoogleCaptcha>
      <main className="w-full h-screen flex justify-center items-center p-5 font-paperlogy">
        <section className="space-y-3 text-center">
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
          </div>
          <View />
        </section>
      </main>
    </GoogleCaptcha>
  );
}
