"use server";

import { supabase } from "@/lib/supabase";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

interface Updates {
  id: string;
  title: string;
  payload: string;
  created_at: string;
}

async function _getUpdates() {
  const { data, error } = await supabase
    .from("updates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("업데이트 내역을 불러오는 중 에러가 발생했습니다: ", error);
    return [] as Updates[];
  }

  return data as Updates[];
}

export const getUpdates = unstable_cache(_getUpdates, ["updates-cache-key"], {
  revalidate: 60 * 60 * 24,
  tags: ["updates"],
});

export async function postUpdate(
  _: unknown,
  formData: FormData
): Promise<string | null> {
  const title = formData.get("title")?.toString() || "";
  const payload = formData.get("payload")?.toString() || "";

  if (!title || !payload) {
    return "제목 혹은 내용이 완성되지 않았습니다.";
  }

  const { error } = await supabase.from("updates").insert([{ title, payload }]);

  if (error) {
    console.error("업데이트 항목을 추가하는 중 에러가 발생했습니다: ", error);
    return "업데이트 항목을 추가하는 중 에러가 발생했습니다";
  }

  revalidateTag("updates");
  return redirect("/update");
}
