import "./skild-bento.css";
import type { Locale } from "@/constants/site";

const copy = {
  ja: {
    panels: [
      { name: "構想", body: "対象工程と、技術、順番を決める。" },
      { name: "実装", body: "実機で研究開発し、検証する。" },
      { name: "定着", body: "組織と基盤を残し、運用を続ける。" },
    ],
  },
  en: {
    panels: [
      { name: "Concept", body: "Decide the process, the technology, and the order." },
      { name: "Build", body: "Do the research on the real robot, and validate it." },
      { name: "Stay", body: "Leave the team and the infrastructure, and keep operations going." },
    ],
  },
} as const;

export default function RailBento({ locale }: { locale: Locale }) {
  const { panels } = copy[locale];

  return (
    <section id="path" className="path-rail scroll-mt-24">
      <div className="basice">
        {panels.map((panel, index) => (
          <div key={panel.name} className="div-block-66">
            {index === 1 ? <div className="process-middle-lines" /> : null}
            <div className="div-block-67">
              <p className="process-title secondary">0{index + 1}</p>
              <h2 className="process-title">{panel.name}</h2>
              <p className="process-body">{panel.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
