import { db } from "@/lib/db";
import { catalogRecord, type CatalogRecord } from "./catalog-schema";

export function listCatalog() {
  const rows = db().prepare(`
    SELECT record_json
    FROM university_catalog
  `).all() as { record_json: string }[];
  return rows.map((row) => catalogRecord.parse(JSON.parse(row.record_json)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function saveCatalog(records: CatalogRecord[], userId: string) {
  const database = db();
  const upsert = database.prepare(`
    INSERT INTO university_catalog (slug, record_json, published, updated_by, updated_at)
    VALUES (?, ?, 0, ?, ?)
    ON CONFLICT (slug) DO UPDATE SET
      record_json = excluded.record_json, published = excluded.published,
      updated_by = excluded.updated_by, updated_at = excluded.updated_at
  `);
  database.transaction(() => {
    const timestamp = new Date().toISOString();
    for (const record of records) upsert.run(record.slug, JSON.stringify(record), userId, timestamp);
  })();
}

export function canManageCatalog(userId: string) {
  return Boolean(db().prepare("SELECT 1 FROM university_catalog_admins WHERE user_id = ?").get(userId));
}
