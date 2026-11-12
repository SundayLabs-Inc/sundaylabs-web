# SundayLabs Webサイト

SundayLabs株式会社のコーポレートサイトおよび「ほのベル」のサービス紹介サイトです。

- Next.js 16（App Router）/ TypeScript / Tailwind CSS v4
- Resend（お問い合わせメール送信）/ Vercel 想定

## ページ

| URL | 内容 | 公開状態 |
| --- | --- | --- |
| `/` | トップページ | 公開 |
| `/service` | ほのベル サービス紹介 | 公開 |
| `/company` | 会社概要 | 公開 |
| `/contact` | お問い合わせ | 公開 |
| `/privacy` | プライバシーポリシー | 公開 |
| `/terms` | サイト利用規約 | 公開 |
| `/legal` | 特定商取引法に基づく表記 | `LEGAL_NOTICE_PUBLISHED=true` のときのみ |

## ローカル開発

```bash
npm install
cp .env.example .env.local   # 値を設定
npm run dev
```

## 環境変数

`.env.example` を参照してください。

| 変数 | 必須 | 用途 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ○ | canonical・sitemap・OGP の URL |
| `RESEND_API_KEY` | ○ | お問い合わせメール |
| `RESEND_FROM` | ○ | 認証済みドメインの送信元 |
| `CONTACT_TO` | | お問い合わせの宛先 |
| `LEGAL_NOTICE_PUBLISHED` | | `true` で `/legal` を公開しフッターに表示 |

## コンテンツの変更場所

- トップページ・サービスページの文言・FAQ：`src/content/home.ts`
- 法務文書：`src/content/legal/*.ts`
- 文書の版・状態・施行日、運用条件：`src/config/legal.ts`
