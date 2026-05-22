type SummarySectionProps = {
  summary?: string;
};

/** Step 0.5: implement summary layout */
export function SummarySection({ summary: _summary }: SummarySectionProps) {
  return (
    <section className="summary-section" aria-label="Summary">
      <p className="text-sm text-muted-foreground">Summary — template pending</p>
    </section>
  );
}
