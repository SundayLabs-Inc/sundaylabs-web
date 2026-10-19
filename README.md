# あしたのロボティクス Webサイト

家庭用ロボットによる家事代行サービスのウェイトリスト登録を受け付けるサイトです。ウェイトリスト登録（Supabase 保存・Resend で登録完了メール）、Webサイト用とサービス用に分けたプライバシーポリシー、利用規約、招待制予約ページ（初期状態では無効）を含みます。

- Next.js 16（App Router）/ TypeScript / Tailwind CSS v4
- Supabase（PostgreSQL・RLS）/ Resend / Vercel 想定

## ページ

| URL | 内容 | 公開状態 |
| --- | --- | --- |
| `/` | トップページ | 公開 |
| `/waitlist` | ウェイトリスト登録 | 公開 |
| `/privacy` | Webプライバシーポリシー | 公開（草案の間は noindex） |
| `/service-privacy` | サービスプライバシーポリシー | 公開（草案の間は noindex） |
| `/service-terms` | サービス利用規約 | 公開（草案の間は noindex） |
| `/terms` | Webサイト利用規約 | 公開（草案の間は noindex） |
| `/book` | 招待者専用予約 | `BOOKING_ENABLED=true` のときのみ。常に noindex |
| `/legal` | 特定商取引法に基づく表記 | `LEGAL_NOTICE_PUBLISHED=true` のときのみ |
| `/company` `/contact` | 会社概要・お問い合わせ（既存） | 公開 |

`/en` 以下は以前の英語サイト（産業向け）のままです。

## ローカル開発

```bash
npm install
cp .env.example .env.local   # 値を設定
npm run dev
```

Supabase が未設定の場合、ウェイトリストは登録を受け付けず「現在、登録を受け付けることができません」と表示します（登録できたように見せません）。

## 環境変数

`.env.example` を参照してください。

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ○ | canonical・sitemap・OGP の URL |
| `SUPABASE_URL` | ○ | Supabase プロジェクト URL（サーバー専用） |
| `SUPABASE_SERVICE_ROLE_KEY` | ○ | サーバー専用キー。`NEXT_PUBLIC_` を付けない |
| `RATE_LIMIT_SECRET` | ○ | IP をハッシュ化する鍵（`openssl rand -hex 32`） |
| `RESEND_API_KEY` | ○ | 登録完了メール・お問い合わせメール |
| `RESEND_FROM` | ○ | 認証済みドメインの送信元 |
| `CONTACT_TO` | | お問い合わせの宛先 |
| `BOOKING_NOTIFY_TO` | | 予約申込み通知の宛先（予約IDのみ送信） |
| `BOOKING_ENABLED` | | `true` で `/book` を開く |
| `LEGAL_NOTICE_PUBLISHED` | | `true` で `/legal` を公開しフッターに表示 |

## 外部サービスの設定手順

### Supabase

1. プロジェクトを作成（リージョンは東京 `ap-northeast-1` を推奨。選んだリージョンは `src/config/legal.ts` の `websiteOperations.processors` に記載）。
2. SQL Editor で `supabase/migrations/20261014000000_waitlist_and_booking.sql` を実行（または `supabase db push`）。
3. Project Settings → API の URL と `service_role` キーを `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` に設定。
4. Table Editor で各テーブルの RLS が有効になっていることを確認。ポリシーは作らないでください（作ると anon キーで読めるようになります）。

すべてのテーブルは RLS 有効・ポリシーなし・anon / authenticated から権限剥奪済みです。読み書きはサーバーの service_role のみです。

### Resend

1. ドメイン（例：`ashitanorobotics.co.jp`）を追加し、SPF / DKIM の DNS レコードを設定して認証。
2. API キーを `RESEND_API_KEY`、送信元を `RESEND_FROM` に設定。

### Vercel

1. リポジトリをインポートし、上記の環境変数を Production / Preview に設定。
2. 環境変数を変えたら再デプロイしてください。

## ウェイトリストの仕組み

- メールアドレスは NFKC 正規化・小文字化して一意制約で重複を防ぎます。
- 同じアドレスで再登録されても既存レコードは更新せず、応答も同じです（他人の登録の上書き・存在確認を防止）。
- 登録が保存できた場合のみ完了扱いにし、その後に登録完了メールを送信します。送信結果は `confirmation_email_status`（`sent` / `failed` / `not_configured`）に記録します。
- 送信できなかった登録は `waitlist_email_failures` ビューで確認できます。
- スパム対策：同一オリジン確認、ハニーポット、IP（鍵付きハッシュ）ごとに10分5回、メールアドレスごとに1日3回のレート制限、8KB の本文上限。
- ログには登録IDとエラーコードのみ出力し、メールアドレス等は出力しません。
- ポリシーの版（`legalDocuments.privacy.version`）を確認日時とあわせて保存します。版を上げると古い画面からの送信は再読み込みを求めます。
- 家庭内の撮影・AI学習への同意は、この段階では取得しません。

## 招待制予約（/book）

1. `BOOKING_ENABLED=true` にして再デプロイ。
2. 招待コードを発行：`node scripts/create-invite.mjs 30 <waitlist_entries.id>` で表示されるコードを本人に送り、SQL を Supabase で実行（DB にはハッシュのみ保存）。
3. 招待コードの確認 → 入力 → 申込み。予約・同意記録（サービス利用規約／撮影・AI学習を別々に、文書のパスと版・日時つき）は1トランザクションで保存され、招待コードは1回で使用済みになります。
4. 決済は未実装です。

## コンテンツの変更場所

- トップページ文言・FAQ：`src/content/home.ts`
- 画像：`src/content/home.ts` の `media.src`（実機の写真のみ設定。未設定の間はプレースホルダー）
- 法務文書：`src/content/legal/*.ts`
- 文書の版・状態・施行日、未確定の運用条件：`src/config/legal.ts`

`src/config/legal.ts` で `null` のままの項目は、文書上「確定していません／確定後に記載します」と表示されます。実際に決まり、実装・運用されてから値を入れてください。

## 公開前に人間が確認すること

`src/config/legal.ts` の `prelaunchChecklist` と同じ内容です。

- 全法務文書を弁護士等が確認し、`status` を `reviewed`、`effectiveDate` を設定する（法務文書はすべて AI が作成した草案です）
- ホスティング事業者、Supabase・Resend のデータ所在国を確定し記載する
- 外国にある第三者への提供（個人情報保護法第28条）に必要な情報提供の内容を確定する
- ウェイトリスト情報・アクセスログの保存期間を決める
- カメラ構成、音声の扱い、遠隔操作の体制を確定する
- 映像・動作・遠隔操作データの保存期間、保存先、アノテーション委託先を確定する
- 実装済みの安全管理措置だけを記載する
- 料金、支払方法、キャンセル規定、対応地域、保険を決める
- 特商法表記の電話番号を記載し、`/legal` を公開するか判断する（有償提供・オンライン申込みの場合は最終確認画面の表示義務も確認）
- Resend の送信ドメイン認証
- Supabase の RLS と権限の確認
- ロボットの実機写真を用意する（AI生成画像や他社製品の画像を使わない）
