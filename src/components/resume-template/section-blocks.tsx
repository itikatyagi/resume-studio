import type { LayoutSectionId } from "@/lib/resume/layout-schema";
import type { LayoutConfig } from "@/lib/resume/layout-schema";
import type { ResumeContent } from "@/lib/resume/schema";
import { isItikaLayout } from "@/lib/resume/is-itika-layout";
import { resolveStyleOptions } from "@/lib/resume/layout-utils";
import { ItikaSectionHeading, renderInlineBold } from "./itika-ui";
import { SkillChipList } from "./SkillChipList";
import {
  formatDate,
  formatDateNumeric,
  formatDateRange,
  formatDateRangeNumeric,
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
  sectionId,
}: {
  title: string;
  layout: LayoutConfig;
  variant: "sidebar" | "main";
  sectionId?: LayoutSectionId;
}) {
  const { headingStyle } = resolveStyleOptions(layout);
  const isMain = variant === "main";
  const baseClass = "mb-2.5 font-bold";

  if (headingStyle === "caps-icon") {
    return (
      <ItikaSectionHeading sectionId={sectionId} title={title} />
    );
  }

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
  const itika = isItikaLayout(layout);

  switch (sectionId) {
    case "summary":
      if (itika || !hasSummaryContent(content.summary)) return null;
      return (
        <section className="resume-section summary-section mb-5" aria-label="Summary">
          <Heading title="Summary" layout={layout} variant={variant} sectionId="summary" />
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
        <section className="resume-section skills-section mb-5" aria-label="Skills">
          <Heading title="Skills" layout={layout} variant={variant} sectionId="skills" />
          {itika ? (
            <SkillChipList
              skills={skills.flatMap((g) => g.skills)}
              layout={layout}
              variant={variant}
            />
          ) : (
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
          )}
        </section>
      );
    }

    case "languages": {
      const languages = sortByOrder(content.languages);
      if (!hasLanguagesContent(languages)) return null;
      return (
        <section className="resume-section mb-5" aria-label="Languages">
          <Heading title="Languages" layout={layout} variant={variant} sectionId="languages" />
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
        <section className="resume-section mb-5" aria-label="Certifications">
          <Heading title="Certifications" layout={layout} variant={variant} sectionId="certifications" />
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
        <section className="resume-section education-section mb-5" aria-label="Education">
          <Heading title="Education" layout={layout} variant={variant} sectionId="education" />
          <div className="space-y-3">
            {education.map((item) => {
              const degreeLine = [item.degree, item.field]
                .filter(Boolean)
                .join(" in ");
              const dateRange = itika
                ? formatDateRangeNumeric(
                    item.startDate,
                    item.endDate,
                    item.current,
                  )
                : formatDateRange(
                    item.startDate,
                    item.endDate,
                    item.current,
                  );
              const location = item.details?.trim();

              if (itika) {
                const datesLabel =
                  dateRange ||
                  formatDateNumeric(item.endDate) ||
                  formatDateNumeric(item.startDate);

                return (
                  <div key={item.id} className="education-item">
                    {degreeLine && (
                      <p className="text-[9.75pt] font-bold leading-snug">
                        {degreeLine}
                      </p>
                    )}
                    {item.institution && (
                      <p className="text-[9.25pt] leading-snug">
                        {item.institution}
                      </p>
                    )}
                    {(datesLabel || location) && (
                      <div className="itika-edu-meta mt-0.5 flex items-baseline justify-between gap-2">
                        {datesLabel ? (
                          <span className="itika-edu-dates leading-snug">
                            {datesLabel}
                          </span>
                        ) : (
                          <span />
                        )}
                        {location && (
                          <span className="itika-edu-location leading-snug">
                            {location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

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
                  {item.details && !itika && (
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
        <section className="resume-section experience-section mb-5" aria-label="Experience">
          <Heading title="Experience" layout={layout} variant={variant} sectionId="experience" />
          <div className="space-y-4">
            {experience.map((item) => {
              const dateRange = itika
                ? formatDateRangeNumeric(
                    item.startDate,
                    item.endDate,
                    item.current,
                  )
                : formatDateRange(
                    item.startDate,
                    item.endDate,
                    item.current,
                  );
              const bullets = item.bullets.filter((b) => b.trim());
              if (
                !item.company &&
                !item.title &&
                !item.projectName?.trim() &&
                bullets.length === 0
              )
                return null;

              const projectLabel = item.projectName?.trim();

              if (itika) {
                const roleLine = [item.title, item.company]
                  .filter(Boolean)
                  .join(", ");

                return (
                  <div key={item.id} className="experience-item">
                    {projectLabel && (
                      <p className="text-[11pt] font-bold leading-snug text-black">
                        {projectLabel}
                      </p>
                    )}
                    {(roleLine || dateRange) && (
                      <div className="itika-exp-role-row flex items-baseline justify-between gap-2">
                        {roleLine ? (
                          <p className="min-w-0 flex-1 text-[10pt] font-normal leading-snug text-black">
                            {roleLine}
                          </p>
                        ) : (
                          <span className="flex-1" />
                        )}
                        {dateRange && (
                          <p className="itika-exp-dates shrink-0 text-right leading-snug">
                            {dateRange}
                          </p>
                        )}
                      </div>
                    )}
                    {bullets.length > 0 && (
                      <ul className="itika-bullets mt-1.5 space-y-0.5 text-[9pt] leading-[1.42]">
                        {bullets.map((bullet, i) => (
                          <li key={i}>{renderInlineBold(bullet)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

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
                      {projectLabel && (
                        <p
                          className="text-[9.5pt] italic"
                          style={{ color: c.mainMuted }}
                        >
                          Project: {projectLabel}
                        </p>
                      )}
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
        <section className="resume-section projects-section mb-5" aria-label="Projects">
          <Heading title="Projects" layout={layout} variant={variant} sectionId="projects" />
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
              className="resume-section custom-section mb-5"
              aria-label={item.title}
            >
              <Heading
                title={item.title.trim() || "Organizations"}
                layout={layout}
                variant={variant}
                sectionId="customSections"
              />
              {itika ? (
                <div className="itika-org-line whitespace-pre-wrap">
                  {renderInlineBold(item.content)}
                </div>
              ) : (
                <p
                  className="whitespace-pre-wrap text-[9.5pt] leading-relaxed"
                  style={{ color: c.sidebarText }}
                >
                  {item.content}
                </p>
              )}
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
