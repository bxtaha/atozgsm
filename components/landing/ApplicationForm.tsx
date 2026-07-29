"use client";

import { useState, useCallback } from "react";

interface FormData {
  // Step 1
  fullName: string;
  phone: string;
  email: string;
  city: string;
  programLevel: string;
  intake: string;
  privacyConsent: boolean;
  marketingOptIn: boolean;
  // Step 2
  dob: string;
  lastPassingYear: string;
  lastEducationLevel: string;
  lastEducationInstitution: string;
  gpa: string;
  educationExperience: string;
  otherExperiences: string;
  preferredMajor: string;
  budgetRange: string;
  // Honeypot
  website: string;
}

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  programLevel: "",
  intake: "",
  privacyConsent: false,
  marketingOptIn: false,
  dob: "",
  lastPassingYear: "",
  lastEducationLevel: "",
  lastEducationInstitution: "",
  gpa: "",
  educationExperience: "",
  otherExperiences: "",
  preferredMajor: "",
  budgetRange: "",
  website: "",
};

const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Comilla", "Gazipur", "Mymensingh", "Other"];
const PROGRAM_LEVELS = [
  { value: "foundation", label: "Foundation" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD" },
  { value: "language", label: "Language Program" },
  { value: "other", label: "Other" },
];
const INTAKES = [
  { value: "spring", label: "Spring 2026" },
  { value: "fall", label: "Fall 2026" },
  { value: "not_sure", label: "Not sure yet" },
];
const EDUCATION_LEVELS = [
  { value: "ssc", label: "SSC" },
  { value: "hsc", label: "HSC" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's" },
  { value: "master", label: "Master's" },
  { value: "other", label: "Other" },
];
const MAJORS = ["MBBS / Medicine", "Engineering", "Business / MBA", "Computer Science / IT", "Language (Chinese)", "Other"];
const BUDGETS = ["Below $3,000/yr", "$3,000–$6,000/yr", "$6,000–$10,000/yr", "Above $10,000/yr", "Not sure"];

function computeAge(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const ApplicationForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) errs.fullName = "Full name is required (min 2 characters)";
    if (formData.fullName.length > 80) errs.fullName = "Name must be under 80 characters";
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone number required (min 10 digits)";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address";
    if (!formData.programLevel) errs.programLevel = "Please select a program level";
    if (!formData.privacyConsent) errs.privacyConsent = "You must agree to the privacy policy";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (formData.dob) {
      const age = computeAge(formData.dob);
      if (age !== null && (age < 14 || age > 60)) errs.dob = "Age must be between 14 and 60";
    }
    if (!formData.lastPassingYear) errs.lastPassingYear = "Please select your last passing year";
    if (!formData.lastEducationLevel) errs.lastEducationLevel = "Please select your education level";
    if (!formData.educationExperience.trim() || formData.educationExperience.trim().length < 20)
      errs.educationExperience = "Please describe your education (min 20 characters)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website) return; // honeypot
    if (step === 1) { handleNext(); return; }
    if (!validateStep2()) return;
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      onSuccess?.();
    }, 1500);
  };

  const age = computeAge(formData.dob);
  const currentYear = new Date().getFullYear();
  const passingYears = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${step >= 1 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          <span className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-[10px]">1</span>
          Contact
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${step >= 2 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? "bg-primary/30" : "bg-muted"}`}>2</span>
          Education
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <FieldGroup label="Full Name" error={errors.fullName} required>
            <input type="text" autoComplete="name" placeholder="Enter your full name" value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)} className="console-input" />
          </FieldGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Phone (WhatsApp)" error={errors.phone} required>
              <input type="tel" inputMode="tel" autoComplete="tel" placeholder="+880 1XXXXXXXXX" value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)} className="console-input console-input-pink" />
            </FieldGroup>

            <FieldGroup label="Email" error={errors.email}>
              <input type="email" autoComplete="email" placeholder="you@email.com" value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)} className="console-input" />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Current City">
              <select value={formData.city} onChange={(e) => handleChange("city", e.target.value)} className="console-input appearance-none cursor-pointer">
                <option value="">Select city...</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldGroup>

            <FieldGroup label="Intended Program Level" error={errors.programLevel} required>
              <select value={formData.programLevel} onChange={(e) => handleChange("programLevel", e.target.value)} className="console-input appearance-none cursor-pointer">
                <option value="">Select level...</option>
                {PROGRAM_LEVELS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </FieldGroup>
          </div>

          <FieldGroup label="Intended Intake">
            <select value={formData.intake} onChange={(e) => handleChange("intake", e.target.value)} className="console-input appearance-none cursor-pointer">
              <option value="">Select intake...</option>
              {INTAKES.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          </FieldGroup>

          {/* Consent */}
          <div className="space-y-3 pt-2">
            <label className={`flex items-start gap-3 cursor-pointer group ${errors.privacyConsent ? "text-destructive" : ""}`}>
              <input type="checkbox" checked={formData.privacyConsent} onChange={(e) => handleChange("privacyConsent", e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border accent-primary" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the <a href="/privacy" className="text-primary underline">Privacy Notice</a> and consent to be contacted about admissions. <span className="text-destructive">*</span>
              </span>
            </label>
            {errors.privacyConsent && <p className="text-xs text-destructive ml-7">{errors.privacyConsent}</p>}

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.marketingOptIn} onChange={(e) => handleChange("marketingOptIn", e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border accent-primary" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I'd like to receive scholarship alerts and updates (optional).
              </span>
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Date of Birth" error={errors.dob}>
              <input type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)}
                className="console-input [color-scheme:light]" />
              {age !== null && <p className="text-xs text-muted-foreground mt-1">Age: {age} years</p>}
            </FieldGroup>

            <FieldGroup label="Last Passing Year" error={errors.lastPassingYear} required>
              <select value={formData.lastPassingYear} onChange={(e) => handleChange("lastPassingYear", e.target.value)} className="console-input appearance-none cursor-pointer">
                <option value="">Select year...</option>
                {passingYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="Last Education Level" error={errors.lastEducationLevel} required>
              <select value={formData.lastEducationLevel} onChange={(e) => handleChange("lastEducationLevel", e.target.value)} className="console-input appearance-none cursor-pointer">
                <option value="">Select level...</option>
                {EDUCATION_LEVELS.map((e) => <option key={e.value} value={e.value}>{e.label}</option>)}
              </select>
            </FieldGroup>

            <FieldGroup label="Institution (Optional)">
              <input type="text" placeholder="University / College name" value={formData.lastEducationInstitution}
                onChange={(e) => handleChange("lastEducationInstitution", e.target.value)} className="console-input" />
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldGroup label="GPA / Result (Optional)">
              <input type="text" placeholder="e.g. 4.50 / A+" value={formData.gpa}
                onChange={(e) => handleChange("gpa", e.target.value)} className="console-input" />
            </FieldGroup>

            <FieldGroup label="Preferred Major (Optional)">
              <select value={formData.preferredMajor} onChange={(e) => handleChange("preferredMajor", e.target.value)} className="console-input appearance-none cursor-pointer">
                <option value="">Select major...</option>
                {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </FieldGroup>
          </div>

          <FieldGroup label="Education Experience" error={errors.educationExperience} required>
            <textarea placeholder="What did you study? Any notable achievements?" value={formData.educationExperience}
              onChange={(e) => handleChange("educationExperience", e.target.value)}
              className="console-input min-h-[80px] resize-y" rows={3} />
          </FieldGroup>

          <FieldGroup label="Other Experiences">
            <textarea placeholder="Internships, work experience, language skills..." value={formData.otherExperiences}
              onChange={(e) => handleChange("otherExperiences", e.target.value)}
              className="console-input min-h-[60px] resize-y" rows={2} />
          </FieldGroup>

          <FieldGroup label="Budget Range (Optional)">
            <select value={formData.budgetRange} onChange={(e) => handleChange("budgetRange", e.target.value)} className="console-input appearance-none cursor-pointer">
              <option value="">Select range...</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </FieldGroup>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {step === 2 && (
          <button type="button" onClick={() => setStep(1)}
            className="px-6 py-4 rounded-full border border-border text-muted-foreground font-bold text-sm tracking-wider uppercase hover:bg-accent transition-colors">
            ← Back
          </button>
        )}
        <button type="submit" disabled={submitting}
          className="flex-1 relative group overflow-hidden rounded-full p-[2px] active:scale-[0.98] transition-transform">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" />
          <div className="relative bg-console-surface px-8 py-4 rounded-full flex items-center justify-center gap-3">
            <span className="font-bold tracking-wide uppercase text-base">
              {submitting ? "Submitting..." : step === 1 ? "Next → Education Details" : "Submit Application"}
            </span>
            {!submitting && (
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse [animation-delay:300ms]" />
              </span>
            )}
          </div>
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">
        {step === 1 ? "Step 2 is optional — you can always provide details later." : "By submitting, you agree to our admissions privacy policy."}
      </p>
    </form>
  );
};

const FieldGroup = ({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5 group">
    <label className="console-label group-focus-within:text-primary">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
  </div>
);

export default ApplicationForm;