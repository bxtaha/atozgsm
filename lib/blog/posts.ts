export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export interface Post {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated: string;
  readingMinutes: number;
  /** The question this article answers, phrased the way a student would ask it. */
  question: string;
  body: Block[];
}

export const posts: Post[] = [
  {
    slug: "how-to-apply-to-a-chinese-university-from-bangladesh",
    title: "How to apply to a Chinese university from Bangladesh",
    description:
      "The application process for Chinese universities, step by step, for students applying from Bangladesh — what happens in what order, and how long each stage usually takes.",
    published: "2026-09-12",
    updated: "2026-09-12",
    readingMinutes: 7,
    question: "How does a Bangladeshi student apply to a university in China?",
    body: [
      {
        type: "p",
        text: "Applying to a Chinese university from Bangladesh follows a fairly consistent order, whichever university you choose. Knowing that order is most of the battle — most of the stress students feel comes from doing things out of sequence, or finding out about a requirement too late to meet it.",
      },
      { type: "h2", text: "1. Decide your level and your language of instruction" },
      {
        type: "p",
        text: "Before anything else, settle two questions: which level you are applying for (bachelor's, master's, diploma, or a Chinese language programme), and whether you want a programme taught in English or in Chinese. This decision changes your entire document list. An English-taught programme will ask you to prove your English ability; a Chinese-taught programme will usually ask for an HSK result instead.",
      },
      { type: "h2", text: "2. Check what your target universities actually require" },
      {
        type: "p",
        text: "There is no single national checklist that every Chinese university follows. Requirements are set per university, and often per programme within that university. Two universities in the same city can ask for different things. Always read the current admissions page of the specific university and programme you want, and note the deadline — deadlines differ too.",
      },
      {
        type: "note",
        text: "Requirements and deadlines change from year to year. Anything you read on a blog — including this one — should be confirmed against the university's own current published requirements before you rely on it.",
      },
      { type: "h2", text: "3. Get your passport sorted first" },
      {
        type: "p",
        text: "Your passport is the one document that everything else hangs off, and it is the one most likely to delay you. Your name as printed in your passport becomes your official name on every application, offer letter and visa document. If your passport name does not match your academic certificates, resolve that early — it is much harder to fix later.",
      },
      { type: "h2", text: "4. Prepare your academic documents" },
      {
        type: "p",
        text: "You will generally need your certificates and transcripts for the level below the one you are applying to — SSC and HSC for a bachelor's, your bachelor's certificate and transcript for a master's. Many universities require these in English; where your originals are in Bangla, you will need official translations, and some universities additionally require notarisation or attestation.",
      },
      { type: "h2", text: "5. Prove your language ability" },
      {
        type: "p",
        text: "For English-taught programmes, universities typically accept some combination of IELTS, TOEFL, Duolingo English Test, or a Medium of Instruction (MOI) certificate from your previous institution — but which of these a university accepts varies, and some accept none of them for certain programmes. For Chinese-taught programmes, the HSK is the standard test, and the level required depends on the programme.",
      },
      { type: "h2", text: "6. Submit the application" },
      {
        type: "p",
        text: "Most universities run their own online application portal. Some also require a paper submission or a courier of original documents. You normally pay an application fee at this stage. Apply to more than one university — a single application is a single point of failure, and there is rarely a good reason to bet everything on one offer.",
      },
      { type: "h2", text: "7. Wait for the offer and the admission documents" },
      {
        type: "p",
        text: "If you are accepted, the university issues an admission notice. For a student visa you will also need either a JW201 or JW202 form, depending on how your study is funded. The university issues these — you cannot obtain them yourself. Processing time varies widely by university and by intake, so build slack into your plan.",
      },
      { type: "h2", text: "8. Apply for the student visa" },
      {
        type: "p",
        text: "Chinese student visas are typically the X1 (for study longer than 180 days) or X2 (for shorter study). You apply through the official Chinese visa application process serving Bangladesh, with your admission notice, your JW201/JW202, your passport, and the other documents the visa centre requires at that time. The visa decision belongs entirely to the Chinese authorities — no consultancy, including us, can guarantee it.",
      },
      { type: "h2", text: "How long the whole thing takes" },
      {
        type: "p",
        text: "Plan on the process taking several months from first research to departure, and start earlier than you think you need to. The stages that most often run late are document translation and attestation, language test scheduling and results, and the gap between applying and receiving admission documents.",
      },
    ],
  },
  {
    slug: "documents-needed-to-study-in-china",
    title: "Documents you need to study in China (and why each one exists)",
    description:
      "A plain explanation of the documents Chinese universities commonly ask Bangladeshi applicants for — what each one is for, and which ones depend on your programme.",
    published: "2026-09-12",
    updated: "2026-09-12",
    readingMinutes: 6,
    question: "What documents are needed to apply to a Chinese university?",
    body: [
      {
        type: "p",
        text: "Document lists differ by university, programme, intake and scholarship. What follows is the set that comes up most often for Bangladeshi applicants, with an explanation of what each one is actually for — because understanding the purpose makes it much easier to tell whether yours will be accepted.",
      },
      { type: "h2", text: "Documents almost everyone needs" },
      {
        type: "ul",
        items: [
          "Passport — establishes your identity and becomes your official name on every later document. Check its expiry date against your intended study period.",
          "Passport-size photograph — to the specification the university or visa process states. Specifications are exact about size, background colour and how much of the frame your face fills.",
          "Academic certificates and transcripts — evidence of what you have already completed. Usually needed in English, often translated and sometimes notarised.",
          "Application form — the university's own form, normally completed in its online portal.",
        ],
      },
      { type: "h2", text: "Documents that depend on your programme" },
      {
        type: "ul",
        items: [
          "English proficiency evidence (IELTS, TOEFL, Duolingo, or MOI) — for English-taught programmes. Which of these is accepted varies by university and programme.",
          "HSK result — for Chinese-taught programmes. The level required depends on the programme.",
          "Study plan or statement of purpose — usually for master's applicants, explaining what you want to research or study and why.",
          "Recommendation letters — commonly required for master's applications, usually from academic referees.",
          "Research proposal — for research-based master's programmes and some scholarships.",
        ],
      },
      { type: "h2", text: "Documents often required for the visa stage" },
      {
        type: "ul",
        items: [
          "Admission notice and JW201 or JW202 form — issued by the university, not obtainable by you directly.",
          "Physical examination record — a medical form, completed to the specification required at the time you apply.",
          "Police clearance certificate — a criminal record check, where required.",
          "Proof of financial capacity — evidence that your study and living costs can be covered.",
        ],
      },
      { type: "h2", text: "About financial proof" },
      {
        type: "p",
        text: "Universities and the visa process want to see that your studies can be funded. What counts as sufficient, what form the evidence must take, and how long the funds must have been held all vary by university, by scholarship situation, and by what the visa process requires at the time you apply.",
      },
      {
        type: "note",
        text: "Be wary of any specific taka figure presented as 'the requirement' — including figures quoted by consultancies. Confirm the amount and format against the requirements that apply to your own application.",
      },
      { type: "h2", text: "The two mistakes that cost people the most time" },
      {
        type: "p",
        text: "First, name mismatches: if the spelling on your passport, your certificates and your application do not match exactly, expect delays. Second, poor scans: documents that are cropped, blurry, glare-covered or photographed at an angle get rejected and have to be resubmitted. Scan flat, in good light, with the entire document inside the frame.",
      },
    ],
  },
  {
    slug: "scholarships-for-chinese-universities-explained",
    title: "Scholarships for Chinese universities, explained honestly",
    description:
      "How scholarships for study in China actually work — the main types, who awards them, what they typically cover, and why nobody can promise you one.",
    published: "2026-09-12",
    updated: "2026-09-12",
    readingMinutes: 6,
    question: "What scholarships are available to study in China, and how do I get one?",
    body: [
      {
        type: "p",
        text: "Scholarships are the single biggest reason Bangladeshi students look at China, and also the area where students are most often misled. Here is how the funding landscape is actually structured.",
      },
      { type: "h2", text: "The main categories" },
      {
        type: "ul",
        items: [
          "Chinese Government Scholarship (CSC) — administered by the China Scholarship Council. Several application routes exist, including through a university and through designated authorities.",
          "University scholarships — awarded by an individual university under its own rules. These vary enormously between institutions.",
          "Provincial and municipal scholarships — offered by a local government rather than the national government or the university.",
          "Confucius Institute scholarships — aimed at Chinese language study and related fields.",
        ],
      },
      { type: "h2", text: "What a scholarship actually covers" },
      {
        type: "p",
        text: "Coverage is not uniform. Some awards cover tuition only. Some cover tuition plus accommodation. Some add a monthly living stipend, and some include medical insurance. A 'full scholarship' at one university may mean something different at another, so read what the specific award covers rather than assuming.",
      },
      { type: "h2", text: "What actually strengthens an application" },
      {
        type: "p",
        text: "Nobody can hand you a formula, because selection criteria differ per award. But the factors that consistently matter are your academic results, how well your stated study plan fits the programme you are applying to, the quality of your supporting documents, and applying early rather than close to the deadline. For research programmes, a coherent research proposal matters a great deal.",
      },
      { type: "h2", text: "Why nobody can guarantee you a scholarship" },
      {
        type: "p",
        text: "Scholarship decisions are made by universities, scholarship councils and government bodies — not by consultancies. Any agency that guarantees you a scholarship, an admission or a visa is either misunderstanding the process or misrepresenting it. What a good consultancy can genuinely do is help you target awards you are actually eligible for, get your documents right, and submit on time.",
      },
      {
        type: "note",
        text: "If someone quotes you a specific success rate or approval percentage, ask what it is based on and over what period. A number without a source behind it is marketing, not information.",
      },
      { type: "h2", text: "Deadlines matter more than most students expect" },
      {
        type: "p",
        text: "Scholarship deadlines often fall well before ordinary admission deadlines, and they are usually earlier than students assume. If a scholarship is central to your plan, work backwards from its deadline — not the university's general application deadline — when you build your timeline.",
      },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
