import type { Metadata } from "next";
import SiteShell from "@/components/site/SiteShell";
import WaitlistForm from "@/components/site/WaitlistForm";
import { legalDocuments } from "@/config/legal";
import { createSiteMetadata } from "@/lib/seo";

export const metadata: Metadata = createSiteMetadata({
  title: "ウェイトリストに登録する | あしたのロボティクス",
  description:
    "東京近郊で、ロボットによる家事代行サービスのウェイトリストへのご登録を受け付けています。メールアドレスとお住まいの地域でご登録いただけます。",
  path: "/waitlist",
});

export default function WaitlistPage() {
  return (
    <SiteShell>
      <section
        aria-labelledby="waitlist-heading"
        className="grid gap-12 px-4 pt-16 pb-24 lg:grid-cols-12 lg:gap-6 lg:px-6 lg:pt-28 lg:pb-36"
      >
        <div className="lg:col-span-6">
          <h1
            id="waitlist-heading"
            className="text-[36px] font-bold leading-[1.2] tracking-[-0.03em] lg:text-6xl"
          >
            ウェイトリストに登録する
          </h1>
          <div className="mt-8 space-y-4 text-[15px] leading-[1.9] text-ink-muted lg:text-base">
            <p>現在、東京近郊で、ロボットによる家事代行サービスのウェイトリストへのご登録を受け付けています。</p>
            <p>サービス提供が可能になりましたら、ご登録いただいたメールアドレスにご案内します。</p>
          </div>
          <p className="mt-6 text-sm leading-[1.8]">
            登録は無料です。登録によってサービスの利用が確約されるものではありません。
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <WaitlistForm
            privacyPolicyVersion={legalDocuments.privacy.version}
            privacyPath={legalDocuments.privacy.path}
          />
        </div>
      </section>
    </SiteShell>
  );
}
