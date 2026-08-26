"use client";

import { useState } from "react";
import { finalCta } from "@/content/site";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  if (!form.email.trim()) errors.email = "An email address is required.";
  else if (!EMAIL_RE.test(form.email.trim()))
    errors.email = "That email address doesn't look right.";
  return errors;
}

const inputClass =
  "h-12 w-full rounded-lg border border-border-strong bg-bg/40 px-4 text-[0.9375rem] text-text-hi placeholder:text-text-mid transition-colors duration-200 focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure/50";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono text-text-low">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error ? (
        <span role="alert" className="metadata-mono mt-1.5 block text-[#f2784b]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function SuccessCheck() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden
      className="mx-auto h-16 w-16"
      fill="none"
    >
      <circle cx="32" cy="32" r="30" stroke="var(--azure)" strokeWidth="1.5" />
      <path
        d="M20 33 L28.5 41.5 L44 25"
        stroke="var(--azure)"
        strokeWidth="2.5"
        strokeLinecap="square"
        pathLength={1}
        className="cta-check-path"
      />
    </svg>
  );
}

export function FinalCta() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    interest: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: event.target.value }));

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStatus("submitting");
    // Backend stub — a real endpoint replaces this once available.
    window.setTimeout(() => setStatus("success"), 600);
  };

  const mailtoHref = `mailto:hello@qubnexa.com?subject=${encodeURIComponent(
    `Intro call${form.company ? ` — ${form.company}` : ""} — QubNexa`
  )}`;

  return (
    <section id="cta" aria-labelledby="cta-title" className="chapter">
      <p className="sr-only">{finalCta.summary}</p>
      <div className="container-x w-full">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p id="cta-title" className="label-mono text-text-mid">
              <span className="text-azure">{finalCta.index}</span>
              <span className="mx-3 text-text-low" aria-hidden>/</span>
              {finalCta.eyebrow}
            </p>
            <p className="text-display-xl mt-6 text-text-hi">
              {finalCta.tagline.map((line, i) => (
                <span key={line} className={cn("block", i === 2 && "text-azure")}>
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-6 max-w-[48ch] leading-[1.65] text-text-mid">
              {finalCta.supporting}
            </p>
            <ol className="mt-10 max-w-md space-y-3">
              {finalCta.expectations.map((item, i) => (
                <li key={item.step} className="flex items-baseline gap-4 border-t border-border py-3">
                  <span className="metadata-mono text-text-low">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] font-medium text-text-hi">
                    {item.step}
                    <span className="ml-3 font-normal text-text-mid">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="liquid-glass p-6 sm:p-8 md:p-10">
            {status === "success" ? (
              <div className="flex min-h-[24rem] flex-col items-center justify-center gap-6 text-center" role="status">
                <SuccessCheck />
                <h2 className="text-heading text-text-hi">{finalCta.form.successTitle}</h2>
                <p className="max-w-[40ch] text-sm leading-[1.65] text-text-mid">
                  {finalCta.form.successBody}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-heading text-text-hi">{finalCta.form.heading}</h2>
                <form onSubmit={onSubmit} noValidate className="mt-8 grid gap-5">
                  <Field label="Name *" error={errors.name}>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      aria-invalid={Boolean(errors.name)}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </Field>
                  <Field label="Email *" error={errors.email}>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                      aria-invalid={Boolean(errors.email)}
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={set("company")}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </Field>
                  <Field label="Interest" error={errors.interest}>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={set("interest")}
                      className={cn(inputClass, !form.interest && "text-text-low")}
                    >
                      <option value="">Select an area</option>
                      {finalCta.form.interests.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <label className="block">
                    <span className="label-mono text-text-low">Message</span>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      className="mt-2 w-full rounded-lg border border-border-strong bg-bg/40 px-4 py-3 text-[0.9375rem] leading-[1.6] text-text-hi placeholder:text-text-mid transition-colors duration-200 focus:border-azure focus:outline-none focus:ring-1 focus:ring-azure/50"
                      placeholder="Where is the friction?"
                    />
                  </label>
                  <div className="mt-2 flex flex-wrap items-center gap-6">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex h-12 items-center justify-center rounded-[2px] bg-cta px-8 label-mono text-cta-contrast transition-[background-color,transform] duration-200 ease-out hover:bg-cta-hover active:scale-[0.98] disabled:opacity-60"
                    >
                      {status === "submitting" ? "Sending…" : finalCta.form.submitLabel}
                    </button>
                    <a
                      href={mailtoHref}
                      className="metadata-mono text-text-low transition-colors duration-200 hover:text-text-mid"
                    >
                      {finalCta.form.mailtoLabel}
                    </a>
                  </div>
                  {status === "error" ? (
                    <p role="alert" className="metadata-mono text-[#f2784b]">
                      Something went wrong — please try again or email us directly.
                    </p>
                  ) : null}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
