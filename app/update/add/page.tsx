import UpdateForm from "@/components/update-form";
import { redirect } from "next/navigation";

export default async function AddUpdatePage() {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) return redirect("/");

  return (
    <main className="max-w-screen-sm min-h-screen mx-auto py-12 px-5 font-paperlogy">
      <h1 className="text-xl font-semibold mb-4">업데이트 추가</h1>
      <UpdateForm />
    </main>
  );
}
