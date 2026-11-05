/**
 * Vocabulary for the CSCA Chinese papers.
 *
 * Deliberately weighted towards academic register rather than tourist phrases:
 * the 理科中文 and 文科中文 papers test whether a student can follow a
 * first-year university lecture, so the subject-specific terms matter more
 * than everyday conversation.
 */

export type VocabCategory = "core" | "science" | "arts" | "academic";

export interface VocabEntry {
  hanzi: string;
  pinyin: string;
  meaning: string;
  category: VocabCategory;
  /** HSK band where the word is commonly placed, when it maps to one. */
  hsk?: 1 | 2 | 3 | 4;
  example?: { hanzi: string; pinyin: string; english: string };
  /** Memory aid — how the characters build the meaning. */
  note?: string;
}

export const CATEGORY_LABELS: Record<VocabCategory, string> = {
  core: "Everyday core",
  science: "Science track (理科)",
  arts: "Arts track (文科)",
  academic: "Academic register",
};

export const vocabulary: VocabEntry[] = [
  // --- Everyday core ---
  { hanzi: "我", pinyin: "wǒ", meaning: "I, me", category: "core", hsk: 1 },
  { hanzi: "你", pinyin: "nǐ", meaning: "you", category: "core", hsk: 1 },
  { hanzi: "好", pinyin: "hǎo", meaning: "good, well", category: "core", hsk: 1 },
  { hanzi: "是", pinyin: "shì", meaning: "to be", category: "core", hsk: 1 },
  { hanzi: "不", pinyin: "bù", meaning: "not, no", category: "core", hsk: 1 },
  {
    hanzi: "学生",
    pinyin: "xuéshēng",
    meaning: "student",
    category: "core",
    hsk: 1,
    note: "学 (to study) + 生 (person, life) — one who studies.",
  },
  {
    hanzi: "老师",
    pinyin: "lǎoshī",
    meaning: "teacher",
    category: "core",
    hsk: 1,
    example: { hanzi: "他是我的老师。", pinyin: "Tā shì wǒ de lǎoshī.", english: "He is my teacher." },
  },
  { hanzi: "学习", pinyin: "xuéxí", meaning: "to study, to learn", category: "core", hsk: 1 },
  { hanzi: "学校", pinyin: "xuéxiào", meaning: "school", category: "core", hsk: 1 },
  { hanzi: "中国", pinyin: "Zhōngguó", meaning: "China", category: "core", hsk: 1, note: "中 (middle) + 国 (country)." },
  { hanzi: "考试", pinyin: "kǎoshì", meaning: "exam; to take an exam", category: "core", hsk: 2 },
  { hanzi: "问题", pinyin: "wèntí", meaning: "question, problem", category: "core", hsk: 2 },
  { hanzi: "开始", pinyin: "kāishǐ", meaning: "to begin, to start", category: "core", hsk: 2 },
  {
    hanzi: "因为",
    pinyin: "yīnwèi",
    meaning: "because",
    category: "core",
    hsk: 2,
    note: "Pairs with 所以 (suǒyǐ, 'therefore'). Chinese normally states both halves.",
  },
  { hanzi: "所以", pinyin: "suǒyǐ", meaning: "therefore, so", category: "core", hsk: 2 },
  {
    hanzi: "虽然",
    pinyin: "suīrán",
    meaning: "although",
    category: "core",
    hsk: 3,
    note: "Pairs with 但是 (dànshì, 'but'). Spotting one half tells you the other is coming.",
  },
  { hanzi: "但是", pinyin: "dànshì", meaning: "but, however", category: "core", hsk: 2 },

  // --- Science track ---
  { hanzi: "数学", pinyin: "shùxué", meaning: "mathematics", category: "science", note: "数 (number) + 学 (study of)." },
  { hanzi: "物理", pinyin: "wùlǐ", meaning: "physics", category: "science", note: "物 (matter) + 理 (principle)." },
  { hanzi: "化学", pinyin: "huàxué", meaning: "chemistry", category: "science", note: "化 (to change) + 学 (study of)." },
  {
    hanzi: "实验",
    pinyin: "shíyàn",
    meaning: "experiment",
    category: "science",
    example: { hanzi: "我们做了一个实验。", pinyin: "Wǒmen zuò le yí ge shíyàn.", english: "We did an experiment." },
  },
  { hanzi: "公式", pinyin: "gōngshì", meaning: "formula", category: "science" },
  { hanzi: "方程", pinyin: "fāngchéng", meaning: "equation", category: "science" },
  { hanzi: "函数", pinyin: "hánshù", meaning: "function (maths)", category: "science" },
  { hanzi: "计算", pinyin: "jìsuàn", meaning: "to calculate", category: "science" },
  { hanzi: "速度", pinyin: "sùdù", meaning: "speed, velocity", category: "science" },
  { hanzi: "质量", pinyin: "zhìliàng", meaning: "mass; quality", category: "science", note: "Means both 'mass' and 'quality' — context decides." },
  { hanzi: "能量", pinyin: "néngliàng", meaning: "energy", category: "science" },
  { hanzi: "温度", pinyin: "wēndù", meaning: "temperature", category: "science" },
  { hanzi: "压力", pinyin: "yālì", meaning: "pressure", category: "science" },
  { hanzi: "元素", pinyin: "yuánsù", meaning: "element (chemistry)", category: "science" },
  { hanzi: "分子", pinyin: "fēnzǐ", meaning: "molecule", category: "science" },
  { hanzi: "原子", pinyin: "yuánzǐ", meaning: "atom", category: "science" },
  { hanzi: "溶液", pinyin: "róngyè", meaning: "solution (liquid)", category: "science" },
  { hanzi: "定律", pinyin: "dìnglǜ", meaning: "law (scientific)", category: "science", note: "牛顿定律 = Newton's laws." },
  { hanzi: "沸腾", pinyin: "fèiténg", meaning: "to boil", category: "science" },
  { hanzi: "蒸发", pinyin: "zhēngfā", meaning: "to evaporate", category: "science" },

  // --- Arts track ---
  { hanzi: "文学", pinyin: "wénxué", meaning: "literature", category: "arts" },
  { hanzi: "哲学", pinyin: "zhéxué", meaning: "philosophy", category: "arts" },
  { hanzi: "历史", pinyin: "lìshǐ", meaning: "history", category: "arts" },
  { hanzi: "法学", pinyin: "fǎxué", meaning: "law (as a discipline)", category: "arts" },
  { hanzi: "教育", pinyin: "jiàoyù", meaning: "education", category: "arts" },
  { hanzi: "社会", pinyin: "shèhuì", meaning: "society", category: "arts" },
  { hanzi: "文化", pinyin: "wénhuà", meaning: "culture", category: "arts" },
  { hanzi: "艺术", pinyin: "yìshù", meaning: "art", category: "arts" },
  { hanzi: "思想", pinyin: "sīxiǎng", meaning: "thought, ideology", category: "arts" },
  { hanzi: "政治", pinyin: "zhèngzhì", meaning: "politics", category: "arts" },

  // --- Academic register (both tracks) ---
  {
    hanzi: "观点",
    pinyin: "guāndiǎn",
    meaning: "viewpoint, argument",
    category: "academic",
    note: "观 (to view) + 点 (point). Not 观众 (audience) — same first character, different word.",
  },
  { hanzi: "理论", pinyin: "lǐlùn", meaning: "theory", category: "academic" },
  { hanzi: "研究", pinyin: "yánjiū", meaning: "research; to research", category: "academic" },
  { hanzi: "分析", pinyin: "fēnxī", meaning: "analysis; to analyse", category: "academic" },
  { hanzi: "影响", pinyin: "yǐngxiǎng", meaning: "influence; to affect", category: "academic" },
  { hanzi: "发展", pinyin: "fāzhǎn", meaning: "development; to develop", category: "academic" },
  { hanzi: "结果", pinyin: "jiéguǒ", meaning: "result, outcome", category: "academic" },
  { hanzi: "数据", pinyin: "shùjù", meaning: "data", category: "academic" },
  { hanzi: "方法", pinyin: "fāngfǎ", meaning: "method", category: "academic" },
  { hanzi: "概念", pinyin: "gàiniàn", meaning: "concept", category: "academic" },
];

export const byCategory = (category: VocabCategory) => vocabulary.filter((v) => v.category === category);

/** Tone number of the first syllable, derived from its tone mark. */
export function firstToneOf(pinyin: string): 1 | 2 | 3 | 4 | 5 {
  const marks: Record<string, 1 | 2 | 3 | 4> = {};
  for (const [i, set] of [["āēīōūǖ", 1], ["áéíóúǘ", 2], ["ǎěǐǒǔǚ", 3], ["àèìòùǜ", 4]] as const) {
    for (const ch of i) marks[ch] = set as 1 | 2 | 3 | 4;
  }
  for (const ch of pinyin) {
    if (marks[ch]) return marks[ch];
  }
  return 5;
}
