import type { ComponentProps, ReactNode } from "react";

export const inputClass =
  "block w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-[#999] transition-colors focus:border-ink focus:outline-none aria-[invalid=true]:border-[#c62828]";

export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-10 ${className}`} />
      <svg
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium">
        {label}
        <span className="text-xs font-normal text-ink-muted">{required ? "必須" : "任意"}</span>
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-2 text-xs leading-relaxed text-ink-muted">
          {hint}
        </p>
      )}
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-2 text-sm text-[#c62828]">
      {message}
    </p>
  ) : null;
}

export function Checkbox({
  id,
  name,
  checked,
  onChange,
  invalid,
  describedBy,
  children,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  invalid?: boolean;
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ink"
      />
      <span>{children}</span>
    </label>
  );
}
