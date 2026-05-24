import type { ExperienceItem } from "@/lib/resume/schema";
import {
  formatDateRange,
  hasExperienceContent,
  sortByOrder,
} from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type ExperienceSectionProps = {
  items: ExperienceItem[];
};

export function ExperienceSection({ items }: ExperienceSectionProps) {
  if (!hasExperienceContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="experience-section mb-5" aria-label="Experience">
      <SectionHeading title="Experience" />
      <div className="space-y-4">
        {sorted.map((item) => {
          const dateRange = formatDateRange(
            item.startDate,
            item.endDate,
            item.current,
          );
          const bullets = item.bullets.filter((b) => b.trim());

          if (!item.company && !item.title && bullets.length === 0) return null;

          return (
            <div key={item.id} className="experience-item">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {item.title && (
                    <p className="text-sm font-semibold text-zinc-900">
                      {item.title}
                    </p>
                  )}
                  <p className="text-sm text-zinc-700">
                    {[item.company, item.location].filter(Boolean).join(" · ")}
                  </p>
                  {item.projectName?.trim() && (
                    <p className="text-sm italic text-zinc-500">
                      Project: {item.projectName.trim()}
                    </p>
                  )}
                </div>
                {dateRange && (
                  <p className="shrink-0 text-xs text-zinc-500">{dateRange}</p>
                )}
              </div>
              {bullets.length > 0 && (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-sm text-zinc-700">
                  {bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
