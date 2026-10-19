/**
 * Copy for the top page. Media `src: null` renders a replaceable placeholder.
 */

export type Media = { src: string | null; alt: string };

export const brand = {
  name: "あしたのロボティクス",
  legalName: "あしたのロボティクス株式会社",
  legalNameEn: "Ashitano Robotics, Inc.",
  copyright: "© 2026 Ashitano Robotics, Inc.",
  logo: { src: "/images/logo.png", width: 2034, height: 176 },
};

export const seo = {
  title: "あしたのロボティクス | フィジカルAIで、あしたをもっと豊かに。",
  description:
    "あしたのロボティクスは、研究開発基盤構築、企業向けのフィジカルAI研修、共同研究開発を通じて、フィジカルAIを社会に実装します。",
};

export const nav = [
  { label: "事業内容", href: "/#service" },
  { label: "ご支援の流れ", href: "/#flow" },
  { label: "会社概要", href: "/company" },
  { label: "FAQ", href: "/#faq" },
];

export const contactCta = { label: "お問い合わせ", href: "/contact" };

export const hero = {
  title: "フィジカルAIを、現場で働く力へ",
  media: {
    alt: "工場の作業台で部品を扱うヒューマノイドロボット",
    landscape: { src: "/images/hero-factory.jpg", width: 1280, height: 720 },
    portrait: { src: "/images/hero-factory-mobile.jpg", width: 720, height: 1280 },
  },
};

export const service = {
  body: "ロボットを実機で確かめ、使いこなす人を育てる。フィジカルAIの導入を検討する企業の取り組みを支援します。",
  items: [
    {
      title: "フィジカルAI研修",
      body: "導入を担当する方、現場でロボットを扱う方、開発に携わるエンジニアに向けて、ロボットの基礎、安全な扱い方、データ収集と学習の進め方を実機で学ぶ研修を行います。",
      media: { src: "/images/business/training.jpg", alt: "ロボットアームを囲んで学ぶ研修の様子" } as Media,
    },
    {
      title: "研究開発基盤構築",
      body: "御社のスペースに、ロボット・センサー、GPU・計算環境、データ収集・学習環境、評価・検証環境を備えたロボットラボを整えます。",
      media: { src: "/images/rd-infrastructure.jpg", alt: "ロボットアームと開発用の機材が並ぶラボ" } as Media,
    },
    {
      title: "共同研究開発",
      body: "VLA・模倣学習、ロボット制御などのフィジカルAI技術を共同で研究開発し、PoC開発と実機検証を進めます。",
      media: { src: "/images/business/research.jpg", alt: "遠隔操作でロボットに動作を教える研究の様子" } as Media,
    },
  ],
};

export const steps = {
  title: "ご支援の流れ",
  items: [
    {
      step: "STEP 01",
      title: "ヒアリング",
      body: "目的と課題、現在の体制や環境を伺います。",
    },
    {
      step: "STEP 02",
      title: "ご提案",
      body: "目的に合わせて、内容、範囲、期間、体制をご提案します。",
    },
    {
      step: "STEP 03",
      title: "実施",
      body: "合意した計画に沿って、研修、環境の構築、研究開発を進めます。",
    },
    {
      step: "STEP 04",
      title: "成果のご報告",
      body: "成果と残った課題をまとめ、次の進め方をご提案します。",
    },
  ],
};

export const technology = {
  title: "フィジカルAIで、あしたをもっと豊かに。",
  body: "人手不足や高齢化をはじめ、社会を取り巻く課題は、これからさらに複雑になっていきます。私たちは、フィジカルAIを、人とともに働き、暮らしを支え、新しい価値を生み出す存在へと変えていきます。フィジカルAIを社会に実装することで、人がより創造的な仕事に向き合える、あしたの社会を構築します。",
  media: { src: "/images/tech-concept.jpg", alt: "夕暮れの街並み" } as Media,
};

export const industries = {
  title: "産業領域",
  body: "フィジカル AIは、変化する現場環境で、状況を理解し、自ら判断して動きます。状況に応じて判断・行動し、柔軟性が必要な業務に対応します。",
  items: ["製造", "物流", "倉庫", "建設", "インフラ", "一次産業"],
};

export const faq = {
  title: "FAQ",
  items: [
    {
      q: "どのような支援をしていますか？",
      a: "研究開発基盤構築、フィジカルAI研修、共同研究開発を行っています。組み合わせても、一つから始めても進められます。",
    },
    {
      q: "研修は誰を対象にしていますか？",
      a: "ロボットの導入を担当する方、現場でロボットを扱う方、開発に携わるエンジニアを対象にしています。内容と期間は、受講する方の経験と目的に合わせて組み立てます。",
    },
    {
      q: "研究開発基盤構築では、何を作りますか？",
      a: "御社のスペースで、ロボットラボ、ロボット・センサー、GPU・計算環境、データ収集・学習環境、評価・検証環境を整えます。研究開発を続けるための環境を残します。",
    },
    {
      q: "共同研究開発では、何を進めますか？",
      a: "Physical AI技術の研究開発、VLA・模倣学習、ロボット制御、PoC開発、実機検証を、実機で進めます。",
    },
    {
      q: "ロボットの販売はしていますか？",
      a: "ロボットの小売販売は行っていません。機体の選定は、検証や研修の支援の一部として行います。",
    },
    {
      q: "費用はどのように決まりますか？",
      a: "受ける支援と範囲に合わせて提案します。定価は公開していません。",
    },
  ],
};

export const closing = {
  title: "お問い合わせ",
  body: "製造、物流、建設、インフラ、一次産業など、産業現場における機体の検証、PoC、研修のご相談を受け付けています。対象業務と目的に合わせてご提案します。",
};
