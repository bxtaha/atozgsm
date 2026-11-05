import type { Difficulty, SubjectId } from "./syllabus";

/**
 * Provenance. This is shown on every question and must never be faked — a
 * student revising for a real exam has to know whether they are looking at a
 * past paper or at practice material we wrote.
 */
export type QuestionSource =
  /** Transcribed from a real past paper. Requires year + sitting. */
  | "verified-past-paper"
  /** Written by ATOZ GSM against a syllabus topic. Mathematically checked. */
  | "practice"
  /** Machine-generated drilling material. Always labelled as such. */
  | "ai-generated";

export const SOURCE_LABELS: Record<QuestionSource, string> = {
  "verified-past-paper": "Verified past paper",
  practice: "ATOZ GSM practice",
  "ai-generated": "AI-generated drill",
};

export interface CommonMistake {
  /** The wrong option, so feedback can call it out by name. */
  option?: string;
  mistake: string;
  correction: string;
}

export interface Question {
  id: string;
  subject: SubjectId;
  moduleId: string;
  topicId: string;
  difficulty: Difficulty;
  source: QuestionSource;
  /** Year and sitting — required when source is a verified past paper. */
  examYear?: number;
  examSitting?: string;
  text: string;
  options: string[];
  /** Index into `options`. */
  correctIndex: number;
  formula: string;
  solutionSteps: string[];
  explanation: string;
  commonMistakes: CommonMistake[];
  quickTip?: string;
  /** Roughly how long this should take under exam pace. */
  expectedSeconds: number;
}

/**
 * Practice bank.
 *
 * Every item is labelled `practice`: written against the syllabus and
 * arithmetically verified, but NOT transcribed from a real paper. When real
 * past-paper questions are added they must carry `verified-past-paper` plus
 * the year and sitting.
 */
