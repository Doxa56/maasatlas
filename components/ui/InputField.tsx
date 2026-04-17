import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function InputField({ label, className = "", ...props }: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>{label}</span>
      <input
        className={[
          "w-full rounded-[14px] border border-[rgba(30,27,22,0.1)] bg-[#fffdf9] px-4 py-3 text-sm text-[#1e1b16]",
          "outline-none transition focus:border-[rgba(196,103,62,0.6)] focus:ring-2 focus:ring-[rgba(196,103,62,0.12)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </label>
  );
}
