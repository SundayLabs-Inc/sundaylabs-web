import { getImageProps } from "next/image";
import { hero } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

export default function LifestyleHero() {
  const common = {
    alt: "母親が掃除機を使い、父親と子どもが絵本を読むリビングのイメージ",
    sizes: "(max-width: 767px) 100vw, 96vw",
    loading: "eager" as const,
    fetchPriority: "high" as const,
  };
  const { props: desktop } = getImageProps({ ...common, src: "/images/home/hero-family-unbranded-v1.png", width: 1671, height: 941 });
  const { props: mobile } = getImageProps({ ...common, src: "/images/home/hero-family-mobile-v1.webp", width: 1120, height: 1400 });
  return <section className={styles.lifestyleHero} aria-labelledby="hero-heading">
    <div className={styles.lifestyleCopy}>
      <h1 id="hero-heading">{hero.title.split("、").map((line, index) =>
        <span key={line}>{line}{index === 0 ? "、" : ""}</span>)}
      </h1>
      <p>SundayLabsは、マンションの共用スペースで、必要なときに家電を借りられるシェアサービスです。<br />モノを増やさず、暮らしの楽しみと可能性を広げます。</p>
    </div>
    <div className={styles.lifestyleMedia}>
      <picture>
        <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes={mobile.sizes} width={1120} height={1400} />
        <img {...desktop} className={styles.lifestyleVideo} alt={common.alt} />
      </picture>
    </div>
  </section>;
}
