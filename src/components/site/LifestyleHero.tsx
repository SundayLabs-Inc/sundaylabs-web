import Image from "next/image";
import { hero } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

export default function LifestyleHero() {
  return <section className={styles.lifestyleHero} aria-labelledby="hero-heading">
    <div className={styles.lifestyleCopy}>
      <h1 id="hero-heading">{hero.title.split("、").map((line, index) =>
        <span key={line}>{line}{index === 0 ? "、" : ""}</span>)}
      </h1>
      <p>SundayLabs（サンデーラボ）は、マンションの共用スペースで、必要なときに家電を借りられるシェアサービスをつくっています。<br />モノを増やさず、暮らしの楽しみと可能性を広げます。</p>
    </div>
    <div className={styles.lifestyleMedia}>
      <Image className={styles.lifestyleVideo}
        src="/images/home/hero-family-unbranded-v1.png"
        alt="母親がコードレス掃除機で掃除し、父親と子どもが絵本を読むリビングのイメージ"
        fill sizes="100vw" preload />
    </div>
  </section>;
}
