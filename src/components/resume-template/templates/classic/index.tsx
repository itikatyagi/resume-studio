import type { ResumeContent } from "@/lib/resume/schema";
import { CertificationsSection } from "../../sections/CertificationsSection";
import { CustomSectionsBlock } from "../../sections/CustomSectionsBlock";
import { EducationSection } from "../../sections/EducationSection";
import { ExperienceSection } from "../../sections/ExperienceSection";
import { LanguagesSection } from "../../sections/LanguagesSection";
import { ProfileSection } from "../../sections/ProfileSection";
import { ProjectsSection } from "../../sections/ProjectsSection";
import { SkillsSection } from "../../sections/SkillsSection";
import { SummarySection } from "../../sections/SummarySection";
import type { ResumeTemplateProps } from "../../types";

/** Original single-column serif template (layout prop unused) */
export function ClassicTemplate({ content }: ResumeTemplateProps) {
  return (
    <>
      <ProfileSection content={content} />
      <SummarySection summary={content.summary} />
      <ExperienceSection items={content.experience} />
      <EducationSection items={content.education} />
      <SkillsSection items={content.skills} />
      <ProjectsSection items={content.projects} />
      <CertificationsSection items={content.certifications} />
      <LanguagesSection items={content.languages} />
      <CustomSectionsBlock items={content.customSections} />
    </>
  );
}
