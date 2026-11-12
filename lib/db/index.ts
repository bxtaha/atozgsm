import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * SQLite keeps the whole student portal runnable locally with no external
 * service to provision. The schema is deliberately plain SQL so it ports to
 * Postgres when this moves to a hosted database — nothing here depends on
 * SQLite-specific behaviour beyond the driver.
 *
 * Note: a file-backed database does not survive on serverless hosts with
 * ephemeral disks. Move to Postgres before deploying the portal.
 */
const DB_PATH = process.env.DATABASE_PATH ?? join(process.cwd(), ".data", "atozgsm.db");

let instance: Database.Database | null = null;

export function db(): Database.Database {
  if (instance) return instance;

  mkdirSync(dirname(DB_PATH), { recursive: true });
  instance = new Database(DB_PATH);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  migrate(instance);
  return instance;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      country TEXT NOT NULL DEFAULT 'Bangladesh',
      tier TEXT NOT NULL DEFAULT 'free',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      study_level TEXT,
      subject TEXT,
      intake TEXT,
      current_qualification TEXT,
      study_language TEXT,
      onboarded_at TEXT
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      requirement_id TEXT NOT NULL,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      status TEXT NOT NULL,
      reviewer_note TEXT,
      uploaded_at TEXT NOT NULL,
      UNIQUE (user_id, requirement_id)
    );

    CREATE TABLE IF NOT EXISTS question_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      subject TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      correct INTEGER NOT NULL,
      seconds_taken INTEGER NOT NULL,
      attempted_at TEXT NOT NULL
    );

    -- One row per question per student: the current spaced-repetition state.
    CREATE TABLE IF NOT EXISTS review_schedule (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL,
      easiness REAL NOT NULL,
      repetitions INTEGER NOT NULL,
      interval_days INTEGER NOT NULL,
      next_review TEXT NOT NULL,
      PRIMARY KEY (user_id, question_id)
    );

    CREATE TABLE IF NOT EXISTS university_catalog_admins (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS university_catalog (
      slug TEXT PRIMARY KEY,
      record_json TEXT NOT NULL,
      published INTEGER NOT NULL CHECK (published IN (0, 1)),
      updated_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
    CREATE INDEX IF NOT EXISTS idx_attempts_user ON question_attempts(user_id);
    CREATE INDEX IF NOT EXISTS idx_schedule_due ON review_schedule(user_id, next_review);
  `);
}
