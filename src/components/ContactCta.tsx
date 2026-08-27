"use client";

import { FormEvent, useState } from "react";
import CtaButton from "@/components/CtaButton";
import { getSite, type Locale } from "@/constants/site";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactCta({ locale }: { locale: Locale }) {
  const site = getSite(locale);
  const { form } = site.contact;
  const [status, setStatus] = useState<FormStatus>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending" || status === "success") return;

    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const payload = {
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      role: String(data.get("role") || ""),
      message: String(data.get("message") || ""),
      locale,
    };

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      formEl.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="mt-12 space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="label-1 mb-2 block text-muted">{form.email}</span>
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className="field-input"
        />
      </label>
      <label className="block">
        <span className="label-1 mb-2 block text-muted">{form.company}</span>
        <input
          required
          name="company"
          type="text"
          autoComplete="organization"
          className="field-input"
        />
      </label>
      <label className="block">
        <span className="label-1 mb-2 block text-muted">{form.role}</span>
        <input required name="role" type="text" className="field-input" />
      </label>
      <label className="block">
        <span className="label-1 mb-2 block text-muted">{form.message}</span>
        <textarea
          required
          name="message"
          rows={4}
          placeholder={form.messagePlaceholder}
          className="field-input resize-y"
        />
      </label>
      <div className="mt-2 flex flex-col items-center gap-3">
        <CtaButton
          type="submit"
          disabled={status === "sending" || status === "success"}
        >
          {status === "sending" ? form.sending : site.contact.submit}
        </CtaButton>
        {status === "success" ? (
          <p className="form-status form-status-success" role="status">
            {form.success}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="form-status form-status-error" role="alert">
            {form.error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
