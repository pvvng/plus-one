import { TextareaHTMLAttributes } from "react";

interface TextareaProps {
  name: string;
  label: string;
  labelText: string;
  errors?: string[];
}

export default function Textarea({
  name,
  label,
  labelText,
  errors = [],
  ...rest
}: TextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-neutral-500 dark:text-neutral-200 mb-1"
      >
        {labelText}
      </label>
      <textarea
        id={label}
        name={name}
        rows={6}
        className="w-full p-2 border border-neutral-300 rounded
        dark:border-neutral-900 dark:bg-neutral-900 placeholder:text-sm text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        {...rest}
      />
    </div>
  );
}
