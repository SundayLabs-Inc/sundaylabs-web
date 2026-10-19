import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black/80",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-white",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-7 text-[15px]",
  sm: "h-9 px-4 text-sm",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

export default function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link {...props} className={`${buttonClass(variant, size)} ${className}`} />;
}
