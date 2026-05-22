import { SCHEMA_VERSION, TEMPLATE_ID, type ResumeDocument } from "./schema";

export function createResumeId(): string {
  return crypto.randomUUID();
}

function baseDocument(title: string): ResumeDocument {
  const now = new Date().toISOString();
  return {
    id: createResumeId(),
    schemaVersion: SCHEMA_VERSION,
    templateId: TEMPLATE_ID,
    meta: {
      title,
      createdAt: now,
      updatedAt: now,
    },
    content: {},
  };
}

/** Empty resume — Step 0.2 will populate section defaults */
export function createBlankResume(): ResumeDocument {
  return baseDocument("Untitled Resume");
}

/** Rich sample resume — Step 0.2 will add realistic content */
export function createSampleResume(): ResumeDocument {
  return baseDocument("Sample Resume");
}
