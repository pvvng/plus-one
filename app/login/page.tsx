import LoginButtons from "@/components/login-buttons";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="px-5 py-12 w-full font-paperlogy">
      <div className="max-w-screen-xl mx-auto space-y-8">
        <section className="text-center">
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
        </section>
        <LoginButtons />
        <Link
          href="/"
          className="block text-blue-500 hover:text-blue-500 transition-colors text-center"
        >
          메인 페이지로
        </Link>
      </div>
    </main>
  );
}
