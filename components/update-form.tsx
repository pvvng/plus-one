"use client";

import { postUpdate } from "@/app/update/actions";
import { useActionState } from "react";

export default function UpdateForm() {
  const [state, action] = useActionState(postUpdate, null);

  return (
    <form className="space-y-4 mb-4" action={action}>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-neutral-500 mb-1"
        >
          제목
        </label>
        <input
          id="title"
          name="title"
          className="text-sm w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="업데이트 제목"
          required
        />
      </div>
      <div>
        <label
          htmlFor="payload"
          className="block text-sm font-medium text-neutral-500 mb-1"
        >
          업데이트 내용
        </label>
        <textarea
          id="payload"
          name="payload"
          required
          rows={6}
          placeholder="업데이트 내용 작성"
          className="text-sm w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>
      {state && <p className="text-sm text-red-600">{state}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded cursor-pointer"
      >
        등록하기
      </button>
    </form>
  );
}
