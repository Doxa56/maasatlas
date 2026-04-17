import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  block?: boolean;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "bg-[#1e1b16] text-white hover:opacity-95",
  secondary: "border border-[rgba(30,27,22,0.1)] bg-white/70 text-[#1e1b16] hover:bg-white",
  ghost: "border border-[rgba(30,27,22,0.1)] bg-white/60 text-[#1e1b16] hover:bg-white",
};

export default function Button({ variant = "primary", block = false, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={[
        "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
        variantClassMap[variant],
        block ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
