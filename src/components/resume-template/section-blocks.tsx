import type { LayoutSectionId } from "@/lib/resume/layout-schema";
import type { LayoutConfig } from "@/lib/resume/layout-schema";
import type { ResumeContent } from "@/lib/resume/schema";
import { resolveStyleOptions } from "@/lib/resume/layout-utils";
import { SkillChipList } from "./SkillChipList";
import {
  formatDate,
  formatDateRange,
  hasCertificationsContent,
  hasCustomSectionsContent,
  hasEducationContent,
  hasExperienceContent,
  hasLanguagesContent,
  hasProjectsContent,
  hasSkillsContent,
  hasSummaryContent,
  sortByOrder,
} from "@/lib/resume/formatters";

type SectionBlocksProps = {
  content: ResumeContent;
  layout: LayoutConfig;
  variant: "sidebar" | "main";
};

function Heading({
  title,
  layout,
  variant,
}: {
  title: string;
  layout: LayoutConfig;
  variant: "sidebar" | "main";
}) {
  const { headingStyle } = resolveStyleOptions(layout);
  const isMain = variant === "main";
  const baseClass = "mb-2.5 font-bold";

  if (headingStyle === "underline") {
    return (
      <h2
        className={`${baseClass} pb-1 text-[1.05em]`}
        style={{
          color: layout.colors.accent,
          borderBottom: `1px solid ${layout.colors.accent}55`,
        }}
      >
        {title}
      </h2>
    );
  }

  if (headingStyle === "left-bar") {
    return (
      <h2
        className={`${baseClass} border-l-[3px] pl-2 text-[1.05em]`}
        style={{
          color: layout.colors.accent,
          borderColor: layout.colors.accent,
        }}
      >
        {title}
      </h2>
    );
  }

  if (headingStyle === "caps-plain") {
    return (
      <h2
        className={`${baseClass} text-[0.95em] uppercase tracking-[0.08em]`}
        style={{ color: layout.colors.accent }}
      >
        {title}
      </h2>
    );
  }

  return (
    <h2
      className={`${baseClass} pb-1 text-[0.95em] uppercase tracking-[0.08em]`}
      style={{
        color: layout.colors.accent,
        borderBottom: isMain
          ? `2px solid ${layout.colors.accent}`
          : `1px solid ${layout.colors.accent}66`,
      }}
    >
      {title}
    </h2>
  );
}

