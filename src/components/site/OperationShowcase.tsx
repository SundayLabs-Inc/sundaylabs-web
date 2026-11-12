"use client";

import { useState } from "react";
import Image from "next/image";
import { operation } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

export default function OperationShowcase() {
  const [selected, setSelected] = useState(0);
  const item = operation.items[selected];
  return <div className={styles.showcase}>
    <div className={styles.supportChoices} role="group" aria-label="運用サポートの項目">
      {operation.items.map((choice, index) => <button key={choice.id} type="button"
        aria-pressed={selected === index} aria-controls="support-detail"
        onClick={() => setSelected(index)}>{choice.title}</button>)}
    </div>
    <div id="support-detail" className={styles.supportDetail}>
      <div className={`${styles.media} ${styles.supportMedia}`}>
        <Image src={`/images/home/operation-${item.id}.png`} alt={`${item.title}のイメージ`}
          fill sizes="(max-width: 767px) 85vw, 45vw" className={styles.sectionImage} />
      </div>
      <div className={styles.supportCopy} aria-live="polite">
        <h3>{item.title}</h3><p>{item.body}</p>
      </div>
    </div>
  </div>;
}
