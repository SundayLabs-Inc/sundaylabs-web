import Image from "next/image";
import styles from "./HomeRentalPage.module.css";

const phones = [
  { src: "app-phone-list.png", alt: "アプリの商品一覧画面" },
  { src: "app-phone-detail.png", alt: "アプリの商品詳細画面" },
  { src: "app-phone-booking.png", alt: "アプリの予約日時選択画面" },
];

export default function AppWalkthrough() {
  return (
    <section id="how" className={`${styles.section} ${styles.howShowcase}`} aria-labelledby="how-heading">
      <div className={styles.howLayout}>
        <div className={styles.howCopy}>
          <h2 id="how-heading">
            商品の確認から予約まで、
            <br className={styles.mobileBreak} />
            アプリで完結
          </h2>
          <p>
            使いたい家電をスマートフォンで選びます。
            <br />
            空き状況を確認し、
            <br className={styles.mobileBreak} />
            日時を選んで予約します。
          </p>
        </div>
        <div className={styles.howPhones}>
          {phones.map((phone) => (
            <Image
              key={phone.src}
              src={`/images/figma/${phone.src}`}
              alt={phone.alt}
              width={455}
              height={945}
              sizes="(max-width: 1000px) 42vw, 240px"
              className={styles.howPhoneImage}
              unoptimized
            />
          ))}
        </div>
      </div>
    </section>
  );
}
