import { levels, type CatalogProgram, type CatalogRecord } from "@/lib/universities/catalog-schema";
import { formatCny } from "@/lib/universities/format";

function Fields({ items }: { items: [string, string | null][] }) {
  return (
    <dl className="mt-1 space-y-1">
      {items.map(([label, value]) => value && (
        <div key={label}>
          <dt className="inline font-semibold">{label} </dt>
          <dd className="inline">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function UniversityDetails({ programs, awards, showSources = false }: {
  programs: CatalogProgram[];
  awards: CatalogRecord["scholarships"];
  showSources?: boolean;
}) {
  return (
    <div className="space-y-4 text-sm print:text-[10pt]">
      {programs.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold">Programmes and tuition</h3>
          {programs.map((program) => (
            <article key={program.id} className="print:break-inside-avoid">
              <h4 className="font-semibold">{program.name}</h4>
              <Fields items={[
                ["Level", levels[program.level]],
                ["Subjects", program.subjects.join(", ")],
                ["Language", program.language],
                ["Duration", program.duration],
                ["Intake", [program.intakeMonth === 3 ? "March" : program.intakeMonth === 9 ? "September" : null, program.intakeYear].filter(Boolean).join(" ")],
                ["Tuition", program.tuitionCny === null ? null : `${formatCny(program.tuitionCny)} / ${program.tuitionPeriod}`],
                ["Other fees", program.fees],
                ["Deadline", program.applicationDeadline],
                ["Requirements", program.requirements],
              ]} />
              {showSources && <a href={program.source.url} className="text-primary-text underline">{program.source.title}</a>}
            </article>
          ))}
        </section>
      )}
      {awards.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold">Scholarships</h3>
          {awards.map((award) => (
            <article key={award.id} className="print:break-inside-avoid">
              <h4 className="font-semibold">{award.name}</h4>
              <p>{[award.type, award.cycleYear, ...award.levels.map((level) => levels[level])].filter(Boolean).join(" · ")}</p>
              <Fields items={[
                ["Coverage", award.coverage],
                ["Eligibility", award.eligibility],
                ["Deadline", award.deadline],
                ["Application", award.application],
                ["Renewal", award.renewal],
              ]} />
              {showSources && <a href={award.source.url} className="text-primary-text underline">{award.source.title}</a>}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
