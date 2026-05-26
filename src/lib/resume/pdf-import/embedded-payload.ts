import { migrateResume } from "../migrations";
import { resumeContentSchema, resumeDocumentSchema, type ResumeContent } from "../schema";

const IMPORT_PAYLOAD_BEGIN = "RESUME_STUDIO_IMPORT_V1_BEGIN";
const IMPORT_PAYLOAD_END = "RESUME_STUDIO_IMPORT_V1_END";

function findPayload(text: string): string | null {
  const start = text.indexOf(IMPORT_PAYLOAD_BEGIN);
  if (start < 0) return null;

  const payloadStart = start + IMPORT_PAYLOAD_BEGIN.length;
  const end = text.indexOf(IMPORT_PAYLOAD_END, payloadStart);
  if (end < 0) return null;

  return text.slice(payloadStart, end).replace(/\s+/g, "");
}

function decodeBase64Utf8(value: string): string {
  return Buffer.from(value, "base64").toString("utf8");
}

export function extractEmbeddedResumeContent(text: string): ResumeContent | null {
  const payload = findPayload(text);
  if (!payload) return null;

  try {
    const raw = JSON.parse(decodeBase64Utf8(payload)) as unknown;

    const document = resumeDocumentSchema.safeParse(raw);
    if (document.success) {
      return migrateResume(document.data).content;
    }

    const content = resumeContentSchema.safeParse(raw);
    if (content.success) return content.data;
  } catch {
    // Fall through to generic PDF text parsing.
  }

  return null;
}
