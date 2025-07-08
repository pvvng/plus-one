import ContactForm from "@/components/contact-form";
import Link from "next/link";

export const metadata = {
  title: "문의하기",
  description:
    "플러스원에 대한 문의나 피드백이 있으신가요? 간단한 연락처 양식을 통해 개발자에게 메시지를 보낼 수 있어요.",
};

export default function ContactPage() {
  return (
    <main className="max-w-screen-sm mx-auto py-12 text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-paperlogy">
      <h1 className="text-2xl font-bold mb-4">문의하기</h1>
      <Link
        href="/"
        className="mb-4 block text-xs text-blue-500 hover:text-blue-600"
      >
        메인화면으로
      </Link>
      <hr className="border border-neutral-200 border-dashed mb-4" />
      <ContactForm />
    </main>
  );
}
