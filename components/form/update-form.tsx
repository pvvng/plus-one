"use client";

import { postUpdate } from "@/app/update/actions";
import { useActionState } from "react";
import Input from "./input";
import Textarea from "./textarea";

export default function UpdateForm() {
  const [state, action] = useActionState(postUpdate, null);

  return (
    <form className="space-y-4 mb-4" action={action}>
      <Input
        name="title"
        label="title"
        labelText="제목"
        placeholder="업데이트 제목"
        required
      />

      <Textarea
        name="payload"
        label="payload"
        labelText="업데이트 내용"
        placeholder="업데이트 내용 작성"
      />
      {state && <p className="text-sm text-red-500">{state}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded cursor-pointer"
      >
        등록하기
      </button>
    </form>
  );
}
