import "./sunday-schedule.css";
import { getApproach } from "@/constants/approach";
import type { Locale } from "@/constants/site";

const tones = [
  { color: "#292827", tone: "dark" },
  { color: "#f3f3f0", tone: "light" },
  { color: "#292827", tone: "dark" },
  { color: "#f3f3f0", tone: "light" },
] as const;

export default function RailSchedule({ locale }: { locale: Locale }) {
  const approach = getApproach(locale);
  const title = approach.title;
  const cards = approach.cards.map((card, index) => ({
    ...card,
    ...tones[index],
  }));

  return (
    <section id="schedule" className="schedule-sunday scroll-mt-24">
      <h2 className="schedule-heading">{title}</h2>
      <ul className="schedule-row">
        {cards.map((card) => (
          <li key={card.title}>
            <div className={card.tone === "dark" ? "schedule-card-face is-dark" : "schedule-card-face is-light"} style={{ background: card.color }}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
