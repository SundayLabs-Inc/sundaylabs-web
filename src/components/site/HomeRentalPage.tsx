import Link from "next/link";
import Image from "next/image";
import LifestyleHero from "@/components/site/LifestyleHero";
import FaqList from "@/components/site/FaqList";
import OperationShowcase from "@/components/site/OperationShowcase";
import { closing, contactCta, feature, flow, operation, owners, service } from "@/content/home";
import styles from "./HomeRentalPage.module.css";

export default function HomeRentalPage() {
  return (
    <div className={styles.page}>
      <LifestyleHero />

      <section id="service" aria-labelledby="service-heading" className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 id="service-heading">マンションの家電シェアで、身軽な暮らし</h2>
          <p>必要な家電を、マンションの共用スペースで借りられます。買い揃えずに使えると、暮らしが少し身軽になります。</p>
          <Link href="/appliance-sharing" className="underline underline-offset-4">家電シェア・レンタルの仕組みを詳しく見る</Link>
        </div>
        <div className={`${styles.lineup} ${styles.benefitCards}`}>
          {[
            { id: "borrow", first: "買わずに", last: "使える。", body: "たまに使う家電を、必要なときだけ借りられます。購入費用をかけずに利用できます。" },
            { id: "space", first: "収納を", last: "増やさない。", body: "使い終わったらマンションの共用スペースへ返します。自宅に家電を置く場所を用意する必要はありません。" },
            { id: "nearby", first: "すぐそばで", last: "借りられる。", body: "受け取りも返却もマンション内で済みます。配送を待つ時間や、返送の手間を省けます。" },
            { id: "try", first: "気になる家電を", last: "試せる。", body: "使い心地を自宅で確かめてから、自分に合う一台を選べます。" },
          ].map(item => <article key={item.id}>
            <div className={styles.benefitImage}>
              <Image src={`/images/home/benefit-${item.id}.png`} alt={item.first + item.last + "を表す暮らしのイメージ"}
                fill sizes="(max-width: 767px) 90vw, (max-width: 1100px) 45vw, 24vw" className={styles.sectionImage} />
            </div>
            <h3>{item.first}{item.last}</h3>
            <p>{item.body}</p>
          </article>)}
        </div>
      </section>

      <section id="how" aria-labelledby="how-heading" className={`${styles.section} ${styles.split} ${styles.how}`}>
        <div className={styles.splitCopy}>
          <h2 id="how-heading">{feature.title}</h2>
          <p>{feature.body}</p>
          <ol className={styles.steps}>
            {feature.steps.map(step => <li key={step.id}>
              <div><h3>{step.title}</h3><p>{step.body}</p></div>
            </li>)}
          </ol>
        </div>
        <div className={`${styles.media} ${styles.portraitMedia}`}>
          <Image src="/images/home/app-and-locker.png" alt="スマートフォンを使い、マンションの共用スペースのロッカーから家電を受け取るイメージ"
            fill sizes="(max-width: 767px) 90vw, 55vw" className={styles.sectionImage} />
        </div>
      </section>

      <section id="owners" aria-labelledby="owners-heading" className={`${styles.section} ${styles.split} ${styles.owners}`}>
        <div className={styles.lockerLineup}>
          <Image src="/images/home/shared-appliance-fictional-v4.png" width={1774} height={887}
            sizes="(max-width: 767px) 90vw, 55vw" alt="掃除機、VRヘッドセット、プロジェクター、美容家電などを並べた共用棚のイメージ" />
          <p className={styles.imageNote}>画像はイメージです。</p>
        </div>
        <div className={styles.splitCopy}>
          <h2 id="owners-heading">{owners.title}</h2>
          <p>{owners.body}</p>
          <Link href="/for-property-owners" className="underline underline-offset-4">設置条件・費用・運用分担を確認する</Link>
          <ul className={styles.editorialList}>{owners.items.map(item => <li key={item.title}>
            <h3>{item.title}</h3><p>{item.body}</p>
          </li>)}</ul>
        </div>
      </section>

      <section id="operation" aria-labelledby="operation-heading" className={`${styles.section} ${styles.operation}`}>
        <div className={styles.operationIntro}>
          <h2 id="operation-heading">{operation.title}</h2>
          <p>{operation.body}</p>
        </div>
        <OperationShowcase />
      </section>

      <section id="flow" aria-labelledby="flow-heading" className={`${styles.section} ${styles.flowSection}`}>
        <div className={styles.flowIntro}>
          <h2 id="flow-heading">{flow.title}</h2><p>{flow.body}</p>
        </div>
        <ol className={styles.flow}>
          {flow.steps.map(step => <li key={step.id} id={step.id}>
            <h3>{step.title}</h3><p>{step.body}</p>
          </li>)}
        </ol>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className={`${styles.section} ${styles.faq}`}>
        <h2 id="faq-heading">よくある質問</h2>
        <FaqList items={service.faqs} />
      </section>

      <section aria-labelledby="closing-heading" className={styles.closing}>
        <div><h2 id="closing-heading">{closing.title}</h2><p>{closing.body}</p></div>
        <Link href={contactCta.href} className={styles.button}>{contactCta.label}</Link>
      </section>
    </div>
  );
}
