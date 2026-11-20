import Image from "next/image";
import { operation } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

const images = {
  installation: "/images/home/locker.jpg",
  maintenance: "/images/home/ops-dashboard.jpg",
  supply: "/images/home/storage.jpg",
  support: "/images/home/app-phone.jpg",
} as const;

export default function OperationShowcase() {
  return (
    <div className={styles.cards}>
      {operation.items.map((item) => (
        <article key={item.id}>
          <div className={styles.cardMedia}>
            <Image
              src={images[item.id as keyof typeof images]}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className={item.id === "maintenance" || item.id === "support" ? `${styles.sectionImage} ${styles.productShot}` : styles.sectionImage}
            />
          </div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}
