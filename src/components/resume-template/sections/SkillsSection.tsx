import type { SkillEntry } from "@/lib/resume/schema";
import { hasSkillsContent, sortByOrder } from "@/lib/resume/formatters";
import { SkillChipList } from "../SkillChipList";
import { SectionHeading } from "./SectionHeading";

type SkillsSectionProps = {
  items: SkillEntry[];
};

export function SkillsSection({ items }: SkillsSectionProps) {
  if (!hasSkillsContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="skills-section mb-5" aria-label="Skills">
      <SectionHeading title="Skills" />
      <div className="space-y-3">
        {sorted.map((item) => {
          const skills = item.skills.filter((s) => s.trim());
          if (skills.length === 0) return null;

          return (
            <div key={item.id}>
              {item.groupName && (
                <p className="mb-2 text-sm font-semibold text-zinc-900">
                  {item.groupName}
                </p>
              )}
              <SkillChipList skills={skills} variant="classic" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
