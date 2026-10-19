"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/site/ButtonLink";
import { Checkbox, Field, FieldError, inputClass, Select } from "@/components/site/form";
import { PREFECTURES } from "@/lib/prefectures";
import { parseWaitlist, type WaitlistErrors } from "@/lib/waitlist/schema";

const SERVER_ERRORS: Record<string, string> = {
  unavailable: "現在、登録を受け付けることができません。時間をおいて再度お試しください。",
  rate_limited: "短時間に多くの送信がありました。しばらく時間をおいて再度お試しください。",
  policy_outdated:
    "Webプライバシーポリシーが更新されています。ページを再読み込みし、内容をご確認ください。",
};
const NEAR_TOKYO: readonly string[] = ["東京都", "神奈川県", "埼玉県", "千葉県"];

const GENERIC_ERROR = "登録できませんでした。時間をおいて再度お試しください。";

const FIELD_ORDER = ["email", "prefecture", "city", "privacyAcknowledged"] as const;
const FIELD_IDS: Record<(typeof FIELD_ORDER)[number], string> = {
  email: "wl-email",
  prefecture: "wl-prefecture",
  city: "wl-city",
  privacyAcknowledged: "wl-privacy",
};

export default function WaitlistForm({
  privacyPolicyVersion,
  privacyPath,
}: {
  privacyPolicyVersion: string;
  privacyPath: string;
}) {
  const [email, setEmail] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const focusFirstError = (errs: WaitlistErrors) => {
    const first = FIELD_ORDER.find((key) => errs[key]);
    if (first) document.getElementById(FIELD_IDS[first])?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setFormError("");

    const payload = {
      email,
      prefecture,
      city,
      marketingOptIn,
      privacyAcknowledged,
      privacyPolicyVersion,
      website,
    };
    const local = parseWaitlist(payload);
    if (!local.ok) {
      setErrors(local.errors);
      focusFirstError(local.errors);
      return;
    }
    setErrors({});
    setPending(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: WaitlistErrors;
      };
      if (res.ok && json.ok) {
        setDone(true);
        return;
      }
      if (json.fields) {
        setErrors(json.fields);
        focusFirstError(json.fields);
      }
      setFormError(SERVER_ERRORS[json.error ?? ""] ?? GENERIC_ERROR);
    } catch {
      setFormError(GENERIC_ERROR);
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="border-t border-ink pt-8">
        <h2 ref={doneRef} tabIndex={-1} className="text-2xl font-bold leading-snug outline-none lg:text-3xl">
          ご登録ありがとうございます。
        </h2>
        <p className="mt-4 text-[15px] leading-[1.9] text-ink-muted">
          ウェイトリストへの登録が完了しました。サービスのご案内が可能になりましたら、メールでお知らせします。
        </p>
        <Link href="/" className="mt-8 inline-flex border-b border-ink pb-1 text-[15px] font-medium">
          トップページへ戻る
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-7" aria-describedby="wl-form-error">
      <Field id="wl-email" label="メールアドレス" required error={errors.email}>
        <input
          id="wl-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "wl-email-error" : undefined}
          className={inputClass}
          placeholder="you@example.com"
        />
      </Field>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
        <Field id="wl-prefecture" label="都道府県" required error={errors.prefecture}>
          <Select
            id="wl-prefecture"
            name="prefecture"
            autoComplete="address-level1"
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            aria-invalid={!!errors.prefecture || undefined}
            aria-describedby={errors.prefecture ? "wl-prefecture-error" : undefined}
          >
            <option value="">選択してください</option>
            <optgroup label="東京近郊">
              {NEAR_TOKYO.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </optgroup>
            <optgroup label="その他の地域">
              {PREFECTURES.filter((p) => !NEAR_TOKYO.includes(p)).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </optgroup>
          </Select>
        </Field>
        <Field id="wl-city" label="市区町村" required error={errors.city}>
          <input
            id="wl-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            maxLength={50}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-invalid={!!errors.city || undefined}
            aria-describedby={errors.city ? "wl-city-error" : undefined}
            className={inputClass}
            placeholder="渋谷区"
          />
        </Field>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="wl-website">Website</label>
        <input
          id="wl-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="space-y-4 rounded-2xl bg-paper p-5 text-sm leading-[1.8] text-ink-muted">
        <p>
          ご登録いただいた情報は、サービスのご案内とそのためのご連絡、対応地域の検討に利用します。開発ニュースの配信は、希望された場合に限り行います。家庭内の撮影やAI学習への同意は、この登録ではいただきません。
        </p>
        <p>
          詳しくは
          <Link
            href={privacyPath}
            target="_blank"
            rel="noopener"
            className="mx-1 text-ink underline underline-offset-4"
          >
            Webプライバシーポリシー
          </Link>
          をご確認ください。
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Checkbox
            id="wl-privacy"
            name="privacyAcknowledged"
            checked={privacyAcknowledged}
            onChange={setPrivacyAcknowledged}
            invalid={!!errors.privacyAcknowledged}
            describedBy={errors.privacyAcknowledged ? "wl-privacy-error" : undefined}
          >
            Webプライバシーポリシーを確認しました（必須）
          </Checkbox>
          <FieldError id="wl-privacy-error" message={errors.privacyAcknowledged} />
        </div>
        <Checkbox
          id="wl-marketing"
          name="marketingOptIn"
          checked={marketingOptIn}
          onChange={setMarketingOptIn}
        >
          開発ニュースのメール配信を希望する（任意）
        </Checkbox>
      </div>

      <div id="wl-form-error" aria-live="assertive">
        {formError && (
          <p className="rounded-xl border border-[#c62828] px-4 py-3 text-sm text-[#c62828]">{formError}</p>
        )}
      </div>

      <button type="submit" disabled={pending} className={`${buttonClass()} w-full`}>
        {pending ? "送信しています…" : "ウェイトリストに登録する"}
      </button>
    </form>
  );
}
