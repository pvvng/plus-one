"use client";

import Input from "./input";
import Textarea from "./textarea";

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const form = event.currentTarget;
    alert("문의가 접수되었습니다. 이용해주셔서 감사합니다!");
  };

  return (
    <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="name"
        labelText="이름"
        placeholder="이름을 입력하세요."
      />
      <Input
        name="email"
        label="email"
        labelText="이메일 주소"
        placeholder="답장을 받을 이메일 주소를 입력하세요."
      />
      <Textarea
        label="message"
        name="message"
        required
        labelText="문의 내용"
        placeholder="궁금한 점이나 의견을 적어주세요."
      />

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded cursor-pointer"
      >
        보내기
      </button>
    </form>
  );
}
