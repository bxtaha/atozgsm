import { z } from "zod";

export const levels = {
  language: "Chinese language",
  bachelor: "Bachelor’s",
  master: "Master’s",
  phd: "PhD",
  other: "Other non-degree",
} as const;

const text = z.string().trim().min(1).max(4000);
const short = z.string().trim().min(1).max(240);
const year = z.number().int().min(2000).max(2100);
const amount = z.number().int().nonnegative().max(10000000);
const web = z.string().trim().url().max(800).refine((url) => /^https?:\/\//i.test(url), "Use an HTTP or HTTPS URL");
const list = z.array(short).max(160);
const level = z.enum(["language", "bachelor", "master", "phd", "other"]);
const source = z.object({ title: short, url: web });

const program = z.object({
  id: short,
  name: short,
  subjects: list,
  level,
  language: short.nullable(),
  intakeMonth: z.union([z.literal(3), z.literal(9)]).nullable(),
  intakeYear: year.nullable(),
  duration: short.nullable(),
  tuitionCny: amount.nullable(),
  tuitionPeriod: z.enum(["year", "semester", "program"]).nullable(),
  applicationDeadline: short.nullable(),
  requirements: text.nullable(),
  fees: text.nullable(),
  source,
}).refine((p) => (p.tuitionCny === null) === (p.tuitionPeriod === null), "Tuition amount and period must be entered together");

const scholarship = z.object({
  id: short,
  name: short,
  type: short,
  levels: z.array(level).max(5),
  cycleYear: year.nullable(),
  coverage: text.nullable(),
  eligibility: text.nullable(),
  deadline: short.nullable(),
  application: text.nullable(),
  renewal: text.nullable(),
  source,
});

export const catalogRecord = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  name: short,
  aliases: list,
  city: short,
  province: short,
  website: web,
  applicationUrl: web.nullable(),
  note: text.nullable(),
  programs: z.array(program).max(400),
  scholarships: z.array(scholarship).max(100),
}).superRefine((record, context) => {
  for (const key of ["programs", "scholarships"] as const) {
    const ids = record[key].map((item) => item.id);
    if (new Set(ids).size !== ids.length) {
      context.addIssue({ code: "custom", path: [key], message: "Each item must have a unique ID" });
    }
  }
});

export const catalogImport = z.array(catalogRecord).min(1).max(200).refine(
  (rows) => new Set(rows.map((row) => row.slug)).size === rows.length,
  "Each university slug must be unique within an import",
);

export type CatalogRecord = z.infer<typeof catalogRecord>;
export type CatalogProgram = z.infer<typeof program>;
