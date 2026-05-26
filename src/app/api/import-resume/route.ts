import { NextResponse } from "next/server";
import { extractEmbeddedResumeContent } from "@/lib/resume/pdf-import/embedded-payload";
import { extractTextFromPdf } from "@/lib/resume/pdf-import/extract-pdf";
import { normalizeDraftResume } from "@/lib/resume/pdf-import/normalize";
import { parseResumeText } from "@/lib/resume/pdf-import/parse-text";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF file was uploaded." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Please upload a PDF file." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "PDF must be 8 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPdf(buffer);
    const embeddedContent = extractEmbeddedResumeContent(text);

    if (embeddedContent) {
      return NextResponse.json({ content: embeddedContent });
    }

    if (!text.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not read text from this PDF. Try a text-based PDF (not a scanned image).",
        },
        { status: 422 },
      );
    }

    const draft = parseResumeText(text);
    const content = normalizeDraftResume(draft);

    if (!content) {
      return NextResponse.json(
        { error: "Could not map PDF content into the resume format." },
        { status: 422 },
      );
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Failed to process the PDF. Please try another file." },
      { status: 500 },
    );
  }
}
