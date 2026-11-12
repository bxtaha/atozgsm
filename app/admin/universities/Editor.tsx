"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { CatalogRecord } from "@/lib/universities/catalog-schema";
import { importUniversities } from "./actions";

const control = "rounded-xl border border-border bg-background px-3 py-2 text-sm";

function SaveButton({ importing }: { importing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50">
      {pending ? "Saving…" : importing ? "Import JSON" : "Save university"}
    </button>
  );
}

export function Editor({ entry }: { entry?: { record: CatalogRecord; published: boolean } }) {
  const [state, action] = useFormState(importUniversities, {});
  return (
    <form action={action} className="grid gap-4">
      {entry ? (
        <label className="grid gap-1 text-sm font-semibold">
          University JSON
          <textarea name="catalog" defaultValue={JSON.stringify(entry.record, null, 2)} required rows={15} spellCheck={false} className={`${control} w-full font-mono font-normal`} />
        </label>
      ) : (
        <label className="grid gap-1 text-sm font-semibold">
          Catalog JSON file
          <input type="file" name="catalogFile" accept=".json,application/json" required className={control} />
        </label>
      )}
      <div className="flex flex-wrap items-end gap-4">
        <label className="grid gap-1 text-sm font-semibold">
          Visibility
          <select name="visibility" defaultValue={entry?.published ? "published" : "draft"} className={control}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <SaveButton importing={!entry} />
      </div>
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      {state.message && <p role="status" className="text-sm">{state.message}</p>}
    </form>
  );
}
