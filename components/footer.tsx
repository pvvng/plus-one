import Link from "next/link";

const infoLinks = [
  { href: "/update", label: "업데이트" },
  { href: "/tos", label: "이용약관" },
  { href: "/privacy", label: "개인정보 처리방침" },
];

const faqLinks = [
  { href: "/contact", label: "문의하기" },
  { href: "/report", label: "오류 신고" },
];

export default function Footer() {
  return (
    <footer className="w-full mx-auto p-5 bg-neutral-50 dark:bg-neutral-900 font-paperlogy">
      <div className="max-w-screen-sm mx-auto space-y-5">
        <section className="grid grid-cols-4">
          <div>
            <p className="font-semibold text-lg">정보</p>
            <ul className="flex flex-col gap-1 mt-2">
              {infoLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-neutral-700 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-lg">문의</p>
            <ul className="flex flex-col gap-1 mt-2">
              {faqLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-neutral-700 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className="mt-4 space-y-2 text-end">
          <p className="text-xs text-neutral-400">
            © 2025{" "}
            <Link
              href="#"
              target="_blank"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              pvvng
            </Link>
            . 모든 권리 보유.
          </p>
          <p className="text-xs text-neutral-400">
            이 사이트는 reCAPTCHA의 보호를 받으며, Google{" "}
            <Link
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-600"
            >
              개인정보처리방침
            </Link>{" "}
            및{" "}
            <Link
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-600"
            >
              서비스 약관
            </Link>
            이 적용됩니다.
          </p>
        </section>
      </div>
    </footer>
  );
}
