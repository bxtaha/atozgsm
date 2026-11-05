import { tones, TONE_SANDHI_NOTE } from "@/lib/chinese/tones";

const W = 120;
const H = 80;

/** Draws a tone's pitch contour. y is inverted because SVG grows downward. */
const toPath = (path: [number, number][]) =>
  path.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x * (W - 16) + 8} ${(1 - y) * (H - 16) + 8}`).join(" ");

export const ToneChart = () => (
  <section>
    <h2 className="mb-2 font-display text-2xl font-bold text-secondary dark:text-foreground">The five tones</h2>
    <p className="mb-6 max-w-2xl leading-relaxed text-muted-foreground">
      Mandarin uses pitch to distinguish words. The same syllable <span lang="zh">ma</span> is five
      different words depending on the tone — so a tone is part of the spelling, not an accent laid
      on top of it.
    </p>

    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tones.map((tone) => (
        <li key={tone.number} className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 className="font-bold text-foreground">
              {tone.number === 5 ? "Neutral" : `Tone ${tone.number}`} · {tone.name}
            </h3>
            <span lang="zh" className="text-sm text-muted-foreground">{tone.nameZh}</span>
          </div>

          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mb-3 w-full rounded-xl bg-accent"
            role="img"
            aria-label={`Pitch contour for tone ${tone.number}: ${tone.description}`}
          >
            <line x1="8" y1={H / 2} x2={W - 8} y2={H / 2} stroke="currentColor" strokeWidth="1" className="text-border" strokeDasharray="3 3" />
            <path
              d={toPath(tone.path)}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            />
          </svg>

          <p className="mb-3 flex items-baseline gap-2">
            <span lang="zh" className="font-display text-3xl font-bold text-foreground">{tone.example.hanzi}</span>
            <span className="font-bold text-primary-text">{tone.example.pinyin}</span>
            <span className="text-sm text-muted-foreground">{tone.example.meaning}</span>
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">{tone.description}</p>
        </li>
      ))}
    </ul>

    <p className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4 text-sm leading-relaxed text-foreground">
      <strong className="font-bold">Tone sandhi. </strong>
      {TONE_SANDHI_NOTE}
    </p>
  </section>
);
