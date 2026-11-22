import Image from "next/image";
import Link from "next/link";
import FaqItem from "./FaqItem";
import AppWalkthrough from "./AppWalkthrough";
import ProductShelfSection from "./ProductShelfSection";
import { service } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

const removedQuestions = new Set(["どのように家電を借りられますか？", "使い終わった家電は、どこに返しますか？", "管理会社は、どこまで対応する必要がありますか？"]);
const photos = [
  { name: "robot", alt: "木の床で使用するロボット掃除機", position: "right center" },
  { name: "printer", alt: "プリンターで印刷する様子", position: "center" },
  { name: "vacuum", alt: "コードレス掃除機", position: "center" },
  { name: "projector", alt: "自宅でプロジェクターを楽しむ様子", position: "center" },
];
export default function HomeRentalPage() {
  const faqs = service.faqs.filter(item => !removedQuestions.has(item.q) && !item.q.includes("管理会社"));
  return <div className={styles.page}>
    <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
      <h1 id="hero-heading">所有に縛られない<br />新しい暮らしのインフラ</h1>
      <p>SundayLabs は、マンションの共用空きスペースを活用し、<br className={styles.desktopBreak} />居住者が家電や生活ガジェットを手軽に借りられるシェアリングプラットフォームです。</p>
      <div className={styles.actions}><Link className={styles.button} href="/contact">設置について相談する</Link><a className={styles.secondary} href="#how">利用方法を見る</a></div>
      <div className={styles.heroVisual}><picture><source media="(max-width: 800px)" srcSet="/images/figma/hero-station-mobile-v1.jpg" /><Image unoptimized src="/images/figma/hero-station-desktop.jpg" alt="共用スペースに設置されたSundayLabsの家電レンタルステーションのイメージ" width={1672} height={941} preload sizes="(max-width: 800px) calc(100vw - 48px), (max-width: 1040px) calc(100vw - 64px), 976px" /></picture></div>
    </section>
    <section id="service" className={`${styles.section} ${styles.features}`} aria-labelledby="feature-heading">
      <p className={styles.sectionLabel}>SundayLabsの特徴</p>
      <h2 id="feature-heading">家電を所有せずに<br />必要なときだけ利用できる</h2>
      <div className={styles.photoRow}>{photos.map(photo => <div key={photo.name} className={styles.photo}><Image src={`/images/figma/${photo.name}.png`} alt={photo.alt} fill sizes="(max-width: 600px) 72vw, (max-width: 900px) 45vw, 25vw" style={{objectFit:"cover",objectPosition:photo.position}} /></div>)}</div>
      <div className={styles.featureBody}><p>家電を購入するときは、価格だけでなく使う頻度や収納場所も考える必要があります。<br className={styles.desktopBreak} />気になる製品でも、自宅での使い心地がわからず、購入を迷うことがあります。</p><p>SundayLabsは、必要なときだけ家電を借りて自宅で試せる仕組みで、<br className={styles.desktopBreak} />購入費用や収納場所の悩み、使い心地への不安を解決します。</p></div>
    </section>
    <ProductShelfSection />
    <AppWalkthrough />
    <section id="owners" className={`${styles.section} ${styles.split}`} aria-labelledby="owner-heading">
      <div className={styles.copy}><p className={styles.audienceLabel}>不動産オーナー・管理会社の方へ</p><h2 id="owner-heading">共用スペースの活用で<br />住まいに新たな価値を</h2><p>共用の空きスペースを、家電や生活ガジェットを利用できる設備へ。居住者の日々の利便性を高め、物件選びの魅力となるサービスをご提案します。</p><p>商品の管理・メンテナンスから居住者のお問い合わせ対応まで、SundayLabsが担当します。設置場所や運用方法は、物件の条件に合わせて調整します。</p></div>
      <div className={styles.partnerPhoto}><Image src="/images/figma/property-cityscape.png" alt="マンションが広がる街並み" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
    </section>
    <section id="manufacturers" className={`${styles.section} ${styles.split} ${styles.manufacturers}`} aria-labelledby="manufacturer-heading">
      <div className={styles.partnerPhoto}><Image src="/images/figma/manufacturer-kitchen.png" alt="家電が日常に溶け込むキッチン" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
      <div className={styles.copy}><p className={styles.audienceLabel}>メーカーの方へ</p><h2 id="manufacturer-heading">暮らしの中で伝わる<br />製品の価値</h2><p>シェアステーションを通じて、製品を実際の生活環境で試せる機会を提供します。店頭での比較だけではわからない使い心地や日常での利便性を、購入前の体験として届けます。</p><p>製品の特性に応じた貸出方法や導入先への展開など、新たな顧客接点づくりをご相談いただけます。</p></div>
    </section>
    <section id="faq" className={`${styles.section} ${styles.faq}`} aria-labelledby="faq-heading"><h2 id="faq-heading">よくあるご質問</h2><div className={styles.faqList}>{faqs.map(item=><FaqItem key={item.q} question={item.q} answer={item.a} />)}</div></section>
    <section className={styles.consultation} aria-labelledby="consultation-heading"><div className={styles.consultationInner}><div><h2 id="consultation-heading">設置スペースや運用方法など、導入についてご相談ください。</h2><p>物件の状況に合わせて、設置場所や<br className={styles.desktopBreak} />必要な設備をご案内します。</p><div className={styles.consultationAction}><Link href="/contact" className={styles.button}>設置について相談する</Link></div></div></div></section>
  </div>;
}
