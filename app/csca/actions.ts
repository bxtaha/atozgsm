"use server";

import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getQuestion } from "@/lib/csca/questions";
import { INITIAL_STATE, nextReviewDate, qualityFromAnswer, review, type ReviewState } from "@/lib/csca/sm2";

/**
 * Records one answered question and advances its spaced-repetition schedule.
 *
 * Signed-out students can still practise — the session simply isn't saved.
 * Returning silently keeps the practice flow working either way.
 */
export async function recordAttempt(input: {
  questionId: string;
  correct: boolean;
  secondsTaken: number;
}): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  const question = getQuestion(input.questionId);
  if (!question) return;

  const seconds = Math.max(0, Math.min(3600, Math.round(input.secondsTaken)));

  db()
    .prepare(
      `INSERT INTO question_attempts (id, user_id, question_id, subject, topic_id, correct, seconds_taken, attempted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      randomUUID(),
      user.id,
      question.id,
      question.subject,
      question.topicId,
      input.correct ? 1 : 0,
      seconds,
      new Date().toISOString(),
    );

  const existing = db()
    .prepare("SELECT easiness, repetitions, interval_days FROM review_schedule WHERE user_id = ? AND question_id = ?")
    .get(user.id, question.id) as { easiness: number; repetitions: number; interval_days: number } | undefined;

  const current: ReviewState = existing
    ? { easiness: existing.easiness, repetitions: existing.repetitions, intervalDays: existing.interval_days }
    : INITIAL_STATE;

  const next = review(current, qualityFromAnswer(input.correct, seconds, question.expectedSeconds));

  db()
    .prepare(
      `INSERT INTO review_schedule (user_id, question_id, easiness, repetitions, interval_days, next_review)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, question_id) DO UPDATE SET
         easiness = excluded.easiness,
         repetitions = excluded.repetitions,
         interval_days = excluded.interval_days,
         next_review = excluded.next_review`,
    )
    .run(
      user.id,
      question.id,
      next.easiness,
      next.repetitions,
      next.intervalDays,
      nextReviewDate(next).toISOString(),
    );
}
