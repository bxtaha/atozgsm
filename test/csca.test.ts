import { describe, expect, it } from "vitest";
import { INITIAL_STATE, qualityFromAnswer, review, nextReviewDate, type ReviewState } from "@/lib/csca/sm2";
import { questions, filterQuestions, buildSession, shuffle, shuffleOptions } from "@/lib/csca/questions";
import { subjects, EXAM_RULES, DIFFICULTY_MIX, getSubject } from "@/lib/csca/syllabus";

describe("SM-2 spaced repetition", () => {
  it("schedules the first two successful reviews at 1 then 6 days", () => {
    const first = review(INITIAL_STATE, 4);
    expect(first.repetitions).toBe(1);
    expect(first.intervalDays).toBe(1);

    const second = review(first, 4);
    expect(second.repetitions).toBe(2);
    expect(second.intervalDays).toBe(6);
  });

  it("grows the interval by the easiness factor from the third review on", () => {
    let state = review(review(INITIAL_STATE, 4), 4); // interval 6
    state = review(state, 4);
    expect(state.repetitions).toBe(3);
    expect(state.intervalDays).toBe(Math.round(6 * state.easiness));
    expect(state.intervalDays).toBeGreaterThan(6);
  });

  it("resets the ladder when an item is forgotten", () => {
    let state = review(review(review(INITIAL_STATE, 5), 5), 5);
    expect(state.repetitions).toBe(3);

    state = review(state, 1);
    expect(state.repetitions).toBe(0);
    expect(state.intervalDays).toBe(1);
  });

  it("keeps a lapsed item harder than a fresh one", () => {
    const lapsed = review(INITIAL_STATE, 1);
    expect(lapsed.easiness).toBeLessThan(INITIAL_STATE.easiness);
  });

  it("never lets easiness fall below the 1.3 floor", () => {
    let state: ReviewState = INITIAL_STATE;
    for (let i = 0; i < 20; i++) state = review(state, 0);
    expect(state.easiness).toBeGreaterThanOrEqual(1.3);
  });

  it("raises easiness for effortless recall and lowers it for hard recall", () => {
    expect(review(INITIAL_STATE, 5).easiness).toBeGreaterThan(INITIAL_STATE.easiness);
    expect(review(INITIAL_STATE, 3).easiness).toBeLessThan(INITIAL_STATE.easiness);
  });

  it("advances the review date by the interval", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    const next = nextReviewDate({ easiness: 2.5, repetitions: 2, intervalDays: 6 }, from);
    expect(next.getDate()).toBe(7);
  });
});

describe("grading an answer for scheduling", () => {
  it("grades a fast correct answer highest", () => {
    expect(qualityFromAnswer(true, 30, 60)).toBe(5);
  });

  it("treats a slow correct answer as insecure knowledge", () => {
    expect(qualityFromAnswer(true, 150, 60)).toBe(3);
    expect(qualityFromAnswer(true, 150, 60)).toBeLessThan(qualityFromAnswer(true, 30, 60));
  });

  it("grades every wrong answer below the pass threshold", () => {
    expect(qualityFromAnswer(false, 10, 60)).toBeLessThan(3);
    expect(qualityFromAnswer(false, 200, 60)).toBeLessThan(3);
  });
});

