type SkillsSectionProps = {
  items?: unknown[];
};

/** Step 0.5: implement skills layout */
export function SkillsSection({ items: _items }: SkillsSectionProps) {
  return (
    <section className="skills-section" aria-label="Skills">
      <p className="text-sm text-muted-foreground">Skills — template pending</p>
    </section>
  );
}
