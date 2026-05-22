import { ResumeDocument } from "@/components/resume-template";
import { createSampleResume } from "@/lib/resume/defaults";
import "@/styles/resume-print.css";

export const metadata = {
  title: "Preview — Resume Studio",
  description: "Resume template preview (Phase 0)",
};

export default function PreviewPage() {
  const document = createSampleResume();

  return (
    <main className="min-h-full bg-zinc-100 py-8">
      <div className="mx-auto max-w-[816px] px-4">
        <p className="mb-4 text-center text-sm text-zinc-500">
          Phase 0 preview — template sections will render in Step 0.5
        </p>
        <ResumeDocument document={document} />
      </div>
    </main>
  );
}
