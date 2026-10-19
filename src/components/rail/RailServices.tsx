import "./skild-features.css";
import { getRail } from "@/constants/rail";
import type { Locale } from "@/constants/site";

const images: Record<string, string> = {
  infrastructure: "/images/rd-infrastructure.jpg",
  research: "/images/go2-simulation.jpg",
};

export default function RailServices({ locale }: { locale: Locale }) {
  const rail = getRail(locale);

  return (
    <section id="services" className="services-skild scroll-mt-24">
      <h2 className="feature_top_text">{rail.services.title}</h2>
      {rail.domains.map((domain, index) => {
        const image = images[domain.id];
        return (
          <div key={domain.id} id={domain.id} className={index % 2 === 1 ? "feature-block reverse scroll-mt-24" : "feature-block scroll-mt-24"}>
            <div className="feature_text-block">
              <h3 className="feature_title">{domain.name}</h3>
              <p className="feature_description">{domain.body}</p>
            </div>
            <div className="feature_image-block">
              {image ? <img src={image} alt={domain.name} /> : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
