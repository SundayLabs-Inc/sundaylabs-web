import type { Locale } from "@/constants/site";

const ja = {
  productName: "Physical AI",
  hero: {
    title: "Physical AIの現場実装に向けた、",
    sub: "研究開発・組織構築・開発基盤構築",
  },
  services: {
    title: "私たちは、フィジカルAIを、人とともに働き、暮らしを支え、新しい価値を生み出す存在へと変えていきます。フィジカルAIを社会に実装することで、人がより創造的な仕事に向き合える社会を構築します。",
  },
  domains: [
    {
      id: "infrastructure",
      name: "研究開発基盤構築",
      body: "御社のスペースでロボットラボを整え、ロボット・センサーを導入する。GPU・計算環境を整備し、データ収集・学習環境と、評価・検証環境を構築する。",
    },
    {
      id: "organization",
      name: "開発組織・内製化",
      body: "開発チームを立ち上げ、採用を支援する。技術を移管し、エンジニアを育成して、開発プロセスを構築する。",
    },
    {
      id: "research",
      name: "共同研究開発",
      body: "Physical AI技術を研究開発し、VLA・模倣学習とロボット制御を進める。PoCを開発し、実機で検証する。",
    },
  ],
  nav: {
    services: "事業内容",
  },
  seo: {
    title: "Physical AIの現場実装支援 | あしたのロボティクス株式会社",
    description:
      "Physical AIの現場実装に向けた、研究開発・組織構築・開発基盤構築。研究開発基盤構築、開発組織・内製化、共同研究開発を支援します。",
    keywords: [
      "フィジカルAI",
      "Physical AI",
      "あしたのロボティクス",
      "あしたのロボティクス株式会社",
      "Ashitano Robotics",
      "研究開発基盤構築",
      "開発組織・内製化",
      "共同研究開発",
      "内製化支援",
      "ロボットラボ構築",
      "VLA",
      "模倣学習",
      "ロボット制御",
      "実機検証",
      "技術移管",
      "PoC",
      "製造",
      "物流",
      "建設",
      "インフラ",
      "一次産業",
    ],
  },
} as const;

const en = {
  productName: "Physical AI",
  hero: {
    title: "Deploying Physical AI on site.",
    sub: "R&D, organization, and infrastructure.",
  },
  services: {
    title: "We are transforming Physical AI into a presence that works alongside people, supports daily life, and creates new value. By implementing Physical AI in society, we build a society where people can focus on more creative work.",
  },
  domains: [
    {
      id: "infrastructure",
      name: "R&D infrastructure",
      body: "We set up the robot lab in your space and bring in robots and sensors. We prepare the GPU and compute environment, and build the environments for data collection, training, evaluation, and validation.",
    },
    {
      id: "organization",
      name: "Development teams & in-house capability",
      body: "We launch the development team and support hiring. We transfer the technology, train engineers, and build the development process.",
    },
    {
      id: "research",
      name: "Joint R&D",
      body: "We research and develop Physical AI technology, and advance VLA, imitation learning, and robot control. We develop the PoC and validate it on the robot.",
    },
  ],
  nav: {
    services: "Services",
  },
  seo: {
    title: "Deploying Physical AI on Site | Ashitano Robotics",
    description:
      "R&D, organization, and infrastructure for deploying Physical AI on site. We support R&D infrastructure, development teams and in-house capability, and joint R&D.",
    keywords: [
      "physical AI",
      "Ashitano Robotics",
      "ASHITANO Robotics, Inc.",
      "R&D infrastructure",
      "development teams",
      "in-house capability",
      "joint R&D",
      "in-house development",
      "robot lab",
      "VLA",
      "imitation learning",
      "robot control",
      "on-robot validation",
      "technology transfer",
      "PoC",
      "manufacturing",
      "logistics",
      "construction",
      "infrastructure",
      "primary industry",
    ],
  },
} as const;

export const railDictionaries = { ja, en };
export type RailContent = (typeof railDictionaries)[Locale];

export function getRail(locale: Locale): RailContent {
  return railDictionaries[locale];
}
