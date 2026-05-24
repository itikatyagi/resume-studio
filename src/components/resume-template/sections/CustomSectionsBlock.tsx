import type { CustomSection } from "@/lib/resume/schema";
import { hasCustomSectionsContent, sortByOrder } from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type CustomSectionsBlockProps = {
  items: CustomSection[];
};

export function CustomSectionsBlock({ items }: CustomSectionsBlockProps) {
  if (!hasCustomSectionsContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <>
      {sorted.map((item) => (
        <section
          key={item.id}
          className="custom-section mb-5"
          aria-label={item.title}
        >
          <SectionHeading title={item.title} />
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
            {item.content}
          </p>
        </section>
      ))}
    </>
  );
}
