import type { EducationItem } from "@/lib/resume/schema";
import {
  formatDateRange,
  hasEducationContent,
  sortByOrder,
} from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type EducationSectionProps = {
  items: EducationItem[];
};

export function EducationSection({ items }: EducationSectionProps) {
  if (!hasEducationContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="education-section mb-5" aria-label="Education">
      <SectionHeading title="Education" />
      <div className="space-y-3">
        {sorted.map((item) => {
          const dateRange = formatDateRange(
            item.startDate,
            item.endDate,
            item.current,
          );
          const degreeLine = [item.degree, item.field].filter(Boolean).join(" in ");

          if (!item.institution && !degreeLine) return null;

          return (
            <div key={item.id} className="education-item">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {degreeLine && (
                    <p className="text-sm font-semibold text-zinc-900">
                      {degreeLine}
                    </p>
                  )}
                  {item.institution && (
                    <p className="text-sm text-zinc-700">{item.institution}</p>
                  )}
                  {item.details && (
                    <p className="text-sm text-zinc-600">{item.details}</p>
                  )}
                </div>
                {dateRange && (
                  <p className="shrink-0 text-xs text-zinc-500">{dateRange}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
