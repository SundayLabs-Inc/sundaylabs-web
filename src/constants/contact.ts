export const contactTypes = [
  { value: "owner", ja: "不動産オーナー", en: "Property owner" },
  { value: "management", ja: "管理会社", en: "Property management company" },
  { value: "manufacturer", ja: "メーカー", en: "Manufacturer" },
  { value: "resident", ja: "入居者", en: "Resident" },
  { value: "other", ja: "その他", en: "Other" },
] as const;

export const contactCategories = [
  { value: "installation", ja: "導入・共同実証のご相談", en: "Installation and joint pilot" },
  { value: "residence", ja: "お住まいのマンションへの導入のご相談（建物名はメッセージにご記入ください）", en: "Installation at your building (include the building name in your message)" },
  { value: "general", ja: "サービスについてのお問い合わせ", en: "Questions about the service" },
  { value: "other", ja: "その他", en: "Other" },
] as const;
