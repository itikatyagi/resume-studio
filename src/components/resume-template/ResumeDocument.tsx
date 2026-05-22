import type { ResumeDocument as ResumeDocumentType } from "@/lib/resume/schema";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { ProfileSection } from "./ProfileSection";
import { SkillsSection } from "./SkillsSection";
import { SummarySection } from "./SummarySection";

type ResumeDocumentProps = {
  document: ResumeDocumentType;
};

/** Step 0.5: wire visibility rules and full layout */
export function ResumeDocument({ document }: ResumeDocumentProps) {
  const { content } = document;

  return (
    <article className="resume-page mx-auto bg-white text-black shadow-md">
      <ProfileSection content={content} />
      <SummarySection summary={content.summary as string | undefined} />
      <ExperienceSection items={content.experience as unknown[] | undefined} />
      <EducationSection items={content.education as unknown[] | undefined} />
      <SkillsSection items={content.skills as unknown[] | undefined} />
    </article>
  );
}