export function SectionBlock({
  sectionId,
  content,
  layout,
  variant,
}: {
  sectionId: LayoutSectionId;
  content: ResumeContent;
  layout: LayoutConfig;
  variant: "sidebar" | "main";
}) {
  const c = layout.colors;

  switch (sectionId) {
    case "summary":
      if (!hasSummaryContent(content.summary)) return null;
      return (
        <section className="summary-section mb-5" aria-label="Summary">
          <Heading title="Summary" layout={layout} variant={variant} />
          <p
            className="text-[10pt] leading-relaxed"
            style={{ color: c.sidebarText }}
          >
            {content.summary}
          </p>
        </section>
      );

    case "skills": {
      const skills = sortByOrder(content.skills);
      if (!hasSkillsContent(skills)) return null;
      return (
        <section className="skills-section mb-5" aria-label="Skills">
          <Heading title="Skills" layout={layout} variant={variant} />
          <div className="space-y-3">
            {skills.map((group) => {
              const items = group.skills.filter((s) => s.trim());
              if (items.length === 0) return null;
              return (
                <div key={group.id}>
                  {group.groupName && (
                    <p
                      className="mb-2 text-[9.5pt] font-bold"
                      style={{ color: c.accent }}
                    >
                      {group.groupName}
                    </p>
                  )}
                  <SkillChipList
                    skills={items}
                    layout={layout}
                    variant={variant}
                  />
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case "languages": {
      const languages = sortByOrder(content.languages);
      if (!hasLanguagesContent(languages)) return null;
      return (
        <section className="mb-5" aria-label="Languages">
          <Heading title="Languages" layout={layout} variant={variant} />
          <ul className="space-y-1 text-[9.5pt]" style={{ color: c.sidebarText }}>
            {languages.map((item) => (
              <li key={item.id}>
                <span className="font-semibold" style={{ color: c.accent }}>
                  {item.language}
                </span>
                {item.proficiency && (
                  <span style={{ color: c.mainMuted }}> — {item.proficiency}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    case "certifications": {
      const certifications = sortByOrder(content.certifications);
      if (!hasCertificationsContent(certifications)) return null;
      return (
        <section className="mb-5" aria-label="Certifications">
          <Heading title="Certifications" layout={layout} variant={variant} />
          <ul className="space-y-2 text-[9.5pt]" style={{ color: c.sidebarText }}>
            {certifications.map((item) => (
              <li key={item.id}>
                <p className="font-semibold" style={{ color: c.accent }}>
                  {item.name}
                </p>
                {item.issuer && <p>{item.issuer}</p>}
                {item.date && (
                  <p style={{ color: c.mainMuted }}>{formatDate(item.date)}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    case "education": {
      const education = sortByOrder(content.education);
      if (!hasEducationContent(education)) return null;
      return (
        <section className="education-section mb-5" aria-label="Education">
          <Heading title="Education" layout={layout} variant={variant} />
          <div className="space-y-3">
            {education.map((item) => {
              const degreeLine = [item.degree, item.field]
                .filter(Boolean)
                .join(" in ");
              const dateRange = formatDateRange(
                item.startDate,
                item.endDate,
                item.current,
              );
              return (
                <div key={item.id} className="education-item text-[9.5pt]">
                  {degreeLine && (
                    <p className="font-bold" style={{ color: c.accent }}>
                      {degreeLine}
                    </p>
                  )}
                  {item.institution && (
                    <p style={{ color: c.sidebarText }}>{item.institution}</p>
                  )}
                  {dateRange && (
                    <p style={{ color: c.mainMuted }}>{dateRange}</p>
                  )}
                  {item.details && (
                    <p style={{ color: c.mainMuted }}>{item.details}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case "experience": {
      const experience = sortByOrder(content.experience);
      if (!hasExperienceContent(experience)) return null;
      return (
        <section className="experience-section mb-5" aria-label="Experience">
          <Heading title="Experience" layout={layout} variant={variant} />
          <div className="space-y-4">
            {experience.map((item) => {
              const dateRange = formatDateRange(
                item.startDate,
                item.endDate,
                item.current,
              );
              const bullets = item.bullets.filter((b) => b.trim());
              if (!item.company && !item.title && bullets.length === 0)
                return null;
              return (
                <div key={item.id} className="experience-item">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {item.title && (
                        <p
                          className="text-[10.5pt] font-bold"
                          style={{ color: c.mainText }}
                        >
                          {item.title}
                        </p>
                      )}
                      <p
                        className="text-[10pt] font-semibold"
                        style={{ color: c.accent }}
                      >
                        {[item.company, item.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    {dateRange && (
                      <p
                        className="shrink-0 text-[9pt]"
                        style={{ color: c.mainMuted }}
                      >
                        {dateRange}
                      </p>
                    )}
                  </div>
                  {bullets.length > 0 && (
                    <ul
                      className="mt-1.5 list-disc space-y-0.5 pl-4 text-[9.5pt]"
                      style={{ color: c.sidebarText }}
                    >
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

    case "projects": {
      const projects = sortByOrder(content.projects);
      if (!hasProjectsContent(projects)) return null;
      return (
        <section className="projects-section mb-5" aria-label="Projects">
          <Heading title="Projects" layout={layout} variant={variant} />
          <div className="space-y-3">
            {projects.map((item) => {
              const bullets = item.bullets.filter((b) => b.trim());
              const dateRange = formatDateRange(
                item.startDate,
                item.endDate,
                item.current,
              );
              return (
                <div key={item.id} className="project-item">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className="text-[10.5pt] font-bold"
                      style={{ color: c.mainText }}
                    >
                      {item.url ? (
                        <a
                          href={item.url}
                          style={{
                            color: c.accent,
                            textDecoration: "underline",
                          }}
                        >
                          {item.name}
                        </a>
                      ) : (
                        item.name
                      )}
                    </p>
                    {dateRange && (
                      <p
                        className="shrink-0 text-[9pt]"
                        style={{ color: c.sidebarText }}
                      >
                        {dateRange}
                      </p>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-[9.5pt]" style={{ color: c.sidebarText }}>
                      {item.description}
                    </p>
                  )}
                  {bullets.length > 0 && (
                    <ul
                      className="mt-1 list-disc space-y-0.5 pl-4 text-[9.5pt]"
                      style={{ color: c.sidebarText }}
                    >
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

    case "customSections": {
      const customSections = sortByOrder(content.customSections);
      if (!hasCustomSectionsContent(customSections)) return null;
      return (
        <>
          {customSections.map((item) => (
            <section
              key={item.id}
              className="custom-section mb-5"
              aria-label={item.title}
            >
              <Heading title={item.title} layout={layout} variant={variant} />
              <p
                className="whitespace-pre-wrap text-[9.5pt] leading-relaxed"
                style={{ color: c.sidebarText }}
              >
                {item.content}
              </p>
            </section>
          ))}
        </>
      );
    }

    default:
      return null;
  }
}

export function SectionBlocks({ content, layout, variant }: SectionBlocksProps) {
  const sections =
    variant === "sidebar" ? layout.sidebarSections : layout.mainSections;

  return (
    <>
      {sections.map((id) => (
        <SectionBlock
          key={id}
          sectionId={id}
          content={content}
          layout={layout}
          variant={variant}
        />
      ))}
    </>
  );
}
