import Link from "next/link";

const variants = {
  solid: "border-ink bg-ink text-white hover:bg-white hover:text-ink",
  white: "border-white bg-white text-ink hover:bg-transparent hover:text-white",
  outline: "border-white bg-transparent text-white hover:bg-white hover:text-ink",
  outlineInk: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
};

export default function PillLink({
  href,
  children,
  variant = "solid",
  className = "",
  onClick,
}: {
  href: string;
  children: string;
  variant?: keyof typeof variants;
  className?: string;
  onClick?: () => void;
}) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      onClick={onClick}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`inline-flex h-14 w-[200px] items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
