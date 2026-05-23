import type { ProjectItem } from "@/lib/resume/schema";
import {
  formatDateRange,
  hasProjectsContent,
  sortByOrder,
} from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type ProjectsSectionProps = {
  items: ProjectItem[];
};

export function ProjectsSection({ items }: ProjectsSectionProps) {
  if (!hasProjectsContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="projects-section mb-5" aria-label="Projects">
      <SectionHeading title="Projects" />
      <div className="space-y-3">
        {sorted.map((item) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          const bullets = item.bullets.filter((b) => b.trim());

          if (!item.name && !item.description && bullets.length === 0) return null;

          return (
            <div key={item.id} className="project-item">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-zinc-900">
                  {item.url ? (
                    <a
                      href={item.url}
                      className="underline decoration-zinc-400 underline-offset-2"
                    >
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </p>
                {dateRange && (
                  <p className="shrink-0 text-xs text-zinc-500">{dateRange}</p>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-zinc-700">{item.description}</p>
              )}
              {bullets.length > 0 && (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-zinc-700">
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
