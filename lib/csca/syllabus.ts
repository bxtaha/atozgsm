/**
 * CSCA syllabus structure, transcribed from the ATOZ GSM knowledge base.
 *
 * Weights come from that document's "supported by multiple sources" tier —
 * cross-checked across the official syllabus sheets and several exam
 * breakdowns. They describe the typical shape of a paper, not a guarantee
 * about any individual sitting, and the UI says so.
 */

export type SubjectId = "physics" | "mathematics" | "chemistry" | "chinese-science" | "chinese-arts";
export type Difficulty = "easy" | "medium" | "hard";

export interface Topic {
  id: string;
  name: string;
}

export interface Module {
  id: string;
  name: string;
  /** Share of that subject's paper, in percent. */
  weight: number;
  averageQuestions: string;
  topics: Topic[];
}

/** Paper format differs by subject — the Chinese papers are 90 minutes. */
export interface ExamFormat {
  durationMinutes: number;
  totalMarks: number;
  /** The science papers state a fixed count; the Chinese papers do not. */
  questionCount?: number;
  questionType: string;
  languages: string;
}

export interface Subject {
  id: SubjectId;
  name: string;
  /** Chinese name as it appears on the official syllabus. */
  nameZh?: string;
  requiredFor: string;
  format: ExamFormat;
  modules: Module[];
}

/**
 * Rules that hold across every paper. Anything that varies by subject lives on
 * that subject's `format` instead — notably the duration, which is 60 minutes
 * for the science papers but 90 for the two Chinese papers.
 */
export const EXAM_RULES = {
  totalMarks: 100,
  negativeMarking: false,
  calculatorAllowed: false,
  sittingsPerYear: 5,
  sittingMonths: "December, January, March, April, June",
  gravity: 10,
} as const;

/** Format shared by the three science papers (60 min, 48 MCQs, 100 marks). */
const SCIENCE_FORMAT: ExamFormat = {
  durationMinutes: 60,
  totalMarks: 100,
  questionCount: 48,
  questionType: "Single-choice MCQs",
  languages: "Chinese or English",
};

/** Format shared by the two Chinese-language papers. */
const CHINESE_FORMAT: ExamFormat = {
  durationMinutes: 90,
  totalMarks: 100,
  questionType: "Single-choice MCQs",
  languages: "Chinese",
};

