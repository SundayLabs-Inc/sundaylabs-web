import { isPrefecture, type Prefecture } from "@/lib/prefectures";
import { cleanLine, isValidEmail, normalizeEmail } from "@/lib/validation";

export const HOUSEHOLD_TASKS = [
  { value: "cleaning", label: "掃除" },
  { value: "tidying", label: "片付け" },
  { value: "dishes", label: "洗い物" },
  { value: "other", label: "その他" },
] as const;

export type HouseholdTask = (typeof HOUSEHOLD_TASKS)[number]["value"];

export type WaitlistInput = {
  email: string;
  prefecture: Prefecture;
  city: string;
  marketingOptIn: boolean;
  privacyAcknowledged: true;
  privacyPolicyVersion: string;
};

export type WaitlistField = "email" | "prefecture" | "city" | "privacyAcknowledged";
export type WaitlistErrors = Partial<Record<WaitlistField, string>>;

export const WAITLIST_MESSAGES = {
  emailRequired: "メールアドレスを入力してください。",
  emailInvalid: "メールアドレスの形式が正しくありません。",
  prefecture: "都道府県を選択してください。",
  cityRequired: "市区町村を入力してください。",
  cityInvalid: "市区町村は50文字以内で入力してください。",
  privacy: "Webプライバシーポリシーをご確認のうえ、チェックを入れてください。",
} as const;

export function parseWaitlist(
  raw: Record<string, unknown>,
): { ok: true; data: WaitlistInput } | { ok: false; errors: WaitlistErrors } {
  const errors: WaitlistErrors = {};

  const email = normalizeEmail(raw.email);
  if (!email) errors.email = WAITLIST_MESSAGES.emailRequired;
  else if (!isValidEmail(email)) errors.email = WAITLIST_MESSAGES.emailInvalid;

  const prefecture = typeof raw.prefecture === "string" ? raw.prefecture : "";
  if (!isPrefecture(prefecture)) errors.prefecture = WAITLIST_MESSAGES.prefecture;

  const city = cleanLine(raw.city, 50);
  if (city === null) errors.city = WAITLIST_MESSAGES.cityInvalid;
  else if (!city) errors.city = WAITLIST_MESSAGES.cityRequired;

  if (raw.privacyAcknowledged !== true) errors.privacyAcknowledged = WAITLIST_MESSAGES.privacy;

  const privacyPolicyVersion =
    typeof raw.privacyPolicyVersion === "string" ? raw.privacyPolicyVersion.slice(0, 64) : "";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      email,
      prefecture: prefecture as Prefecture,
      city: city as string,
      marketingOptIn: raw.marketingOptIn === true,
      privacyAcknowledged: true,
      privacyPolicyVersion,
    },
  };
}
