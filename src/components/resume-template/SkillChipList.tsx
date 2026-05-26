import type { LayoutConfig } from "@/lib/resume/layout-schema";
import { resolveStyleOptions } from "@/lib/resume/layout-utils";

type SkillChipListProps = {
  skills: string[];
  layout?: LayoutConfig;
  variant?: "sidebar" | "main" | "classic";
};

/** Skill display — boxes, comma list, or dot list */
export function SkillChipList({
  skills,
  layout,
  variant = "classic",
}: SkillChipListProps) {
  const items = skills.filter((s) => s.trim());
  if (items.length === 0) return null;

  const skillStyle = layout ? resolveStyleOptions(layout).skillStyle : "boxes";
  const isSidebar = variant === "sidebar";
  const isMain = variant === "main";
  const textColor = layout?.colors.sidebarText ?? "#3f3f46";

  if (skillStyle === "comma") {
    return (
      <p className="text-[0.95em] leading-relaxed" style={{ color: textColor }}>
        {items.join(", ")}
      </p>
    );
  }

  if (skillStyle === "itika-pills") {
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((skill, index) => (
          <span key={`${skill}-${index}`} className="itika-skill-pill">
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (skillStyle === "dots") {
    return (
      <ul
        className="list-inside list-disc space-y-0.5 text-[0.95em]"
        style={{ color: textColor }}
      >
        {items.map((skill, index) => (
          <li key={`${skill}-${index}`}>{skill}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="skill-chip-list flex flex-wrap gap-1.5">
      {items.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className="skill-chip inline-block rounded border px-2 py-1 text-[0.9em] leading-tight"
          style={
            layout
              ? {
                  borderColor: `${layout.colors.accent}55`,
                  backgroundColor: isSidebar
                    ? "#ffffff"
                    : isMain
                      ? layout.colors.sidebarBg
                      : "#fafafa",
                  color: layout.colors.sidebarText,
                }
              : {
                  borderColor: "#d4d4d8",
                  backgroundColor: "#fafafa",
                  color: "#3f3f46",
                }
          }
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
