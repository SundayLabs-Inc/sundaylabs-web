"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/site/ButtonLink";
import { Checkbox, Field, FieldError, inputClass, Select } from "@/components/site/form";
import { HOUSING_TYPES, normalizeInviteCode, parseBooking, type BookingErrors } from "@/lib/booking/schema";
import { PREFECTURES } from "@/lib/prefectures";
import { HOUSEHOLD_TASKS, type HouseholdTask } from "@/lib/waitlist/schema";

type Docs = {
  serviceTerms: { path: string; title: string; version: string };
  servicePrivacy: { path: string; title: string; version: string };
};

const SERVER_ERRORS: Record<string, string> = {
  invalid_invitation: "招待コードが無効か、有効期限が切れています。",
  rate_limited: "短時間に多くの送信がありました。しばらく時間をおいて再度お試しください。",
  unavailable: "現在、予約を受け付けることができません。時間をおいて再度お試しください。",
  policy_outdated: "規約が更新されています。ページを再読み込みし、内容をご確認ください。",
};
const GENERIC_ERROR = "送信できませんでした。時間をおいて再度お試しください。";

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    fields?: BookingErrors;
  };
  return { ok: res.ok && json.ok === true, ...json };
}

export default function BookingFlow({ docs }: { docs: Docs }) {
  const [step, setStep] = useState<"code" | "form" | "done">("code");
  const [inviteCode, setInviteCode] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    address: "",
    housingType: "",
    excludedAreas: "",
    notes: "",
  });
  const [tasks, setTasks] = useState<HouseholdTask[]>([]);
  const [slots, setSlots] = useState(["", "", ""]);
  const [serviceTermsAgreed, setServiceTermsAgreed] = useState(false);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step !== "code") headingRef.current?.focus();
  }, [step]);

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!normalizeInviteCode(inviteCode)) {
      setErrors({ inviteCode: "招待コードを正しく入力してください。" });
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await post("/api/book/verify", { inviteCode });
      if (res.ok) setStep("form");
      else setFormError(SERVER_ERRORS[res.error ?? ""] ?? GENERIC_ERROR);
    } catch {
      setFormError(GENERIC_ERROR);
    } finally {
      setPending(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const payload = {
      inviteCode,
      ...form,
      requestedTasks: tasks,
      preferredSlots: slots,
      serviceTermsAgreed,
      recordingConsent,
      serviceTermsVersion: docs.serviceTerms.version,
      servicePrivacyVersion: docs.servicePrivacy.version,
    };
    const local = parseBooking(payload);
    if (!local.ok) {
      setErrors(local.errors);
      setFormError("入力内容をご確認ください。");
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const res = await post("/api/book", payload);
      if (res.ok) {
        setStep("done");
        return;
      }
      if (res.fields) setErrors(res.fields);
      setFormError(SERVER_ERRORS[res.error ?? ""] ?? GENERIC_ERROR);
    } catch {
      setFormError(GENERIC_ERROR);
    } finally {
      setPending(false);
    }
  };

  const errorBox = (
    <div aria-live="assertive">
      {formError && (
        <p className="rounded-xl border border-[#c62828] px-4 py-3 text-sm text-[#c62828]">{formError}</p>
      )}
    </div>
  );

  if (step === "done") {
    return (
      <div role="status" className="border-t border-ink pt-8">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold outline-none">
          お申込みを受け付けました。
        </h2>
        <p className="mt-4 text-[15px] leading-[1.9] text-ink-muted">
          内容を確認のうえ、ご登録のメールアドレスにご連絡します。この時点では予約は確定していません。
        </p>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form noValidate onSubmit={verify} className="space-y-7">
        <Field id="bk-code" label="招待コード" required error={errors.inviteCode}>
          <input
            id="bk-code"
            name="inviteCode"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={40}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            aria-invalid={!!errors.inviteCode || undefined}
            aria-describedby={errors.inviteCode ? "bk-code-error" : undefined}
            className={`${inputClass} font-mono tracking-[0.08em]`}
          />
        </Field>
        {errorBox}
        <button type="submit" disabled={pending} className={`${buttonClass()} w-full`}>
          {pending ? "確認しています…" : "招待コードを確認する"}
        </button>
      </form>
    );
  }

  const text = (key: keyof typeof form, label: string, opts: Partial<{ type: string; autoComplete: string; inputMode: "tel" | "numeric" | "email"; maxLength: number; required: boolean }> = {}) => (
    <Field id={`bk-${key}`} label={label} required={opts.required ?? true} error={errors[key as keyof BookingErrors]}>
      <input
        id={`bk-${key}`}
        name={key}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        inputMode={opts.inputMode}
        maxLength={opts.maxLength}
        value={form[key]}
        onChange={(e) => set(key)(e.target.value)}
        aria-invalid={!!errors[key as keyof BookingErrors] || undefined}
        aria-describedby={errors[key as keyof BookingErrors] ? `bk-${key}-error` : undefined}
        className={inputClass}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={submit} className="space-y-7">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold outline-none">
        予約内容の入力
      </h2>
      {text("fullName", "氏名", { autoComplete: "name", maxLength: 100 })}
      {text("email", "メールアドレス", { type: "email", autoComplete: "email", inputMode: "email", maxLength: 254 })}
      {text("phone", "電話番号", { type: "tel", autoComplete: "tel", inputMode: "tel", maxLength: 15 })}
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-4">
        {text("postalCode", "郵便番号", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 8 })}
        <Field id="bk-prefecture" label="都道府県" required error={errors.prefecture}>
          <Select
            id="bk-prefecture"
            name="prefecture"
            autoComplete="address-level1"
            value={form.prefecture}
            onChange={(e) => set("prefecture")(e.target.value)}
            aria-invalid={!!errors.prefecture || undefined}
          >
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      {text("address", "住所（市区町村以降）", { autoComplete: "street-address", maxLength: 200 })}

      <fieldset>
        <legend className="mb-3 text-sm font-medium">住宅の種類</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {HOUSING_TYPES.map((h) => (
            <label key={h.value} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="housingType"
                value={h.value}
                checked={form.housingType === h.value}
                onChange={() => set("housingType")(h.value)}
                className="h-5 w-5 accent-ink"
              />
              {h.label}
            </label>
          ))}
        </div>
        <FieldError id="bk-housing-error" message={errors.housingType} />
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">希望する家事</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {HOUSEHOLD_TASKS.map((t) => (
            <Checkbox
              key={t.value}
              id={`bk-task-${t.value}`}
              name="requestedTasks"
              checked={tasks.includes(t.value)}
              onChange={(c) => setTasks((p) => (c ? [...p, t.value] : p.filter((x) => x !== t.value)))}
            >
              {t.label}
            </Checkbox>
          ))}
        </div>
        <FieldError id="bk-tasks-error" message={errors.requestedTasks} />
      </fieldset>

      <Field id="bk-excludedAreas" label="対応してほしくないエリア" error={errors.excludedAreas}>
        <textarea
          id="bk-excludedAreas"
          name="excludedAreas"
          rows={3}
          maxLength={1000}
          value={form.excludedAreas}
          onChange={(e) => set("excludedAreas")(e.target.value)}
          className={inputClass}
        />
      </Field>

      <fieldset>
        <legend className="mb-3 text-sm font-medium">訪問希望日時（日本時間・最大3つ）</legend>
        <div className="grid gap-3">
          {slots.map((slot, i) => (
            <input
              key={i}
              type="datetime-local"
              aria-label={`訪問希望日時 第${i + 1}希望`}
              value={slot}
              onChange={(e) => setSlots((s) => s.map((v, j) => (j === i ? e.target.value : v)))}
              className={inputClass}
            />
          ))}
        </div>
        <FieldError id="bk-slots-error" message={errors.preferredSlots} />
      </fieldset>

      <Field id="bk-notes" label="特記事項" error={errors.notes}>
        <textarea
          id="bk-notes"
          name="notes"
          rows={4}
          maxLength={2000}
          value={form.notes}
          onChange={(e) => set("notes")(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="space-y-5 rounded-2xl bg-paper p-5">
        <div>
          <Checkbox
            id="bk-terms"
            name="serviceTermsAgreed"
            checked={serviceTermsAgreed}
            onChange={setServiceTermsAgreed}
            invalid={!!errors.serviceTermsAgreed}
          >
            <Link href={docs.serviceTerms.path} target="_blank" rel="noopener" className="underline underline-offset-4">
              {docs.serviceTerms.title}
            </Link>
            に同意します（必須）
          </Checkbox>
          <FieldError id="bk-terms-error" message={errors.serviceTermsAgreed} />
        </div>
        <div>
          <Checkbox
            id="bk-recording"
            name="recordingConsent"
            checked={recordingConsent}
            onChange={setRecordingConsent}
            invalid={!!errors.recordingConsent}
          >
            <Link href={docs.servicePrivacy.path} target="_blank" rel="noopener" className="underline underline-offset-4">
              {docs.servicePrivacy.title}
            </Link>
            に記載された家庭内の撮影と、取得データのAI学習への利用に同意します（必須）
          </Checkbox>
          <FieldError id="bk-recording-error" message={errors.recordingConsent} />
        </div>
      </div>

      {errorBox}
      <button type="submit" disabled={pending} className={`${buttonClass()} w-full`}>
        {pending ? "送信しています…" : "予約を申し込む"}
      </button>
    </form>
  );
}
