type EducationSectionProps = {
  items?: unknown[];
};

/** Step 0.5: implement education layout */
export function EducationSection({ items: _items }: EducationSectionProps) {
  return (
    <section className="education-section" aria-label="Education">
      <p className="text-sm text-muted-foreground">Education — template pending</p>
    </section>
  );
}
