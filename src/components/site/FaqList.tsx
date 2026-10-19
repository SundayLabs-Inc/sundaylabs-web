export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.q} className="site-faq border-b border-line">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-base font-medium leading-relaxed lg:text-lg">
            <span>{item.q}</span>
            <svg
              className="site-faq-icon mt-1.5 shrink-0 transition-transform duration-200"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </summary>
          <p className="pb-6 text-[15px] leading-[1.9] text-ink-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
