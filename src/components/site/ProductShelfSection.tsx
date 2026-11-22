import Image from "next/image";
import styles from "./HomeRentalPage.module.css";

export default function ProductShelfSection() {
  return (
    <section
      id="lineup"
      className={`${styles.section} ${styles.shelfShowcase}`}
      aria-labelledby="lineup-heading"
    >
      <div className={styles.howLayout}>
        <div className={styles.howCopy}>
          <h2 id="lineup-heading">マンションそれぞれのニーズに合わせた商品構成</h2>
          <p>
            入居者の年代や世帯構成、設置スペースを伺い、家電の組み合わせをご提案します。
            <br />
            導入後も利用状況やご要望を確認し、構成の見直しにつなげます。
          </p>
        </div>
        <div className={styles.shelfVisual}>
          <Image
            src="/images/figma/product-shelf.jpg"
            alt="マンションの共用スペースに並ぶ掃除家電、美容家電、生活ガジェットなどのイメージ"
            width={1024}
            height={512}
            className={styles.shelfImage}
            sizes="(max-width: 1000px) calc(100vw - 48px), min(720px, 55vw)"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