export const questions: Question[] = [
  {
    id: "PHYS-FF-001",
    subject: "physics",
    moduleId: "phys-mechanics",
    topicId: "free-fall",
    difficulty: "easy",
    source: "practice",
    text: "An object is released from rest near the Earth's surface. Taking g = 10 m/s² and ignoring air resistance, what is its speed after 3 seconds?",
    options: ["30 m/s", "45 m/s", "60 m/s", "5.5 m/s"],
    correctIndex: 0,
    formula: "v = gt",
    solutionSteps: [
      "Released from rest, so initial velocity u = 0.",
      "For free fall from rest: v = gt.",
      "Substitute: v = 10 × 3.",
      "v = 30 m/s.",
    ],
    explanation:
      "Free fall from rest is uniformly accelerated motion. Velocity grows linearly with time (v = gt), while distance grows with the square of time (h = ½gt²). Those two are the pair students most often mix up.",
    commonMistakes: [
      {
        option: "45 m/s",
        mistake: "Calculated the distance fallen (½gt² = 45 m) instead of the speed.",
        correction: "Check the units the question asks for. Distance is in m, speed is in m/s.",
      },
      {
        option: "60 m/s",
        mistake: "Used 2g instead of g.",
        correction: "g = 10 m/s² is the acceleration itself, not something to double.",
      },
    ],
    quickTip: "Free fall from rest: after 1s → 10 m/s, 2s → 20 m/s, 3s → 30 m/s. Distances: 5 m, 20 m, 45 m.",
    expectedSeconds: 45,
  },
  {
    id: "PHYS-FF-002",
    subject: "physics",
    moduleId: "phys-mechanics",
    topicId: "free-fall",
    difficulty: "easy",
    source: "practice",
    text: "A stone is dropped from rest. Taking g = 10 m/s², how far does it fall in 3 seconds?",
    options: ["45 m", "30 m", "90 m", "15 m"],
    correctIndex: 0,
    formula: "h = ½gt²",
    solutionSteps: [
      "Dropped from rest, so u = 0.",
      "Displacement under constant acceleration from rest: h = ½gt².",
      "Substitute: h = ½ × 10 × 3² = ½ × 10 × 9.",
      "h = 45 m.",
    ],
    explanation:
      "From s = ut + ½at² with u = 0, the displacement reduces to ½gt². The ½ is the single most commonly dropped factor in this topic.",
    commonMistakes: [
      {
        option: "30 m",
        mistake: "Calculated the speed (gt = 30 m/s) rather than the distance.",
        correction: "h = ½gt² for distance; v = gt for speed.",
      },
      {
        option: "90 m",
        mistake: "Used h = gt² and forgot the ½.",
        correction: "Always carry the ½ — it comes from s = ut + ½at².",
      },
    ],
    expectedSeconds: 45,
  },
  {
    id: "PHYS-DC-001",
    subject: "physics",
    moduleId: "phys-electromagnetism",
    topicId: "dc-circuits",
    difficulty: "medium",
    source: "practice",
    text: "Two resistors, R₁ = 6 Ω and R₂ = 3 Ω, are connected in parallel across a 12 V DC source. What is the total power dissipated?",
    options: ["72 W", "16 W", "144 W", "24 W"],
    correctIndex: 0,
    formula: "R_p = R₁R₂/(R₁+R₂), P = V²/R",
    solutionSteps: [
      "Parallel combination: R_p = (6 × 3) / (6 + 3) = 18 / 9 = 2 Ω.",
      "Total power from the source: P = V² / R_p.",
      "Substitute: P = 12² / 2 = 144 / 2.",
      "P = 72 W.",
    ],
    explanation:
      "For resistors in parallel the combined resistance is always smaller than the smallest branch — so parallel wiring draws more power from the same supply, not less.",
    commonMistakes: [
      {
        option: "16 W",
        mistake: "Added the resistors in series (9 Ω) instead of in parallel.",
        correction: "Series adds resistances; parallel adds reciprocals.",
      },
      {
        option: "24 W",
        mistake: "Computed V × R instead of V² / R.",
        correction: "Power is V²/R, or equivalently VI or I²R — never V × R.",
      },
    ],
    quickTip: "Two resistors in parallel: product over sum. It is faster than reciprocals under exam pressure.",
    expectedSeconds: 90,
  },
  {
    id: "PHYS-OHM-001",
    subject: "physics",
    moduleId: "phys-electromagnetism",
    topicId: "dc-circuits",
    difficulty: "easy",
    source: "practice",
    text: "A 12 V source is connected across a 4 Ω resistor. What current flows through it?",
    options: ["3 A", "48 A", "0.33 A", "8 A"],
    correctIndex: 0,
    formula: "V = IR",
    solutionSteps: ["Rearrange Ohm's law: I = V / R.", "Substitute: I = 12 / 4.", "I = 3 A."],
    explanation: "Ohm's law relates the three quantities directly. Rearranging it correctly is worth drilling until automatic.",
    commonMistakes: [
      { option: "48 A", mistake: "Multiplied V by R instead of dividing.", correction: "I = V/R, not V×R." },
      { option: "0.33 A", mistake: "Divided R by V.", correction: "Keep the order: current is volts over ohms." },
    ],
    expectedSeconds: 30,
  },
  {
    id: "PHYS-NL-001",
    subject: "physics",
    moduleId: "phys-mechanics",
    topicId: "newtons-laws",
    difficulty: "easy",
    source: "practice",
    text: "A net force of 20 N acts on a 4 kg object. What is its acceleration?",
    options: ["5 m/s²", "80 m/s²", "0.2 m/s²", "24 m/s²"],
    correctIndex: 0,
    formula: "F_net = ma",
    solutionSteps: ["Rearrange: a = F_net / m.", "Substitute: a = 20 / 4.", "a = 5 m/s²."],
    explanation:
      "Newton's second law needs the NET force — the vector sum of everything acting on the object. Here the net force is given directly, so no summing is needed.",
    commonMistakes: [
      {
        mistake: "Using an individual force rather than the net force when friction or another force is present.",
        correction: "Draw a free-body diagram and sum the forces before dividing by mass.",
      },
      { option: "80 m/s²", mistake: "Multiplied F by m.", correction: "a = F/m." },
    ],
    expectedSeconds: 30,
  },
  {
    id: "PHYS-HOOKE-001",
    subject: "physics",
    moduleId: "phys-mechanics",
    topicId: "statics",
    difficulty: "easy",
    source: "practice",
    text: "A spring has stiffness k = 200 N/m. How far does it stretch under a 50 N force?",
    options: ["0.25 m", "10 000 m", "4 m", "0.4 m"],
    correctIndex: 0,
    formula: "F = kx",
    solutionSteps: ["Rearrange Hooke's law: x = F / k.", "Substitute: x = 50 / 200.", "x = 0.25 m."],
    explanation:
      "x is the extension — how much the spring stretches — not the spring's total length. Questions frequently give you the natural length as a distractor.",
    commonMistakes: [
      {
        mistake: "Using the spring's total length instead of its extension.",
        correction: "x is always the change in length from natural length.",
      },
      { option: "4 m", mistake: "Divided k by F.", correction: "x = F/k." },
    ],
    expectedSeconds: 40,
  },
  {
    id: "PHYS-KE-001",
    subject: "physics",
    moduleId: "phys-mechanics",
    topicId: "energy",
    difficulty: "easy",
    source: "practice",
    text: "A 2 kg object moves at 6 m/s. What is its kinetic energy?",
    options: ["36 J", "72 J", "12 J", "18 J"],
    correctIndex: 0,
    formula: "E_k = ½mv²",
    solutionSteps: [
      "Kinetic energy: E_k = ½mv².",
      "Substitute: E_k = ½ × 2 × 6².",
      "= ½ × 2 × 36 = 36 J.",
    ],
    explanation:
      "Kinetic energy scales with the SQUARE of speed. Doubling the speed quadruples the energy — a favourite basis for comparison questions.",
    commonMistakes: [
      { option: "72 J", mistake: "Dropped the ½.", correction: "E_k = ½mv², always with the half." },
      { option: "12 J", mistake: "Used ½mv instead of ½mv².", correction: "The velocity is squared." },
    ],
    expectedSeconds: 40,
  },
  {
    id: "MATH-DOM-001",
    subject: "mathematics",
    moduleId: "math-functions",
    topicId: "domain-range",
    difficulty: "medium",
    source: "practice",
    text: "Find the domain of f(x) = √(x − 2) / (x − 5).",
    options: ["[2, 5) ∪ (5, ∞)", "[2, ∞)", "(2, 5) ∪ (5, ∞)", "(5, ∞)"],
    correctIndex: 0,
    formula: "Radicand ≥ 0 and denominator ≠ 0",
    solutionSteps: [
      "Square root requires x − 2 ≥ 0, so x ≥ 2.",
      "Denominator requires x − 5 ≠ 0, so x ≠ 5.",
      "Combine both conditions: x ≥ 2 with x = 5 removed.",
      "Domain = [2, 5) ∪ (5, ∞).",
    ],
    explanation:
      "Domain questions almost always combine two or three separate conditions. Apply each rule independently, then intersect. The three rules: denominator ≠ 0, even radicand ≥ 0, logarithm argument > 0.",
    commonMistakes: [
      {
        option: "[2, ∞)",
        mistake: "Applied the square-root rule but forgot to exclude the root of the denominator.",
        correction: "Check every part of the expression, not just the most obvious one.",
      },
      {
        option: "(2, 5) ∪ (5, ∞)",
        mistake: "Excluded x = 2, but √0 = 0 is perfectly defined.",
        correction: "The radicand may equal zero — only strictly negative is disallowed.",
      },
    ],
    quickTip: "Write each condition on its own line before combining. Rushing this is what loses the mark.",
    expectedSeconds: 90,
  },
  {
    id: "MATH-SEQ-001",
    subject: "mathematics",
    moduleId: "math-functions",
    topicId: "sequences",
    difficulty: "medium",
    source: "practice",
    text: "An arithmetic sequence has first term a₁ = 5 and common difference d = 3. What is the 100th term?",
    options: ["302", "305", "297", "308"],
    correctIndex: 0,
    formula: "aₙ = a₁ + (n − 1)d",
    solutionSteps: [
      "General term: aₙ = a₁ + (n − 1)d.",
      "Substitute: a₁₀₀ = 5 + (100 − 1) × 3.",
      "= 5 + 99 × 3 = 5 + 297.",
      "a₁₀₀ = 302.",
    ],
    explanation:
      "The (n − 1) matters: the first term needs zero steps of d, the hundredth needs ninety-nine. Off-by-one here is the single most common sequence error.",
    commonMistakes: [
      {
        option: "305",
        mistake: "Used n instead of (n − 1): 5 + 100 × 3.",
        correction: "The first term already counts, so only (n − 1) differences are added.",
      },
      { option: "297", mistake: "Forgot to add the first term.", correction: "Add a₁ after computing (n − 1)d." },
    ],
    expectedSeconds: 60,
  },
  {
    id: "MATH-CPX-001",
    subject: "mathematics",
    moduleId: "math-geometry",
    topicId: "complex",
    difficulty: "easy",
    source: "practice",
    text: "What is the modulus of the complex number z = 3 + 4i?",
    options: ["5", "7", "25", "√7"],
    correctIndex: 0,
    formula: "|z| = √(a² + b²)",
    solutionSteps: [
      "For z = a + bi, the modulus is |z| = √(a² + b²).",
      "Substitute: |z| = √(3² + 4²) = √(9 + 16).",
      "= √25 = 5.",
    ],
    explanation:
      "The modulus is the distance from the origin in the complex plane — the same Pythagorean calculation as the distance formula. The imaginary unit i never appears in the result.",
    commonMistakes: [
      { option: "7", mistake: "Added the parts (3 + 4) instead of using Pythagoras.", correction: "Square, add, then take the root." },
      { option: "25", mistake: "Forgot the square root.", correction: "√(9 + 16) = 5, not 25." },
    ],
    quickTip: "Spot the 3-4-5 and 5-12-13 triples — they appear constantly and save you the arithmetic.",
    expectedSeconds: 40,
  },
  {
    id: "MATH-LINE-001",
    subject: "mathematics",
    moduleId: "math-geometry",
    topicId: "lines",
    difficulty: "easy",
    source: "practice",
    text: "What is the slope of the line through the points (1, 2) and (4, 11)?",
    options: ["3", "1/3", "−3", "9"],
    correctIndex: 0,
    formula: "m = (y₂ − y₁)/(x₂ − x₁)",
    solutionSteps: [
      "Slope: m = (y₂ − y₁) / (x₂ − x₁).",
      "Substitute: m = (11 − 2) / (4 − 1).",
      "= 9 / 3 = 3.",
    ],
    explanation: "Rise over run. Keep the two points in the same order in numerator and denominator, or the sign flips.",
    commonMistakes: [
      { option: "1/3", mistake: "Inverted the fraction — run over rise.", correction: "Slope is Δy on top." },
      { option: "9", mistake: "Computed only the rise and forgot to divide.", correction: "Divide by the change in x." },
    ],
    expectedSeconds: 40,
  },
  {
    id: "CHEM-MOL-001",
    subject: "chemistry",
    moduleId: "chem-basics",
    topicId: "concentration",
    difficulty: "easy",
    source: "practice",
    text: "What is the molarity of a solution containing 2 moles of solute in 500 mL of solution?",
    options: ["4 mol/L", "0.004 mol/L", "1 mol/L", "0.25 mol/L"],
    correctIndex: 0,
    formula: "M = n / V",
    solutionSteps: [
      "Molarity is moles per LITRE, so convert first: 500 mL = 0.5 L.",
      "M = n / V = 2 / 0.5.",
      "M = 4 mol/L.",
    ],
    explanation:
      "The unit conversion is the whole question. Molarity is defined per litre; using millilitres directly is off by a factor of 1000.",
    commonMistakes: [
      {
        option: "0.004 mol/L",
        mistake: "Used 500 mL directly without converting to litres.",
        correction: "Always convert volume to litres before dividing.",
      },
      { option: "0.25 mol/L", mistake: "Divided volume by moles.", correction: "M = n/V, moles on top." },
    ],
    quickTip: "Convert every volume to litres the moment you read it, before anything else.",
    expectedSeconds: 50,
  },
  {
    id: "CHEM-PH-001",
    subject: "chemistry",
    moduleId: "chem-basics",
    topicId: "concentration",
    difficulty: "medium",
    source: "practice",
    text: "What is the pH of a 0.01 mol/L HCl solution? (HCl is a strong acid and dissociates completely.)",
    options: ["2", "12", "1", "0.01"],
    correctIndex: 0,
    formula: "pH = −log₁₀[H⁺]",
    solutionSteps: [
      "HCl is strong, so [H⁺] = 0.01 mol/L = 10⁻² mol/L.",
      "pH = −log₁₀(10⁻²).",
      "= −(−2) = 2.",
    ],
    explanation:
      "For a strong monoprotic acid the hydrogen-ion concentration equals the acid concentration. When the concentration is a clean power of ten, the pH is just the exponent with the sign flipped.",
    commonMistakes: [
      {
        option: "12",
        mistake: "Calculated pOH, or subtracted from 14 unnecessarily.",
        correction: "14 − pOH gives pH. Here [H⁺] was given directly, so no subtraction is needed.",
      },
      { option: "1", mistake: "Misread 0.01 as 0.1.", correction: "0.01 = 10⁻², so pH = 2." },
    ],
    expectedSeconds: 60,
  },
  {
    id: "CHEM-STP-001",
    subject: "chemistry",
    moduleId: "chem-basics",
    topicId: "molar-volume",
    difficulty: "easy",
    source: "practice",
    text: "What volume does 0.5 mol of O₂ occupy at standard temperature and pressure (STP)?",
    options: ["11.2 L", "22.4 L", "44.8 L", "5.6 L"],
    correctIndex: 0,
    formula: "V = n × 22.4 L/mol (at STP)",
    solutionSteps: [
      "At STP one mole of any ideal gas occupies 22.4 L.",
      "V = n × 22.4 = 0.5 × 22.4.",
      "V = 11.2 L.",
    ],
    explanation:
      "The 22.4 L/mol molar volume applies only at STP, and it is the same for any ideal gas regardless of which gas it is. Away from STP you must use PV = nRT instead.",
    commonMistakes: [
      { option: "22.4 L", mistake: "Quoted the molar volume without multiplying by the number of moles.", correction: "Multiply 22.4 by n." },
      {
        mistake: "Applying 22.4 L/mol when the question is not at STP.",
        correction: "Check the conditions first; otherwise use PV = nRT.",
      },
    ],
    expectedSeconds: 40,
  },
  {
    id: "ZH-SCI-CHAR-001",
    subject: "chinese-science",
    moduleId: "zh-sci-question-types",
    topicId: "zh-characters",
    difficulty: "easy",
    source: "practice",
    text: "识解汉字 — Which pinyin, with the correct tones, reads 物理 (physics)?",
    options: ["wùlǐ", "wúlǐ", "wǔlì", "wùlì"],
    correctIndex: 0,
    formula: "物 wù (4th tone) + 理 lǐ (3rd tone)",
    solutionSteps: [
      "物 is wù — fourth tone, falling.",
      "理 is lǐ — third tone, dipping.",
      "Together: wùlǐ.",
    ],
    explanation:
      "Tones carry meaning, so they are part of the spelling, not decoration. 无理 (wúlǐ) means 'unreasonable' — a completely different word from 物理 (physics) and only a tone apart.",
    commonMistakes: [
      {
        option: "wúlǐ",
        mistake: "Second tone on 物. That spells 无理, 'unreasonable'.",
        correction: "物 is always fourth tone — a sharp fall.",
      },
      {
        option: "wùlì",
        mistake: "Fourth tone on 理 instead of third.",
        correction: "理 dips down and back up: lǐ.",
      },
    ],
    quickTip: "Learn every new word with its tone marks from day one. Retrofitting tones later is far harder.",
    expectedSeconds: 40,
  },
  {
    id: "ZH-SCI-CHAR-002",
    subject: "chinese-science",
    moduleId: "zh-sci-question-types",
    topicId: "zh-characters",
    difficulty: "easy",
    source: "practice",
    text: "识解汉字 — Which word means “experiment”?",
    options: ["实验 (shíyàn)", "经验 (jīngyàn)", "危险 (wēixiǎn)", "保险 (bǎoxiǎn)"],
    correctIndex: 0,
    formula: "实 shí (real) + 验 yàn (to test)",
    solutionSteps: [
      "实 means real or actual; 验 means to test or verify.",
      "实验 = a real test, i.e. an experiment.",
      "The other options share the 验 or 险 component but mean different things.",
    ],
    explanation:
      "验 (test) and 险 (danger) look similar and are easy to confuse at speed. 实验 is core vocabulary for the science-track paper — it appears constantly in lab and procedure passages.",
    commonMistakes: [
      {
        option: "经验 (jīngyàn)",
        mistake: "经验 means 'experience', not 'experiment'.",
        correction: "经 = to pass through → accumulated experience. 实 = real → a real test.",
      },
      {
        option: "危险 (wēixiǎn)",
        mistake: "Read 险 (danger) as 验 (test).",
        correction: "Check the left-hand radical: 阝 for 险, 马 for 验.",
      },
    ],
    expectedSeconds: 45,
  },
  {
    id: "ZH-SCI-CLOZE-001",
    subject: "chinese-science",
    moduleId: "zh-sci-question-types",
    topicId: "zh-cloze",
    difficulty: "medium",
    source: "practice",
    text: "选词填空 — 在标准大气压下，水加热到 100 摄氏度就会____。",
    options: ["沸腾", "蒸发", "凝固", "融化"],
    correctIndex: 0,
    formula: "沸腾 fèiténg = to boil",
    solutionSteps: [
      "The sentence says water is heated to 100 °C at standard atmospheric pressure.",
      "At exactly that point water boils — 沸腾 (fèiténg).",
      "蒸发 (evaporate) happens at any temperature, so it does not fit '到 100 度就会'.",
    ],
    explanation:
      "All four options are about changes of state, so the sentence context — the specific temperature — is what decides. Science-track cloze questions usually turn on exactly this kind of precision.",
    commonMistakes: [
      {
        option: "蒸发",
        mistake: "蒸发 (evaporate) is not tied to 100 °C — it happens below boiling point too.",
        correction: "The sentence marks a threshold, which points to boiling.",
      },
      {
        option: "凝固",
        mistake: "凝固 means to solidify — that is cooling, not heating.",
        correction: "加热 in the sentence means heating.",
      },
    ],
    expectedSeconds: 75,
  },
  {
    id: "ZH-SCI-WORD-001",
    subject: "chinese-science",
    moduleId: "zh-sci-question-types",
    topicId: "zh-word-discrimination",
    difficulty: "medium",
    source: "practice",
    text: "辨析词语 — 这个公式可以用来____物体的速度。",
    options: ["计算", "打算", "预算", "算了"],
    correctIndex: 0,
    formula: "计算 jìsuàn = to calculate",
    solutionSteps: [
      "The blank follows 用来 ('used to …'), so it needs a verb.",
      "The object is 物体的速度 — an object's speed.",
      "计算 (to calculate) is the only option that takes a quantity as its object.",
    ],
    explanation:
      "All four contain 算, but only 计算 means to compute a value. This is the shape 辨析词语 questions take: one shared character, four different meanings.",
    commonMistakes: [
      {
        option: "打算",
        mistake: "打算 means 'to plan / intend' — used for actions, not quantities.",
        correction: "You plan to do something; you calculate a number.",
      },
      {
        option: "预算",
        mistake: "预算 is a noun, 'budget'.",
        correction: "The slot after 用来 needs a verb.",
      },
    ],
    quickTip: "When options share a character, work out what the OTHER character contributes — that is where the difference lives.",
    expectedSeconds: 80,
  },
  {
    id: "ZH-ARTS-CLOZE-001",
    subject: "chinese-arts",
    moduleId: "zh-arts-question-types",
    topicId: "zh-cloze",
    difficulty: "medium",
    source: "practice",
    text: "选词填空 — 这篇论文的____很明确，作者的立场清楚。",
    options: ["观点", "观众", "参观", "景观"],
    correctIndex: 0,
    formula: "观点 guāndiǎn = viewpoint, argument",
    solutionSteps: [
      "The blank is the subject of 很明确 ('is very clear') and is possessed by 论文 (the paper).",
      "The second clause mentions the author's 立场 (position), which reinforces the meaning.",
      "观点 (viewpoint) is what a paper has and what can be clear.",
    ],
    explanation:
      "All four options contain 观 (to view), but only 观点 is an abstract noun describing an argument. Arts-track passages are dense with this kind of academic vocabulary.",
    commonMistakes: [
      { option: "观众", mistake: "观众 means 'audience' — people, not an argument.", correction: "众 means crowd." },
      { option: "参观", mistake: "参观 is a verb, 'to visit'.", correction: "The slot needs a noun." },
    ],
    expectedSeconds: 75,
  },
  {
    id: "ZH-ARTS-WORD-001",
    subject: "chinese-arts",
    moduleId: "zh-arts-question-types",
    topicId: "zh-word-discrimination",
    difficulty: "medium",
    source: "practice",
    text: "辨析词语 — 这本书研究的是中国古代的____。",
    options: ["历史", "历来", "经历", "日历"],
    correctIndex: 0,
    formula: "历史 lìshǐ = history",
    solutionSteps: [
      "The blank is the object of 研究 ('studies') and is modified by 中国古代 ('ancient China').",
      "A book studies a field — here, history.",
      "历史 (history) is the only option that names a field of study.",
    ],
    explanation:
      "历来 is an adverb ('always, throughout'), 经历 is personal experience, and 日历 is a calendar. Only 历史 works as the object of academic study.",
    commonMistakes: [
      {
        option: "历来",
        mistake: "历来 is an adverb and cannot be an object.",
        correction: "Check the grammar slot before the meaning — it rules options out fast.",
      },
      {
        option: "经历",
        mistake: "经历 is what one person has lived through, not a discipline.",
        correction: "A book on ancient China studies 历史, not someone's 经历.",
      },
    ],
    expectedSeconds: 80,
  },
  {
    id: "ZH-ARTS-SENT-001",
    subject: "chinese-arts",
    moduleId: "zh-arts-question-types",
    topicId: "zh-sentence-completion",
    difficulty: "medium",
    source: "practice",
    text: "补全语句 — 虽然这个理论提出得很早，____到今天仍然有影响。",
    options: ["但是", "因为", "所以", "并且"],
    correctIndex: 0,
    formula: "虽然 … 但是 … = although … still …",
    solutionSteps: [
      "The sentence opens with 虽然 ('although').",
      "虽然 pairs with 但是 ('but') in Chinese — both halves of the pair are normally stated.",
      "The meaning confirms it: early origin, yet still influential — a contrast.",
    ],
    explanation:
      "Chinese uses fixed connective pairs: 虽然…但是, 因为…所以, 不但…而且. Learning them as pairs makes 补全语句 questions almost automatic.",
    commonMistakes: [
      {
        option: "所以",
        mistake: "所以 pairs with 因为, not 虽然, and marks a result rather than a contrast.",
        correction: "Look at the first connective and recall its partner.",
      },
      {
        option: "并且",
        mistake: "并且 adds a similar idea; the sentence needs a contrast.",
        correction: "仍然 ('still') signals that something holds despite the first clause.",
      },
    ],
    quickTip: "Memorise the connective pairs as units — spotting the first half hands you the answer.",
    expectedSeconds: 70,
  },
];