export const DIFFICULTY_MIX = { easy: 14, medium: 24, hard: 10 } as const;

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    nameZh: "数学",
    requiredFor: "Mandatory for every academic track",
    format: SCIENCE_FORMAT,
    modules: [
      {
        id: "math-sets",
        name: "Sets & Inequalities",
        weight: 17,
        averageQuestions: "7–8",
        topics: [
          { id: "sets", name: "Sets & Operations" },
          { id: "inequality-properties", name: "Inequality Properties" },
          { id: "quadratic-inequalities", name: "Quadratic & Rational Inequalities" },
        ],
      },
      {
        id: "math-functions",
        name: "Functions & Elementary Functions",
        weight: 41,
        averageQuestions: "18–20",
        topics: [
          { id: "coordinates", name: "Rectangular Coordinate System" },
          { id: "domain-range", name: "Function Concept, Domain & Range" },
          { id: "function-properties", name: "Monotonicity & Parity" },
          { id: "exponential-log", name: "Exponential & Logarithmic Functions" },
          { id: "trigonometry", name: "Trigonometric Functions" },
          { id: "sequences", name: "Sequences" },
          { id: "calculus", name: "Differential Calculus Basics" },
        ],
      },
      {
        id: "math-geometry",
        name: "Geometry & Algebra",
        weight: 29,
        averageQuestions: "12–14",
        topics: [
          { id: "lines", name: "Lines in a Plane" },
          { id: "conics", name: "Conic Sections & Circles" },
          { id: "vectors", name: "Plane Vectors" },
          { id: "complex", name: "Complex Numbers" },
        ],
      },
      {
        id: "math-probability",
        name: "Probability & Statistics",
        weight: 11,
        averageQuestions: "4–5",
        topics: [
          { id: "classical-probability", name: "Classical Probability" },
          { id: "probability-rules", name: "Probability Rules" },
          { id: "statistics", name: "Statistics & Distributions" },
          { id: "counting", name: "Counting Principles" },
        ],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    nameZh: "物理",
    requiredFor: "Science, technology, engineering and management tracks",
    format: SCIENCE_FORMAT,
    modules: [
      {
        id: "phys-mechanics",
        name: "Mechanics",
        weight: 56,
        averageQuestions: "24–27",
        topics: [
          { id: "kinematics", name: "Kinematics & SUVAT" },
          { id: "free-fall", name: "Free Fall & Projectile Motion" },
          { id: "statics", name: "Forces & Vector Statics" },
          { id: "newtons-laws", name: "Newton's Laws of Motion" },
          { id: "momentum", name: "Momentum & Impulse" },
          { id: "energy", name: "Mechanical Energy & Power" },
          { id: "circular-motion", name: "Circular Motion & Gravitation" },
          { id: "oscillations", name: "Oscillations & Waves" },
        ],
      },
      {
        id: "phys-electromagnetism",
        name: "Electromagnetism",
        weight: 30,
        averageQuestions: "13–17",
        topics: [
          { id: "electrostatics", name: "Electrostatics" },
          { id: "dc-circuits", name: "DC Circuits" },
          { id: "magnetism", name: "Magnetic Field & Forces" },
          { id: "induction", name: "Electromagnetic Induction" },
        ],
      },
      {
        id: "phys-thermodynamics",
        name: "Thermodynamics",
        weight: 3.6,
        averageQuestions: "2",
        topics: [
          { id: "kinetic-theory", name: "Kinetic Theory of Gases" },
          { id: "gas-laws", name: "Gas Laws" },
          { id: "first-law", name: "First Law of Thermodynamics" },
        ],
      },
      {
        id: "phys-optics",
        name: "Optics",
        weight: 3.6,
        averageQuestions: "2",
        topics: [
          { id: "geometric-optics", name: "Geometric Optics" },
          { id: "wave-optics", name: "Wave Optics" },
        ],
      },
      {
        id: "phys-modern",
        name: "Modern Physics",
        weight: 2.6,
        averageQuestions: "1–2",
        topics: [
          { id: "photoelectric", name: "Photoelectric Effect" },
          { id: "atomic-structure", name: "Atomic & Nuclear Structure" },
        ],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    nameZh: "化学",
    requiredFor: "Medical, healthcare and life-science tracks",
    format: SCIENCE_FORMAT,
    modules: [
      {
        id: "chem-basics",
        name: "Basic Concepts & Calculations",
        weight: 27.5,
        averageQuestions: "10–12",
        topics: [
          { id: "matter", name: "Matter Classification" },
          { id: "chemical-notation", name: "Chemical Changes & Notation" },
          { id: "concentration", name: "Concentration & pH" },
          { id: "stoichiometry", name: "Moles & Stoichiometry" },
          { id: "molar-volume", name: "Gas Laws & Molar Volume" },
        ],
      },
      {
        id: "chem-reactions",
        name: "Properties & Reactions",
        weight: 32.5,
        averageQuestions: "15–16",
        topics: [
          { id: "inorganic", name: "Inorganic Chemistry" },
          { id: "organic", name: "Organic Chemistry" },
          { id: "redox", name: "Redox & Ionic Reactions" },
          { id: "equilibrium", name: "Chemical Equilibrium" },
          { id: "reaction-types", name: "Reaction Classifications" },
        ],
      },
      {
        id: "chem-theory",
        name: "Chemical Theory & Laws",
        weight: 27.5,
        averageQuestions: "13–14",
        topics: [
          { id: "atomic-periodic", name: "Atomic Structure & Periodic Law" },
          { id: "bonding", name: "Chemical Bonding" },
          { id: "electrolytes", name: "Electrolyte Solutions" },
        ],
      },
      {
        id: "chem-experiment",
        name: "Experiment & Application",
        weight: 12.5,
        averageQuestions: "6–7",
        topics: [
          { id: "lab-safety", name: "Laboratory Safety & Apparatus" },
          { id: "gas-preparation", name: "Gas Preparation & Collection" },
          { id: "separation", name: "Separation & Purification" },
          { id: "qualitative", name: "Qualitative Testing" },
        ],
      },
    ],
  },
  {
    id: "chinese-science",
    name: "Chinese (Science track)",
    nameZh: "理科中文",
    requiredFor: "Applicants to Chinese-taught science, engineering and computing programmes",
    format: CHINESE_FORMAT,
    modules: [
      {
        id: "zh-sci-question-types",
        name: "Question types",
        weight: 60,
        averageQuestions: "—",
        topics: [
          { id: "zh-characters", name: "Character recognition (识解汉字)" },
          { id: "zh-cloze", name: "Cloze — word choice (选词填空)" },
          { id: "zh-word-discrimination", name: "Distinguishing similar words (辨析词语)" },
          { id: "zh-passage-cloze", name: "Passage completion (选词成段)" },
          { id: "zh-sentence-completion", name: "Sentence completion (补全语句)" },
          { id: "zh-reading", name: "Reading comprehension (阅读理解)" },
        ],
      },
      {
        id: "zh-sci-topics",
        name: "Subject matter",
        weight: 40,
        averageQuestions: "—",
        topics: [
          { id: "zh-sci-basics", name: "Maths, physics & chemistry terminology" },
          { id: "zh-sci-coursework", name: "First-year course content" },
          { id: "zh-sci-academic", name: "Lab procedures, data & academic reading" },
        ],
      },
    ],
  },
  {
    id: "chinese-arts",
    name: "Chinese (Arts track)",
    nameZh: "文科中文",
    requiredFor: "Applicants to Chinese-taught humanities, law, education and arts programmes",
    format: CHINESE_FORMAT,
    modules: [
      {
        id: "zh-arts-question-types",
        name: "Question types",
        weight: 60,
        averageQuestions: "—",
        topics: [
          { id: "zh-characters", name: "Character recognition (识解汉字)" },
          { id: "zh-cloze", name: "Cloze — word choice (选词填空)" },
          { id: "zh-word-discrimination", name: "Distinguishing similar words (辨析词语)" },
          { id: "zh-passage-cloze", name: "Passage completion (选词成段)" },
          { id: "zh-sentence-completion", name: "Sentence completion (补全语句)" },
          { id: "zh-reading", name: "Reading comprehension (阅读理解)" },
        ],
      },
      {
        id: "zh-arts-topics",
        name: "Subject matter",
        weight: 40,
        averageQuestions: "—",
        topics: [
          { id: "zh-arts-humanities", name: "Literature, philosophy & history" },
          { id: "zh-arts-social", name: "Law, politics, education & sociology" },
          { id: "zh-arts-creative", name: "Art, music, drama & design" },
        ],
      },
    ],
  },
];

export const getSubject = (id: string) => subjects.find((s) => s.id === id);

export const getTopicName = (subjectId: SubjectId, topicId: string) => {
  const subject = getSubject(subjectId);
  for (const m of subject?.modules ?? []) {
    const t = m.topics.find((x) => x.id === topicId);
    if (t) return t.name;
  }
  return topicId;
};
