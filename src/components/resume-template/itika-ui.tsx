"use client";

import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Languages,
  Link2,
  Mail,
  MapPin,
  Network,
  Phone,
} from "lucide-react";
import type { LayoutSectionId } from "@/lib/resume/layout-schema";
import type { LayoutConfig } from "@/lib/resume/layout-schema";
import type { ResumeContent } from "@/lib/resume/schema";
import { isItikaLayout } from "@/lib/resume/is-itika-layout";

/** Compact tools icon (reads clearly at small sizes; avoids Wrench/utensils confusion). */
function SkillsToolsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6.4 6.4l-5.6 5.6 1.4 1.4 5.6-5.6a4.5 4.5 0 0 0 6.4-6.4l-2.1 2.1-3.5-3.5 2.1-2.1z" />
      <path d="m3 21 3-3" />
    </svg>
  );
}

const SECTION_ICONS: Partial<Record<LayoutSectionId, LucideIcon>> = {
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderKanban,
  certifications: Award,
  languages: Languages,
  customSections: Network,
};

const SECTION_TITLES: Partial<Record<LayoutSectionId, string>> = {
  experience: "Work Experience",
  skills: "Skills",
  education: "Education",
};

export function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ItikaSectionHeading({
  sectionId,
  title,
}: {
  sectionId?: LayoutSectionId;
  title: string;
}) {
  const Icon = (sectionId && SECTION_ICONS[sectionId]) ?? Briefcase;
  const displayTitle =
    (sectionId && SECTION_TITLES[sectionId]) ?? title;
  const useSkillsIcon = sectionId === "skills";

  return (
    <div className="itika-section-heading mb-3 flex items-center gap-2.5">
      <span
        className="itika-section-icon flex size-[1.65rem] items-center justify-center"
        aria-hidden
      >
        {useSkillsIcon ? (
          <SkillsToolsIcon className="size-3.5" />
        ) : (
          <Icon className="size-3.5" strokeWidth={2.4} />
        )}
      </span>
      <h2>{displayTitle}</h2>
    </div>
  );
}

function ContactCell({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="itika-contact-icon size-3.5" strokeWidth={2.5} aria-hidden />
      <span className="min-w-0 leading-snug">{children}</span>
    </div>
  );
}

export function ItikaProfileHeader({
  content,
  layout,
}: {
  content: ResumeContent;
  layout: LayoutConfig;
}) {
  const { profile } = content;
  const accent = layout.colors.accent;

  const linkedIn =
    profile.links.find(
      (l) =>
        l.label?.toLowerCase().includes("linkedin") ||
        l.url?.toLowerCase().includes("linkedin"),
    ) ?? profile.links[0];

  const summary = content.summary?.trim();

  return (
    <header
      className="itika-header config-header px-[0.5in] pt-[0.45in]"
      style={
        {
          "--itika-accent": accent,
          "--itika-icon": accent,
        } as CSSProperties
      }
    >
      <div className="itika-header-block mx-auto w-full">
        <div className="itika-profile-frame relative">
          <span className="itika-frame-accent-bar" aria-hidden />
          <div className="itika-profile-frame-inner px-4 pb-3 pt-4">
            {profile.fullName && (
              <h1 className="text-center text-[22pt] font-bold leading-tight tracking-tight text-black">
                {profile.fullName}
              </h1>
            )}
            {profile.headline && (
              <p
                className="itika-accent-text mt-1.5 text-center text-[11pt] font-normal"
                style={{ color: accent }}
              >
                {profile.headline}
              </p>
            )}
            {summary && (
              <div className="itika-summary-inner mx-auto mt-3 max-w-[98%] px-1 text-center text-[9.25pt] leading-[1.45] text-black">
                {renderInlineBold(summary)}
              </div>
            )}
          </div>
        </div>

        <div className="itika-contact-bar grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-2.5 text-[8.5pt]">
        {profile.email && (
          <ContactCell icon={Mail}>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </ContactCell>
        )}
        {profile.phone && (
          <ContactCell icon={Phone}>
            <span>{profile.phone}</span>
          </ContactCell>
        )}
        {profile.location && (
          <ContactCell icon={MapPin}>
            <span>{profile.location}</span>
          </ContactCell>
        )}
        {linkedIn?.url && (
          <ContactCell icon={Link2}>
            <a
              href={linkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all"
            >
              {linkedIn.label || linkedIn.url.replace(/^https?:\/\//, "")}
            </a>
          </ContactCell>
        )}
        </div>
      </div>
    </header>
  );
}

export { isItikaLayout };
