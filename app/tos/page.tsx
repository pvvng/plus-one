import Link from "next/link";

export const metadata = {
  title: "이용약관",
  description: "플러스원 서비스 이용과 관련한 약관 내용을 안내합니다.",
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-screen-sm mx-auto py-12 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-paperlogy min-h-screen">
      <h1 className="text-3xl font-bold mb-6">이용약관</h1>
      <p className="text-xs text-neutral-500 mb-4">시행일자: 2025년 7월 7일</p>

      <Link
        href="/"
        className="inline-block mb-10 text-xs text-blue-500 hover:text-blue-600 underline"
      >
        메인화면으로
      </Link>

      <section className="space-y-8">
        <article>
          <h2 className="font-semibold text-lg mb-2">1. 목적</h2>
          <p>
            본 약관은 플러스원!(이하 &quot;서비스&quot;)의 이용과 관련하여
            이용자와 운영자 간의 권리, 의무 및 책임사항을 규정함을 목적으로
            합니다.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-lg mb-2">2. 정의</h2>
          <p>
            본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            &quot;이용자&quot;란 본 서비스에 접속하여 이 약관에 따라 서비스를
            이용하는 자를 말합니다.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-lg mb-2">3. 약관의 효력 및 변경</h2>
          <p>
            본 약관은 서비스를 이용하고자 하는 모든 이용자에게 효력이 있으며,
            필요한 경우 관련 법령을 위반하지 않는 범위 내에서 개정될 수
            있습니다. 약관이 변경될 경우 변경 사항은 사전에 공지됩니다.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-lg mb-2">4. 개인정보 보호</h2>
          <p>
            운영자는 이용자의 개인정보를 중요하게 생각하며, 관련 법령에 따라
            안전하게 처리합니다. 자세한 내용은 개인정보 처리방침을 참고하세요.
          </p>
        </article>

        <article>
          <h2 className="font-semibold text-lg mb-2">5. 이용자의 의무</h2>
          <p>
            이용자는 본 서비스를 법령 및 본 약관에 따라 이용해야 하며, 다음 각
            호의 행위를 해서는 안 됩니다:
          </p>
          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>타인의 정보를 도용하거나 허위 정보를 입력하는 행위</li>
            <li>서비스의 운영을 방해하거나 고의로 오류를 발생시키는 행위</li>
            <li>기타 공공질서 및 미풍양속에 반하는 행위</li>
          </ul>
        </article>

        <article>
          <h2 className="font-semibold text-lg mb-2">6. 기타</h2>
          <p>
            본 약관에 명시되지 않은 사항에 대해서는 관련 법령 및 서비스 운영
            정책을 따릅니다.
          </p>
        </article>
      </section>

      <p className="mt-12 text-xs text-neutral-500 text-center">
        본 약관에 대한 문의는{" "}
        <a
          href="mailto:gdongu093@gmail.com"
          className="underline hover:text-blue-600"
        >
          gdongu093@gmail.com
        </a>{" "}
        으로 연락 주세요.
      </p>
    </main>
  );
}
