import type { ReactNode } from "react";

export default function Section({
  id,
  labelledBy,
  tone = "white",
  className = "",
  children,
}: {
  id?: string;
  labelledBy?: string;
  tone?: "white" | "paper";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`scroll-mt-20 px-4 py-20 lg:px-6 lg:py-32 ${
        tone === "paper" ? "bg-paper" : "bg-white"
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-[28px] font-bold leading-[1.3] tracking-[-0.02em] lg:text-5xl lg:leading-[1.2]"
    >
      {children}
    </h2>
  );
}
