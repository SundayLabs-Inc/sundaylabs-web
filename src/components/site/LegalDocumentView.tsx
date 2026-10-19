import { legalDocuments, operator } from "@/config/legal";
import type { LegalBlock, LegalDocument, LegalSection } from "@/content/legal/types";

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  if ("list" in block) {
    const Tag = block.ordered ? "ol" : "ul";
    return (
      <Tag className={`space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </Tag>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink">
            {block.table.head.map((h) => (
              <th key={h} scope="col" className="py-3 pr-4 font-medium text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map(([a, b]) => (
            <tr key={a} className="border-b border-line align-top">
              <th scope="row" className="w-[36%] py-3 pr-4 font-medium text-ink">
                {a}
              </th>
              <td className="py-3">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBody({ section, id, flush }: { section: LegalSection; id: string; flush?: boolean }) {
  return (
    <section aria-labelledby={id} className={flush ? "" : "border-t border-line pt-8"}>
      <h2 id={id} className="text-lg font-bold leading-snug text-ink lg:text-xl">
        {section.heading}
      </h2>
      <div className="mt-4 space-y-4">
        {section.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

export default function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  const meta = legalDocuments[doc.key];

  return (
    <article className="grid gap-10 px-4 pt-16 pb-24 lg:grid-cols-12 lg:gap-6 lg:px-6 lg:pt-28 lg:pb-36">
      <header className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <h1 className="text-[32px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[44px]">
            {meta.title}
          </h1>
          <dl className="mt-6 space-y-1 text-xs text-ink-muted">
            <div className="flex gap-2">
              <dt>施行日</dt>
              <dd>{meta.effectiveDate ?? "未定"}</dd>
            </div>
            <div className="flex gap-2">
              <dt>版</dt>
              <dd>{meta.version}</dd>
            </div>
          </dl>
          {meta.status === "draft" && (
            <p className="mt-6 rounded-xl border border-ink px-4 py-3 text-sm leading-relaxed">
              この文書は確認中の草案です。施行日が記載されるまでは確定版ではありません。
            </p>
          )}
        </div>
      </header>

      <div className="space-y-10 text-[15px] leading-[1.9] text-ink-muted lg:col-span-8">
        <div className="space-y-4">
          {doc.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {doc.summary && (
          <div className="rounded-2xl bg-paper p-6 lg:p-8">
            <SectionBody section={doc.summary} id={`${doc.key}-summary`} flush />
          </div>
        )}
        {doc.sections.map((section, i) => (
          <SectionBody key={section.heading} section={section} id={`${doc.key}-${i + 1}`} />
        ))}
        <p className="border-t border-line pt-8 text-sm">
          {operator.name}　{operator.postalCode} {operator.address}　{operator.email}
        </p>
      </div>
    </article>
  );
}
