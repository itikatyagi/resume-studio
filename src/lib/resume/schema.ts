/**
 * Resume data model — types and Zod schemas.
 * Step 0.2: expand validators and section schemas.
 */

export const SCHEMA_VERSION = 1 as const;
export const TEMPLATE_ID = "default-v1" as const;

export type SchemaVersion = typeof SCHEMA_VERSION;
export type TemplateId = typeof TEMPLATE_ID;

/** Placeholder root document — filled in Step 0.2 */
export type ResumeDocument = {
  id: string;
  schemaVersion: SchemaVersion;
  templateId: TemplateId;
  meta: {
    title: string;
    createdAt: string;
    updatedAt: string;
  };
  content: Record<string, unknown>;
};
