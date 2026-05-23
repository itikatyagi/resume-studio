import { memo } from "react";
import type { ResumeDocument as ResumeDocumentType } from "@/lib/resume/schema";
import { CertificationsSection } from "./CertificationsSection";
import { CustomSectionsBlock } from "./CustomSectionsBlock";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { LanguagesSection } from "./LanguagesSection";
import { ProfileSection } from "./ProfileSection";
import { ProjectsSection } from "./ProjectsSection";
import { SkillsSection } from "./SkillsSection";
import { SummarySection } from "./SummarySection";

type ResumeDocumentProps = {
  document: ResumeDocumentType;
};

export const ResumeDocument = memo(function ResumeDocument({
  document,
}: ResumeDocumentProps) {
  const { content } = document;

  return (
    <article className="resume-page mx-auto bg-white text-black shadow-md">
      <ProfileSection content={content} />
      <SummarySection summary={content.summary} />
      <ExperienceSection items={content.experience} />
      <EducationSection items={content.education} />
      <SkillsSection items={content.skills} />
      <ProjectsSection items={content.projects} />
      <CertificationsSection items={content.certifications} />
      <LanguagesSection items={content.languages} />
      <CustomSectionsBlock items={content.customSections} />
    </article>
  );
});
