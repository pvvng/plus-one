"use client";

import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}
export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 
      text-white font-semibold rounded cursor-pointer disabled:bg-neutral-600"
    >
      {text}
    </button>
  );
}
