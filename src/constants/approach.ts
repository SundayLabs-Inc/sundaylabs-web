import type { Locale } from "@/constants/site";

export const approachCopy = {
  ja: {
    title: "進め方",
    cards: [
      { title: "対象を決める", body: "ユースケースと対象工程を特定し、ROIと、技術・機体の候補を置く。" },
      { title: "計画を置く", body: "開発の順番、組織の立ち上げ方、ラボと計算環境の置き方を同時に決める。" },
      { title: "実機で進める", body: "研究開発とPoC、実機検証を進め、データ収集と評価を回す。" },
      { title: "現場に残す", body: "技術移管と育成を行い、運用と検証の形を残す。" },
    ],
  },
  en: {
    title: "Approach",
    cards: [
      { title: "Define the target", body: "Identify the use case and the process, and set the ROI and the shortlist of technology and hardware." },
      { title: "Set the plan", body: "Decide the build order, how the team starts, and how the lab and compute are set up, at the same time." },
      { title: "Build on the robot", body: "Run the research, the PoC, and on-robot validation, and keep data collection and evaluation moving." },
      { title: "Leave it on site", body: "Transfer the technology, train the team, and leave operations and evaluation in place." },
    ],
  },
} as const;

export function getApproach(locale: Locale) {
  return approachCopy[locale];
}
