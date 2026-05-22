type ExperienceSectionProps = {
  items?: unknown[];
};

/** Step 0.5: implement experience layout */
export function ExperienceSection({ items: _items }: ExperienceSectionProps) {
  return (
    <section className="experience-section" aria-label="Experience">
      <p className="text-sm text-muted-foreground">Experience — template pending</p>
    </section>
  );
}
