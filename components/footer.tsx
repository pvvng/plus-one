import Link from "next/link";

const links = [
  { href: "/update", label: "업데이트" },
  { href: "/tos", label: "이용약관" },
  { href: "/privacy", label: "개인정보 처리방침" },
];

export default function Footer() {
  return (
    <footer className="w-full mx-auto p-5 bg-neutral-50 font-paperlogy">
      <div className="max-w-screen-sm mx-auto space-y-5">
        <section>
          <p className="font-semibold text-lg">정보</p>
          <ul className="flex flex-col gap-1 mt-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-neutral-700 hover:text-neutral-500"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="text-sm text-neutral-500 text-end">
          2025{" "}
          <Link
            href="#"
            target="_blank"
            className="text-blue-500 hover:text-blue-600"
          >
            pvvng
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
