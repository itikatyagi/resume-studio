import { hasSummaryContent } from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type SummarySectionProps = {
  summary?: string;
};

export function SummarySection({ summary }: SummarySectionProps) {
  if (!hasSummaryContent(summary)) return null;

  return (
    <section className="summary-section mb-5" aria-label="Summary">
      <SectionHeading title="Summary" />
      <p className="text-sm leading-relaxed text-zinc-700">{summary}</p>
    </section>
  );
}
