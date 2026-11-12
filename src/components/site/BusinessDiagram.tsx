import type { ReactNode } from "react";
import Wordmark from "@/components/site/Wordmark";

const icons: Record<string, ReactNode> = {
  play: (
    <>
      <path d="M5 21v-6" />
      <path d="M12 21V9" />
      <path d="M19 21V3" />
    </>
  ),
  reward: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  commerce: (
    <>
      <path d="M16 10a4 4 0 0 1-8 0" />
      <path d="M3.103 6.034h17.794" />
      <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
    </>
  ),
};

/** Node centres on the ring, as percentages of the square. */
const nodePos = [
  { left: "50%", top: "8%" },
  { left: "14%", top: "71%" },
  { left: "86%", top: "71%" },
];

/** Arc midpoints (degrees, y-down); the flow runs counter-clockwise on screen. */
const arrowAngles = [-150, 90, -30];
const RING_RADIUS = 42;

export default function BusinessDiagram({ name, items }: { name: string; items: { id: string; title: string }[] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ink/35">
        <circle
          cx="50"
          cy="50"
          r={RING_RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          strokeLinecap="round"
          strokeDasharray="0.01 1.2"
        />
        {arrowAngles.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 50 + RING_RADIUS * Math.cos(rad);
          const cy = 50 + RING_RADIUS * Math.sin(rad);
          const dir = rad - Math.PI / 2;
          const point = (along: number, across: number) =>
            `${(cx + along * Math.cos(dir) - across * Math.sin(dir)).toFixed(2)},${(cy + along * Math.sin(dir) + across * Math.cos(dir)).toFixed(2)}`;
          return (
            <polygon
              key={angle}
              points={`${point(2.6, 0)} ${point(-2, -1.6)} ${point(-1, 0)} ${point(-2, 1.6)}`}
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.4"
              strokeLinejoin="round"
              className="text-ink"
            />
          );
        })}
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-ink">
        <Wordmark name={name} className="h-auto w-[54%]" />
      </p>
      <ul>
        {items.map((item, index) => (
          <li
            key={item.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={nodePos[index]}
          >
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/25 bg-white lg:h-28 lg:w-28"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-ink lg:h-11 lg:w-11"
              >
                {icons[item.id]}
              </svg>
            </span>
            <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-xs font-bold whitespace-nowrap text-ink lg:text-[13px]">
              {item.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
