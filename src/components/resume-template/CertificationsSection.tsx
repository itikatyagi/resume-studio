import type { CertificationItem } from "@/lib/resume/schema";
import {
  formatDate,
  hasCertificationsContent,
  sortByOrder,
} from "@/lib/resume/formatters";
import { SectionHeading } from "./SectionHeading";

type CertificationsSectionProps = {
  items: CertificationItem[];
};

export function CertificationsSection({ items }: CertificationsSectionProps) {
  if (!hasCertificationsContent(items)) return null;

  const sorted = sortByOrder(items);

  return (
    <section className="certifications-section mb-5" aria-label="Certifications">
      <SectionHeading title="Certifications" />
      <div className="space-y-2">
        {sorted.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <div>
              <p className="font-semibold text-zinc-900">{item.name}</p>
              {item.issuer && (
                <p className="text-zinc-700">{item.issuer}</p>
              )}
            </div>
            {item.date && (
              <p className="shrink-0 text-xs text-zinc-500">
                {formatDate(item.date)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
