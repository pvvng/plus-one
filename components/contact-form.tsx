"use client";

export default function ContactForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const form = event.currentTarget;
    alert("문의가 접수되었습니다. 이용해주셔서 감사합니다!");
  };

  return (
    <form className="space-y-4 mb-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          이름
        </label>
        <input
          id="name"
          name="name"
          className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="이름을 입력하세요."
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          이메일 주소
        </label>
        <input
          id="email"
          name="email"
          className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="답장을 받을 이메일 주소를 입력하세요."
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          문의 내용
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="궁금한 점이나 의견을 적어주세요."
          className="w-full p-2 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded cursor-pointer"
      >
        보내기
      </button>
    </form>
  );
}