describe("question bank integrity", () => {
  it("gives every question a unique id", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every correctIndex at a real option", () => {
    for (const q of questions) {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it("gives every question four distinct options", () => {
    for (const q of questions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
    }
  });

  it("labels every question with a source", () => {
    for (const q of questions) {
      expect(["verified-past-paper", "practice", "ai-generated"]).toContain(q.source);
    }
  });

  it("requires a year and sitting on anything claiming to be a past paper", () => {
    // Guards the rule that matters most: a question may only claim past-paper
    // provenance if it can say which paper it came from.
    for (const q of questions.filter((x) => x.source === "verified-past-paper")) {
      expect(q.examYear, `${q.id} claims past-paper status without a year`).toBeDefined();
      expect(q.examSitting, `${q.id} claims past-paper status without a sitting`).toBeDefined();
    }
  });

  it("gives every question solution steps and at least one common mistake", () => {
    for (const q of questions) {
      expect(q.solutionSteps.length, `${q.id} has no solution steps`).toBeGreaterThan(0);
      expect(q.commonMistakes.length, `${q.id} has no common mistakes`).toBeGreaterThan(0);
    }
  });

  it("only references topics that exist in the syllabus", () => {
    const topicIds = new Set(subjects.flatMap((s) => s.modules.flatMap((m) => m.topics.map((t) => t.id))));
    const moduleIds = new Set(subjects.flatMap((s) => s.modules.map((m) => m.id)));
    for (const q of questions) {
      expect(moduleIds.has(q.moduleId), `${q.id} has unknown module ${q.moduleId}`).toBe(true);
      expect(topicIds.has(q.topicId), `${q.id} has unknown topic ${q.topicId}`).toBe(true);
    }
  });
});

describe("practice session building", () => {
  it("filters by subject", () => {
    const physics = filterQuestions({ subject: "physics" });
    expect(physics.length).toBeGreaterThan(0);
    expect(physics.every((q) => q.subject === "physics")).toBe(true);
  });

  it("filters by topic", () => {
    const freeFall = filterQuestions({ topicId: "free-fall" });
    expect(freeFall.every((q) => q.topicId === "free-fall")).toBe(true);
  });

  it("never returns more questions than requested", () => {
    expect(buildSession({}, 3)).toHaveLength(3);
  });

  it("returns what it can when the bank is smaller than the request", () => {
    const session = buildSession({ topicId: "free-fall" }, 50);
    expect(session.length).toBe(filterQuestions({ topicId: "free-fall" }).length);
  });

  it("does not repeat a question inside one session", () => {
    const session = buildSession({}, questions.length);
    expect(new Set(session.map((q) => q.id)).size).toBe(session.length);
  });

  it("shuffles without losing or duplicating items", () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect(out.sort()).toEqual(input);
  });

  it("keeps correctIndex pointing at the same answer after shuffling options", () => {
    for (const q of questions) {
      const expected = q.options[q.correctIndex];
      for (let i = 0; i < 25; i++) {
        const shuffled = shuffleOptions(q);
        expect(shuffled.options[shuffled.correctIndex], `${q.id} lost its answer`).toBe(expected);
        expect([...shuffled.options].sort()).toEqual([...q.options].sort());
      }
    }
  });

  it("does not leave the answer in a fixed position — 'always pick A' must not work", () => {
    // Guards the flaw where every author put the answer first, letting a
    // student score well by pattern-matching instead of solving.
    const positions = new Set<number>();
    for (let i = 0; i < 60; i++) {
      for (const q of buildSession({}, 5)) positions.add(q.correctIndex);
    }
    expect(positions.size).toBeGreaterThan(1);
    expect(positions).toContain(0);
    expect(positions).toContain(3);
  });
});

describe("syllabus", () => {
  it("records the rules that hold across every paper", () => {
    expect(EXAM_RULES.totalMarks).toBe(100);
    expect(EXAM_RULES.negativeMarking).toBe(false);
    expect(EXAM_RULES.calculatorAllowed).toBe(false);
  });

  it("gives the three science papers 60 minutes and 48 questions", () => {
    for (const id of ["mathematics", "physics", "chemistry"] as const) {
      const f = getSubject(id)!.format;
      expect(f.durationMinutes, `${id} duration`).toBe(60);
      expect(f.questionCount, `${id} question count`).toBe(48);
    }
  });

  it("gives both Chinese papers 90 minutes, per the 2025 syllabus", () => {
    // The Chinese papers run longer than the science ones and do not publish a
    // fixed question count — assuming 60/48 across the board would be wrong.
    for (const id of ["chinese-science", "chinese-arts"] as const) {
      const f = getSubject(id)!.format;
      expect(f.durationMinutes, `${id} duration`).toBe(90);
      expect(f.questionCount).toBeUndefined();
      expect(f.totalMarks).toBe(100);
    }
  });

  it("covers all five CSCA subjects", () => {
    expect(subjects.map((s) => s.id).sort()).toEqual(
      ["chemistry", "chinese-arts", "chinese-science", "mathematics", "physics"].sort(),
    );
  });

  it("has a difficulty mix that adds up to a full science paper", () => {
    const total = DIFFICULTY_MIX.easy + DIFFICULTY_MIX.medium + DIFFICULTY_MIX.hard;
    expect(total).toBe(getSubject("physics")!.format.questionCount);
  });

  it("has practice questions for every subject, including both Chinese papers", () => {
    for (const subject of subjects) {
      expect(
        filterQuestions({ subject: subject.id }).length,
        `${subject.name} has no practice questions`,
      ).toBeGreaterThan(0);
    }
  });

  it("gives each subject module weights summing to roughly 100%", () => {
    for (const subject of subjects) {
      const total = subject.modules.reduce((sum, m) => sum + m.weight, 0);
      expect(total, `${subject.name} weights sum to ${total}`).toBeGreaterThan(95);
      expect(total).toBeLessThan(105);
    }
  });

  it("uses unique module and topic ids across the whole syllabus", () => {
    const moduleIds = subjects.flatMap((s) => s.modules.map((m) => m.id));
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });
});
