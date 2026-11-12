import { db } from "@/lib/db";
import { catalogRecord, type CatalogRecord } from "./catalog-schema";

export function listCatalog(includeHidden = false) {
  const rows = db().prepare(`
    SELECT record_json, published
    FROM university_catalog
    WHERE published = 1 OR ? = 1
  `).all(Number(includeHidden)) as { record_json: string; published: number }[];
  return rows.map((row) => ({
    record: catalogRecord.parse(JSON.parse(row.record_json)),
    published: row.published === 1,
  })).sort((a, b) => a.record.name.localeCompare(b.record.name));
}

export function saveCatalog(records: CatalogRecord[], published: boolean, userId: string) {
  const database = db();
  const upsert = database.prepare(`
    INSERT INTO university_catalog (slug, record_json, published, updated_by, updated_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (slug) DO UPDATE SET
      record_json = excluded.record_json, published = excluded.published,
      updated_by = excluded.updated_by, updated_at = excluded.updated_at
  `);
  database.transaction(() => {
    const timestamp = new Date().toISOString();
    for (const record of records) upsert.run(record.slug, JSON.stringify(record), Number(published), userId, timestamp);
  })();
}

export function canManageCatalog(userId: string) {
  return Boolean(db().prepare("SELECT 1 FROM university_catalog_admins WHERE user_id = ?").get(userId));
}
