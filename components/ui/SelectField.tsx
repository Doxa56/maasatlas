import { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

export default function SelectField({ label, options, className = "", ...props }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span>{label}</span>
      <select
        className={[
          "w-full rounded-[14px] border border-[rgba(30,27,22,0.1)] bg-[#fffdf9] px-4 py-3 text-sm text-[#1e1b16]",
          "outline-none transition focus:border-[rgba(196,103,62,0.6)] focus:ring-2 focus:ring-[rgba(196,103,62,0.12)]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
