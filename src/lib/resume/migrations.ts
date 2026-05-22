import { SCHEMA_VERSION, type ResumeDocument, type SchemaVersion } from "./schema";

/** Apply schema migrations when loading persisted data — Step 0.2+ */
export function migrateResume(
  doc: ResumeDocument,
  targetVersion: SchemaVersion = SCHEMA_VERSION,
): ResumeDocument {
  if (doc.schemaVersion === targetVersion) {
    return doc;
  }
  // Future: chain migrations v1 → v2 → …
  return { ...doc, schemaVersion: targetVersion };
}
