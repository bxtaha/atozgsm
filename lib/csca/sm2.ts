/**
 * SM-2 spaced repetition (SuperMemo 2).
 *
 * Each item carries an easiness factor, a repetition count and an interval.
 * Recall quality is graded 0–5; anything below 3 resets the item so it comes
 * back immediately, which is the behaviour that makes the schedule work — a
 * forgotten item must not drift further away.
 */

export interface ReviewState {
  /** How easy the item is, 1.3 (hardest) to ~2.5. */
  easiness: number;
  /** Successful reviews in a row. Resets to 0 on a lapse. */
  repetitions: number;
  /** Days until the next review. */
  intervalDays: number;
}

/** 0–5, where <3 means the answer was not recalled. */
export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export const INITIAL_STATE: ReviewState = { easiness: 2.5, repetitions: 0, intervalDays: 0 };

const MIN_EASINESS = 1.3;

export function review(state: ReviewState, quality: Quality): ReviewState {
  // Standard SM-2 easiness update. Quality 4 leaves it unchanged; 5 raises it,
  // 3 and below lower it.
  const easiness = Math.max(
    MIN_EASINESS,
    state.easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  if (quality < 3) {
    // Lapse: start the ladder again, but keep the (now lower) easiness so the
    // item stays harder than one the student has never got wrong.
    return { easiness, repetitions: 0, intervalDays: 1 };
  }

  const repetitions = state.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(state.intervalDays * easiness);

  return { easiness, repetitions, intervalDays };
}

export function nextReviewDate(state: ReviewState, from: Date = new Date()): Date {
  const next = new Date(from);
  next.setDate(next.getDate() + state.intervalDays);
  return next;
}

/**
 * Maps an exam answer onto an SM-2 quality grade. Speed matters here: a
 * correct answer that took three times the expected time is not secure
 * knowledge, and grading it 5 would push the next review too far out.
 */
export function qualityFromAnswer(correct: boolean, secondsTaken: number, expectedSeconds: number): Quality {
  if (!correct) return secondsTaken < expectedSeconds * 0.5 ? 0 : 2;
  const ratio = secondsTaken / expectedSeconds;
  if (ratio <= 0.75) return 5;
  if (ratio <= 1.5) return 4;
  return 3;
}

export const isDue = (nextReview: Date, now: Date = new Date()) => nextReview <= now;
