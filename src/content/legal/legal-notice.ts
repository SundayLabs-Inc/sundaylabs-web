import { operator } from "@/config/legal";
import { orPending, type LegalDocument } from "@/content/legal/types";

const UNSET = "未定（公開前に記載）";

export const legalNotice: LegalDocument = {
  key: "legalNotice",
  intro: ["特定商取引に関する法律第11条に基づき、次のとおり表示します。"],
  sections: [
    {
      heading: "表示事項",
      blocks: [
        {
          table: {
            head: ["項目", "内容"],
            rows: [
              ["事業者の名称", operator.name],
              ["代表者", operator.representative],
              ["所在地", `${operator.postalCode} ${operator.address}`],
              ["電話番号", orPending(operator.phone, UNSET)],
              ["メールアドレス", operator.email],
              ["販売価格（役務の対価）", UNSET],
              ["役務の対価以外に必要な料金", "インターネット接続に必要な通信料はお客様のご負担となります。"],
              ["支払方法", UNSET],
              ["支払時期", UNSET],
              ["役務の提供時期", UNSET],
              ["申込みの撤回・解除", UNSET],
            ],
          },
        },
      ],
    },
  ],
};
