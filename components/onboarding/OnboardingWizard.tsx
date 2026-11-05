"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { OnboardingState } from "@/app/onboarding/actions";

const LEVELS = [
  { value: "bachelor", label: "Bachelor's", hint: "After HSC or equivalent" },
  { value: "master", label: "Master's", hint: "After a bachelor's degree" },
  { value: "diploma", label: "Diploma", hint: "Shorter vocational programme" },
  { value: "language", label: "Language programme", hint: "Chinese language study" },
];

const LANGUAGES = [
  { value: "english", label: "English-taught", hint: "You'll need English proficiency evidence" },
  { value: "chinese", label: "Chinese-taught", hint: "You'll need an HSK result" },
  { value: "bilingual", label: "Not sure yet", hint: "We'll show you both document paths" },
];

const inputClass =
  "w-full rounded-2xl border border-transparent bg-accent px-5 py-4 text-sm outline-none transition-all focus:border-secondary";

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105 disabled:opacity-60"
    >
      {pending ? "Setting up…" : "Build my checklist"} <ArrowRight className="h-4 w-4" />
    </button>
  );
};

const Choice = ({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: string) => void;
}) => (
  <label
    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-5 transition-colors ${
      checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
    }`}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 h-4 w-4 accent-primary"
    />
    <span>
      <span className="block font-bold text-foreground">{label}</span>
      <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>
    </span>
  </label>
);

export const OnboardingWizard = ({
  action,
}: {
  action: (prev: OnboardingState, formData: FormData) => Promise<OnboardingState>;
}) => {
  const [state, formAction] = useFormState(action, {});
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState("");
  const [language, setLanguage] = useState("");

  const canAdvance = step === 1 ? Boolean(level) : Boolean(language);

  return (
    <form action={formAction} className="space-y-6">
      <div className="flex items-center gap-2" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1.5 flex-1 rounded-full ${step >= n ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Step {step} of 3</p>

      <div className={step === 1 ? "space-y-3" : "hidden"}>
        <h2 className="font-display text-2xl font-bold text-secondary">What do you want to study?</h2>
        <p className="pb-2 text-muted-foreground">This decides which documents you&apos;ll need.</p>
        {LEVELS.map((l) => (
          <Choice key={l.value} name="studyLevel" {...l} checked={level === l.value} onChange={setLevel} />
        ))}
      </div>

      <div className={step === 2 ? "space-y-3" : "hidden"}>
        <h2 className="font-display text-2xl font-bold text-secondary">Taught in which language?</h2>
        <p className="pb-2 text-muted-foreground">
          This changes whether you need English proficiency evidence or an HSK result.
        </p>
        {LANGUAGES.map((l) => (
          <Choice key={l.value} name="studyLanguage" {...l} checked={language === l.value} onChange={setLanguage} />
        ))}
      </div>

      <div className={step === 3 ? "space-y-5" : "hidden"}>
        <h2 className="font-display text-2xl font-bold text-secondary">A few details</h2>
        <p className="text-muted-foreground">All optional — you can fill these in later.</p>

        <div>
          <label htmlFor="subject" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Subject you&apos;re interested in
          </label>
          <input id="subject" name="subject" placeholder="e.g. Computer Science" className={inputClass} />
        </div>

        <div>
          <label htmlFor="intake" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Intake you&apos;re aiming for
          </label>
          <select id="intake" name="intake" className={`${inputClass} cursor-pointer appearance-none`}>
            <option value="">Not sure yet</option>
            <option value="march-2027">March 2027</option>
            <option value="september-2027">September 2027</option>
            <option value="later">Later than that</option>
          </select>
        </div>

        <div>
          <label htmlFor="currentQualification" className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Your highest completed qualification
          </label>
          <select id="currentQualification" name="currentQualification" className={`${inputClass} cursor-pointer appearance-none`}>
            <option value="">Select…</option>
            <option value="ssc">SSC</option>
            <option value="hsc">HSC</option>
            <option value="diploma">Diploma</option>
            <option value="bachelor">Bachelor&apos;s</option>
            <option value="master">Master&apos;s</option>
          </select>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-2 rounded-full border border-border px-6 py-4 text-sm font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105 disabled:opacity-40"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Submit />
        )}
      </div>
    </form>
  );
};
