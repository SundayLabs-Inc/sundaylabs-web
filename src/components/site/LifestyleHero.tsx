import Link from "next/link";
import { getImageProps } from "next/image";
import { contactCta, hero } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

export default function LifestyleHero() {
  const { props } = getImageProps({
    alt: "",
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
    src: "/images/home/hero-mission.jpg",
    width: 1672,
    height: 941,
  });
  return (
    <section id="hero" className={styles.lifestyleHero} aria-labelledby="hero-heading">
      <div className={styles.lifestyleMedia}>
        <img {...props} className={styles.lifestyleVideo} alt="" />
      </div>
      <div className={styles.lifestyleCopy}>
        <h1 id="hero-heading">{hero.title}</h1>
        <p>{hero.lead}</p>
        <Link href={contactCta.href} className={styles.button}>{contactCta.label}</Link>
      </div>
    </section>
  );
}
