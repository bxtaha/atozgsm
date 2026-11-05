/**
 * The four Mandarin tones plus the neutral tone.
 *
 * The 妈麻马骂吗 set is the standard teaching example: one syllable, five
 * tones, five unrelated meanings. It is the clearest demonstration that a tone
 * is part of a word's identity, not an accent on top of it.
 */
export interface Tone {
  number: 1 | 2 | 3 | 4 | 5;
  name: string;
  nameZh: string;
  contour: string;
  description: string;
  example: { hanzi: string; pinyin: string; meaning: string };
  /** Normalised pitch path for the SVG contour, 0 (low) to 1 (high). */
  path: [number, number][];
}

export const tones: Tone[] = [
  {
    number: 1,
    name: "High level",
    nameZh: "阴平",
    contour: "ˉ",
    description: "Start high and hold it flat. Do not let the pitch drift down at the end.",
    example: { hanzi: "妈", pinyin: "mā", meaning: "mother" },
    path: [[0, 0.85], [1, 0.85]],
  },
  {
    number: 2,
    name: "Rising",
    nameZh: "阳平",
    contour: "ˊ",
    description: "Rise from mid to high — the pitch of an English question, 'again?'",
    example: { hanzi: "麻", pinyin: "má", meaning: "hemp; numb" },
    path: [[0, 0.4], [1, 0.9]],
  },
  {
    number: 3,
    name: "Dipping",
    nameZh: "上声",
    contour: "ˇ",
    description:
      "Fall then rise. In everyday speech, before another word it often stays low without the rise — a low tone is closer to native than an exaggerated dip.",
    example: { hanzi: "马", pinyin: "mǎ", meaning: "horse" },
    path: [[0, 0.5], [0.45, 0.12], [1, 0.7]],
  },
  {
    number: 4,
    name: "Falling",
    nameZh: "去声",
    contour: "ˋ",
    description: "Drop sharply from high to low, like a firm command: 'Stop!'",
    example: { hanzi: "骂", pinyin: "mà", meaning: "to scold" },
    path: [[0, 0.9], [1, 0.15]],
  },
  {
    number: 5,
    name: "Neutral",
    nameZh: "轻声",
    contour: "·",
    description:
      "Short, light and unstressed, with no tone of its own — its pitch depends on the syllable before it. Written without a tone mark.",
    example: { hanzi: "吗", pinyin: "ma", meaning: "question particle" },
    path: [[0.3, 0.5], [0.7, 0.45]],
  },
];

/** Third tone before another third tone is pronounced as a second tone. */
export const TONE_SANDHI_NOTE =
  "When two third tones meet, the first is pronounced as a second tone: 你好 is written nǐ hǎo but said ní hǎo. The spelling does not change — only the pronunciation.";
