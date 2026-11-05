"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { Check, ChevronDown, CircleAlert, Clock, FileUp, Trash2, Upload } from "lucide-react";
import type { Requirement } from "@/lib/requirements";
import { SOURCE_LABELS } from "@/lib/requirements";
import type { DocumentStatus, StoredDocument } from "@/lib/profile";
import { deleteDocument, uploadDocument, type UploadState } from "@/app/dashboard/documents/actions";
import { trackEvent } from "@/lib/analytics/meta-pixel";

const STATUS: Record<DocumentStatus, { label: string; icon: typeof Check; className: string }> = {
  missing: { label: "Not uploaded", icon: CircleAlert, className: "text-muted-foreground bg-muted" },
  uploaded: { label: "Uploaded", icon: Check, className: "text-primary-text bg-primary/10" },
  "under-review": { label: "Under review", icon: Clock, className: "text-primary-text bg-primary/10" },
  approved: { label: "Approved", icon: Check, className: "text-green-700 bg-green-100" },
  "needs-correction": { label: "Needs correction", icon: CircleAlert, className: "text-destructive bg-destructive/10" },
};

const UploadButton = ({ hasFile }: { hasFile: boolean }) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-105 disabled:opacity-60"
    >
      <Upload className="h-3.5 w-3.5" />
      {pending ? "Uploading…" : hasFile ? "Replace" : "Upload"}
    </button>
  );
};

export const DocumentRow = ({
  requirement,
  document: doc,
}: {
  requirement: Requirement;
  document?: StoredDocument;
}) => {
  const [state, formAction] = useFormState(uploadDocument, {} as UploadState);
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const status = doc?.status ?? "missing";
  const meta = STATUS[status];
  const StatusIcon = meta.icon;

  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-foreground">{requirement.label}</h3>
            {requirement.optional && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Optional
              </span>
            )}
            <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
              {SOURCE_LABELS[requirement.source]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{requirement.purpose}</p>
        </div>

        <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${meta.className}`}>
          <StatusIcon className="h-3 w-3" /> {meta.label}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-text"
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        What makes this acceptable?
      </button>

      {open && (
        <div className="mt-3 rounded-xl bg-accent p-4">
          <p className="text-sm leading-relaxed text-foreground">{requirement.guidance}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Accepted: {requirement.acceptedMimeTypes.map((m) => m.split("/")[1].toUpperCase()).join(", ")} · Max{" "}
            {requirement.maxSizeMb} MB
          </p>
        </div>
      )}

      {doc && (
        <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <FileUp className="h-3.5 w-3.5" />
          <span className="truncate">{doc.originalName}</span>
          <span>· {(doc.sizeBytes / 1024 / 1024).toFixed(1)} MB</span>
        </p>
      )}

      {doc?.reviewerNote && (
        <p className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{doc.reviewerNote}</p>
      )}

      <form
        action={(fd) => {
          formAction(fd);
          trackEvent("DocumentUploaded", { requirement: requirement.id });
        }}
        className="mt-4 flex flex-wrap items-center gap-3"
      >
        <input type="hidden" name="requirementId" value={requirement.id} />
        <label className="flex-1">
          <span className="sr-only">Choose a file for {requirement.label}</span>
          <input
            type="file"
            name="file"
            required
            accept={requirement.acceptedMimeTypes.join(",")}
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
            className="w-full cursor-pointer text-xs text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-secondary"
          />
        </label>
        <UploadButton hasFile={Boolean(doc)} />
      </form>

      {fileName && !state.success && !state.error && (
        <p className="mt-2 text-xs text-muted-foreground">Selected: {fileName}</p>
      )}

      {state.error && (
        <p role="alert" className="mt-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-3 rounded-xl bg-green-100 px-4 py-3 text-sm text-green-800">{state.success}</p>
      )}

      {doc && (
        <form action={deleteDocument} className="mt-3">
          <input type="hidden" name="requirementId" value={requirement.id} />
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" /> Remove
          </button>
        </form>
      )}
    </li>
  );
};
