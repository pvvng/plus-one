import Link from "next/link";
import { getUpdates } from "./actions";

// update page (업데이트)
export const metadata = {
  title: "업데이트 내역",
  description: "플러스원 서비스의 최신 업데이트 내역과 변경 사항을 확인하세요.",
};

export default async function UpdatePage() {
  const isDev = process.env.NODE_ENV === "development";

  const updates = await getUpdates();

  return (
    <main className="max-w-screen-sm min-h-screen mx-auto py-12 px-5 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-paperlogy">
      <h1 className="text-2xl font-bold mb-4">업데이트 내역</h1>
      <Link
        href="/"
        className="mb-4 block text-xs text-blue-500 hover:text-blue-600"
      >
        메인화면으로
      </Link>
      {isDev && (
        <Link
          href="/update/add"
          className="inline-block mb-4 px-2 py-1 text-white bg-blue-500 hover:bg-blue-600 rounded transition cursor-pointer"
        >
          업데이트 추가
        </Link>
      )}
      <hr className="border border-neutral-200 dark:border-neutral-800 border-dashed" />
      <section className="py-5">
        {updates.map(({ id, title, payload, created_at }) => (
          <article
            key={id}
            className="p-3 border-neutral-100 last:border-b odd:bg-neutral-100 
            odd:dark:bg-neutral-900 dark:border-neutral-900"
          >
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-neutral-500">
              {created_at.split("T")[0]}
            </p>
            <p className="mt-2">{payload}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
