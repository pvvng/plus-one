import Link from "next/link";

// update page (업데이트)
export const metadata = {
  title: "업데이트 내역",
  description: "플러스원 서비스의 최신 업데이트 내역과 변경 사항을 확인하세요.",
};

export default function UpdatePage() {
  return (
    <main className="max-w-screen-sm mx-auto py-12 px-5 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-paperlogy min-h-screen">
      <h1 className="text-2xl font-bold mb-4">업데이트 내역</h1>
      <Link
        href="/"
        className="mb-4 block text-xs text-blue-500 hover:text-blue-600"
      >
        메인화면으로
      </Link>
      <hr className="border border-neutral-200 border-dashed" />
      <div className="py-5 space-y-5">{/* TODO: 업데이트 내역 */}</div>
    </main>
  );
}
