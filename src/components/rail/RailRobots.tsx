import "./robot-row.css";

const robots = [
  { src: "/images/robots/robot-g1.jpg?v=2", alt: "Unitree G1" },
  { src: "/images/robots/robot-go2.jpg?v=2", alt: "Unitree Go2", wide: true },
  { src: "/images/robots/robot-dual-arm.jpg?v=3", alt: "OpenArm" },
  { src: "/images/robots/robot-franka.jpg?v=3", alt: "Franka Emika" },
  { src: "/images/robots/robot-crx.jpg?v=2", alt: "FANUC CRX-5iA", wide: true },
  { src: "/images/robots/robot-cobot.jpg?v=2", alt: "協働ロボット", wide: true },
  { src: "/images/robots/robot-tracked.jpg?v=2", alt: "クローラロボット" },
];

export default function RailRobots() {
  return (
    <section className="robot-flow" aria-label="ロボット">
      <div className="robot-flow-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="robot-flow-group" aria-hidden={copy === 1 || undefined}>
            {robots.map((robot) => (
              <li key={`${copy}-${robot.src}`}>
                <img className={"wide" in robot && robot.wide ? "is-wide" : undefined} src={robot.src} alt={copy === 0 ? robot.alt : ""} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
