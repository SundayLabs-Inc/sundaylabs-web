/**
 * Legal documents and unresolved operating conditions.
 *
 * Every document below is an AI-generated draft. Do not change `status` to
 * "reviewed" until a lawyer (弁護士等) has reviewed the text. While a document
 * is a draft its page is noindex, excluded from the sitemap, and shows a
 * draft notice.
 *
 * Fields set to `null` are operating conditions that have not been decided.
 * Documents render a neutral "will be explained before collection" sentence
 * for them instead of inventing a value. Fill them in only after the
 * corresponding operation or implementation actually exists.
 */

export const operator = {
  name: "あしたのロボティクス株式会社",
  nameEn: "Ashitano Robotics, Inc.",
  representative: "原 優水輝",
  postalCode: "〒150-0044",
  address: "東京都渋谷区円山町5-3 MIEUX渋谷ビル8階",
  email: "contact@ashitanorobotics.co.jp",
  /** Required for /legal (特定商取引法). */
  phone: null as string | null,
} as const;

export type LegalDocKey =
  | "privacy"
  | "servicePrivacy"
  | "serviceTerms"
  | "terms"
  | "legalNotice";

export type LegalDocMeta = {
  path: string;
  title: string;
  /** Stored with every consent record. Bump on any material change. */
  version: string;
  status: "draft" | "reviewed";
  /** ISO date (YYYY-MM-DD). `null` until the reviewed version is published. */
  effectiveDate: string | null;
};

export const legalDocuments: Record<LegalDocKey, LegalDocMeta> = {
  privacy: {
    path: "/privacy",
    title: "Webプライバシーポリシー",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
  servicePrivacy: {
    path: "/service-privacy",
    title: "サービスプライバシーポリシー",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
  serviceTerms: {
    path: "/service-terms",
    title: "サービス利用規約",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
  terms: {
    path: "/terms",
    title: "Webサイト利用規約",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
  legalNotice: {
    path: "/legal",
    title: "特定商取引法に基づく表記",
    version: "2026-10-14-draft.1",
    status: "draft",
    effectiveDate: null,
  },
};

export type Processor = {
  name: string;
  purpose: string;
  /** Country where the data is stored or processed. `null` = not yet confirmed. */
  country: string | null;
};

/** Website (waitlist, contact form). Supabase and Resend are used by the code in this repo. */
export const websiteOperations = {
  processors: [
    { name: "Supabase, Inc.", purpose: "ウェイトリスト登録情報の保存", country: null },
    { name: "Resend, Inc.", purpose: "登録完了メール・お問い合わせメールの送信", country: null },
  ] as Processor[],
  /** e.g. Vercel. `null` until the production host is decided. */
  hosting: null as Processor | null,
  /** e.g. "登録の取消しのお申出から30日以内に削除します". */
  waitlistRetention: null as string | null,
  /** Server access log retention at the hosting provider. */
  accessLogRetention: null as string | null,
  /** Set when an analytics tool or non-essential cookie is introduced. */
  analyticsTools: [] as string[],
};

/** Robot service. Nothing here is decided yet. */
export const serviceOperations = {
  /** e.g. "ロボットの頭部と手首に搭載したカメラ". */
  cameraSetup: null as string | null,
  /** Whether microphones record audio. `null` = undecided. */
  audioRecorded: null as boolean | null,
  /** Who operates the robot remotely and from where. */
  teleoperation: null as string | null,
  videoRetention: null as string | null,
  telemetryRetention: null as string | null,
  serviceRecordRetention: null as string | null,
  bookingDataRetention: null as string | null,
  storageProviders: [] as Processor[],
  annotationVendors: [] as Processor[],
  /** Countries data is transferred to, with the measures required by APPI Art. 28. */
  overseasTransfer: null as string | null,
  /** Only fill once actually implemented (e.g. encryption at rest). */
  implementedSecurityMeasures: [] as string[],
  /** Face blurring / recognition policy. */
  faceHandling: null as string | null,
  pricing: null as string | null,
  paymentMethods: null as string | null,
  cancellationPolicy: null as string | null,
  serviceArea: "東京近郊（具体的な対応エリアは個別条件で示します）" as string | null,
  /** Insurance covering damage to household property. */
  insurance: null as string | null,
};

/** Items a human must confirm before public launch. Shown in README as well. */
export const prelaunchChecklist: string[] = [
  "全法務文書を弁護士等が確認し、status を reviewed、effectiveDate を設定する",
  "Webサイトのホスティング事業者と、Supabase・Resend のデータ所在国（リージョン）を確定して websiteOperations に記載する",
  "外国にある第三者への提供（個人情報保護法第28条）に必要な情報提供の内容を確定する",
  "ウェイトリスト情報・アクセスログの保存期間を決める",
  "サービスで使用するカメラ構成、音声の扱い、遠隔操作の体制を確定する",
  "映像・動作データ・遠隔操作データの保存期間、保存先、アノテーション委託先を確定する",
  "実装済みの安全管理措置（暗号化、アクセス制御など）を確認してから記載する",
  "料金、支払方法、キャンセル規定、東京近郊の具体的な対応エリア、保険の有無を決める",
  "特定商取引法に基づく表記の電話番号を記載し、LEGAL_NOTICE_PUBLISHED を有効にするか判断する",
  "予約受付を開始する場合のみ BOOKING_ENABLED を有効にし、招待コードを発行する",
  "Resend の送信ドメイン認証（SPF/DKIM）を完了する",
  "Supabase の RLS が有効で、anon / authenticated ロールから各テーブルにアクセスできないことを確認する",
];

export function isDraft(key: LegalDocKey): boolean {
  return legalDocuments[key].status === "draft";
}