export interface QuestionFilters {
  subject?: SubjectId;
  moduleId?: string;
  topicId?: string;
  difficulty?: Difficulty;
}

export function filterQuestions(f: QuestionFilters): Question[] {
  return questions.filter(
    (q) =>
      (!f.subject || q.subject === f.subject) &&
      (!f.moduleId || q.moduleId === f.moduleId) &&
      (!f.topicId || q.topicId === f.topicId) &&
      (!f.difficulty || q.difficulty === f.difficulty),
  );
}

/** Fisher-Yates, so every ordering is equally likely. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Randomises option order and re-points `correctIndex` at the moved answer.
 *
 * Without this the correct answer sits wherever the author happened to put it,
 * and a student who notices the pattern can score well without knowing any
 * physics — which makes the practice worthless as a signal.
 */
export function shuffleOptions(q: Question, random: () => number = Math.random): Question {
  const correct = q.options[q.correctIndex];
  const options = shuffle(q.options, random);
  return { ...q, options, correctIndex: options.indexOf(correct) };
}

export function buildSession(f: QuestionFilters, count: number, random: () => number = Math.random): Question[] {
  return shuffle(filterQuestions(f), random)
    .slice(0, count)
    .map((q) => shuffleOptions(q, random));
}

export const getQuestion = (id: string) => questions.find((q) => q.id === id);

export const hasVerifiedPastPapers = () => questions.some((q) => q.source === "verified-past-paper");
