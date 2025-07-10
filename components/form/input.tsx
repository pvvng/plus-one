import { InputHTMLAttributes } from "react";

interface InputProps {
  name: string;
  label: string;
  labelText: string;
  errors?: string[];
}

export default function Input({
  name,
  label,
  labelText,
  errors = [],
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-neutral-500 dark:text-neutral-200 mb-1"
      >
        {labelText}
      </label>
      <input
        id={label}
        name={name}
        className="w-full px-2 py-1 border border-neutral-300 rounded
        dark:border-neutral-900 dark:bg-neutral-900 placeholder:text-sm text-sm
        focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...rest}
      />
      {errors.map((error) => (
        <p key={error} className="text-sm text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}
