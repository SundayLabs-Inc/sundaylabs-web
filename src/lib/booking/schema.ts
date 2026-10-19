import { isPrefecture, type Prefecture } from "@/lib/prefectures";
import { cleanLine, cleanText, isValidEmail, normalizeEmail, pickList } from "@/lib/validation";
import { HOUSEHOLD_TASKS, type HouseholdTask } from "@/lib/waitlist/schema";

export const HOUSING_TYPES = [
  { value: "detached", label: "戸建て" },
  { value: "apartment", label: "集合住宅（マンション・アパート）" },
  { value: "other", label: "その他" },
] as const;
export type HousingType = (typeof HOUSING_TYPES)[number]["value"];

const TASK_VALUES = HOUSEHOLD_TASKS.map((t) => t.value) as HouseholdTask[];
const HOUSING_VALUES = HOUSING_TYPES.map((t) => t.value) as HousingType[];

export function normalizeInviteCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.normalize("NFKC").toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z0-9]{8,32}$/.test(code) ? code : null;
}

export type BookingInput = {
  inviteCode: string;
  fullName: string;
  email: string;
  phone: string;
  postalCode: string;
  prefecture: Prefecture;
  address: string;
  housingType: HousingType;
  requestedTasks: HouseholdTask[];
  excludedAreas: string;
  preferredSlots: string[];
  notes: string;
  serviceTermsVersion: string;
  servicePrivacyVersion: string;
};

export type BookingField =
  | "inviteCode"
  | "fullName"
  | "email"
  | "phone"
  | "postalCode"
  | "prefecture"
  | "address"
  | "housingType"
  | "requestedTasks"
  | "excludedAreas"
  | "preferredSlots"
  | "notes"
  | "serviceTermsAgreed"
  | "recordingConsent";
export type BookingErrors = Partial<Record<BookingField, string>>;

/** `datetime-local` values are interpreted as Japan time. */
function toJstIso(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const date = new Date(`${value}:00+09:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function parseBooking(
  raw: Record<string, unknown>,
  now = new Date(),
): { ok: true; data: BookingInput } | { ok: false; errors: BookingErrors } {
  const errors: BookingErrors = {};

  const inviteCode = normalizeInviteCode(raw.inviteCode);
  if (!inviteCode) errors.inviteCode = "招待コードを正しく入力してください。";

  const fullName = cleanLine(raw.fullName, 100);
  if (!fullName) errors.fullName = "氏名を入力してください。";

  const email = normalizeEmail(raw.email);
  if (!isValidEmail(email)) errors.email = "メールアドレスを正しく入力してください。";

  const phone = typeof raw.phone === "string" ? raw.phone.normalize("NFKC").replace(/[\s()-]/g, "") : "";
  if (!/^0\d{9,10}$/.test(phone)) errors.phone = "電話番号を正しく入力してください。";

  const postalCode =
    typeof raw.postalCode === "string" ? raw.postalCode.normalize("NFKC").replace(/[\s-]/g, "") : "";
  if (!/^\d{7}$/.test(postalCode)) errors.postalCode = "郵便番号を7桁で入力してください。";

  const prefecture = typeof raw.prefecture === "string" ? raw.prefecture : "";
  if (!isPrefecture(prefecture)) errors.prefecture = "都道府県を選択してください。";

  const address = cleanLine(raw.address, 200);
  if (!address) errors.address = "住所を入力してください。";

  const housingType = typeof raw.housingType === "string" ? raw.housingType : "";
  if (!(HOUSING_VALUES as string[]).includes(housingType)) errors.housingType = "住宅の種類を選択してください。";

  const requestedTasks = pickList(raw.requestedTasks, TASK_VALUES);
  if (!requestedTasks || requestedTasks.length === 0) errors.requestedTasks = "希望する家事を選択してください。";

  const excludedAreas = cleanText(raw.excludedAreas, 1000);
  if (excludedAreas === null) errors.excludedAreas = "1000文字以内で入力してください。";

  const notes = cleanText(raw.notes, 2000);
  if (notes === null) errors.notes = "2000文字以内で入力してください。";

  const slotsRaw = Array.isArray(raw.preferredSlots) ? raw.preferredSlots.filter((s) => s !== "") : [];
  const preferredSlots = slotsRaw.slice(0, 3).map(toJstIso);
  if (
    preferredSlots.length === 0 ||
    preferredSlots.some((s) => s === null || new Date(s) <= now)
  ) {
    errors.preferredSlots = "訪問希望日時を、今日以降の日時で1つ以上入力してください。";
  }

  if (raw.serviceTermsAgreed !== true) errors.serviceTermsAgreed = "サービス利用規約への同意が必要です。";
  if (raw.recordingConsent !== true) {
    errors.recordingConsent = "サービスの実施には、撮影・AI学習への同意が必要です。";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      inviteCode: inviteCode as string,
      fullName: fullName as string,
      email,
      phone,
      postalCode,
      prefecture: prefecture as Prefecture,
      address: address as string,
      housingType: housingType as HousingType,
      requestedTasks: requestedTasks as HouseholdTask[],
      excludedAreas: excludedAreas as string,
      preferredSlots: preferredSlots as string[],
      notes: notes as string,
      serviceTermsVersion: String(raw.serviceTermsVersion ?? ""),
      servicePrivacyVersion: String(raw.servicePrivacyVersion ?? ""),
    },
  };
}
