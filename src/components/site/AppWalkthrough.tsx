"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./HomeRentalPage.module.css";
const steps = [
  { tab:"予約", title:"アプリで予約", body:"使いたい商品の空き状況を確認し、利用する日時を選んで予約します。", image:"app-reservation-card.png" },
  { tab:"受け取り", title:"館内で受け取り", body:"予約詳細で受け取り場所を確認し、館内のロッカーでQRコードを読み取って利用を開始します。", image:"app-flow-pickup-v2.png" },
  { tab:"返却", title:"使い終わったら返却", body:"使い終わったらお手入れをして、付属品と一緒に元のロッカーへ返却します。", image:"app-flow-return-v2.png" },
];
function StepCopy({ step }: { step: (typeof steps)[number] }) {
  return <><div className={styles.mobileStepVisual}><Image src={`/images/figma/${step.image}`} alt={`${step.tab}のアプリ画面イメージ`} fill sizes="(max-width: 800px) calc(100vw - 48px), 520px" className={styles.mobileStepImage} /></div><div><h3>{step.title}</h3><p>{step.body}</p></div></>;
}

export default function AppWalkthrough() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const layoutRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const desktop = window.matchMedia("(min-width: 801px)").matches;
      const layout = layoutRef.current;
      const rail = railRef.current;
      const track = trackRef.current;
      const moving = rows.current[1];
      if (desktop && layout && rail && track && moving) {
        const rect = layout.getBoundingClientRect();
        const travel = Math.max(1, rect.height - rail.offsetHeight);
        const progress = Math.min(1, Math.max(0, (96 - rect.top) / travel));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          const maxY = Math.max(0, track.clientHeight - moving.offsetHeight);
          moving.style.transform = `translateY(${progress * maxY}px)`;
        }
        setActive(progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2);
        return;
      }
      if (moving) moving.style.transform = "";
      const center = window.innerHeight * 0.6;
      let nearest = 0;
      let distance = Infinity;
      rows.current.forEach((row, index) => {
        if (!row) return;
        const rect = row.getBoundingClientRect();
        const delta = Math.abs(rect.top + rect.height / 2 - center);
        if (delta < distance) { distance = delta; nearest = index; }
      });
      setActive(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return <section id="how" className={`${styles.section} ${styles.scrollWalkthrough}`} aria-labelledby="how-heading">
    <h2 id="how-heading">商品の確認から予約まで<br />アプリで完結</h2>
    <div className={styles.scrollLayout} ref={layoutRef}>
      <div className={styles.stickyVisual}>
        <div className={styles.stickyFrame}>
        {steps.map((step, index) => <Image key={step.image} src={`/images/figma/${step.image}`} alt={`${step.tab}のアプリ画面イメージ`} fill loading="eager" sizes="(max-width:800px) 90vw, 40vw" className={`${styles.scrollImage} ${index === active ? styles.shownImage : ""}`} aria-hidden={index !== active} />)}
        </div>
      </div>
      <div className={styles.scrollDescriptions} ref={railRef}>
        <div ref={element => { rows.current[0] = element; }} className={styles.scrollStep}><StepCopy step={steps[0]} /></div>
        <div className={styles.scrollStepTrack} ref={trackRef}>
          <div ref={element => { rows.current[1] = element; }} className={`${styles.scrollStep} ${styles.scrollStepMoving}`}><StepCopy step={steps[1]} /></div>
        </div>
        <div ref={element => { rows.current[2] = element; }} className={styles.scrollStep}><StepCopy step={steps[2]} /></div>
      </div>
    </div>
  </section>;
}
