import type { LanguageItem } from "@/lib/resume/schema";
import { hasLanguagesContent, sortByOrder } from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type LanguagesSectionProps = {
  items: LanguageItem[];
};

export function LanguagesSection({ items }: LanguagesSectionProps) {
  if (!hasLanguagesContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="languages-section mb-5" aria-label="Languages">
      <SectionHeading title="Languages" />
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-700">
        {sorted.map((item) => (
          <span key={item.id}>
            <span className="font-semibold text-zinc-900">{item.language}</span>
            {item.proficiency && (
              <span className="text-zinc-600"> — {item.proficiency}</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
