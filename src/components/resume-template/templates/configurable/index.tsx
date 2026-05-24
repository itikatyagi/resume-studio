import type { CSSProperties } from "react";
import { hasProfileContent } from "@/lib/resume/formatters";
import {
  layoutToCssVariables,
  resolveStyleOptions,
  resolveTypography,
} from "@/lib/resume/layout-utils";
import type { ResumeTemplateProps } from "../../types";
import { SectionBlocks } from "../../section-blocks";

/** Universal config-driven resume layout — themes + browser edits drive all visuals. */
export function UniversalLayout({ content, layout }: ResumeTemplateProps) {
  const { profile } = content;
  const styles = resolveStyleOptions(layout);
  const cssVars = layoutToCssVariables(layout);

  const showHeader =
    layout.showHeader &&
    hasProfileContent(profile) &&
    (profile.fullName || profile.headline || profile.email || profile.phone);

  const bodyStyle = {
    ...cssVars,
    fontFamily: cssVars["--resume-font-family"],
    fontSize: cssVars["--resume-font-size"],
    lineHeight: cssVars["--resume-line-height"],
  } as CSSProperties;

  if (layout.structure === "single-column") {
    return (
      <div
        className="config-layout universal-layout"
        style={{
          ...bodyStyle,
          padding: `${styles.pagePaddingIn}in`,
          color: layout.colors.mainText,
        }}
      >
        {showHeader && (
          <ProfileHeader
            profile={profile}
            layout={layout}
            style={styles.profileStyle}
          />
        )}
        <SectionBlocks content={content} layout={layout} variant="main" />
      </div>
    );
  }

  return (
    <div
      className="config-layout universal-layout flex min-h-full flex-1 flex-col"
      style={bodyStyle}
    >
      {showHeader && (
        <ProfileHeader
          profile={profile}
          layout={layout}
          style={styles.profileStyle}
        />
      )}
      <div
        className="config-body flex-1"
        style={{
          display: "grid",
          gridTemplateColumns: `${layout.sidebarWidthPercent}% 1fr`,
          gridTemplateRows: "1fr",
          alignItems: "stretch",
        }}
      >
        <aside
          className="config-sidebar px-6 py-6"
          style={{
            backgroundColor: layout.colors.sidebarBg,
            color: layout.colors.sidebarText,
            minHeight: "100%",
          }}
        >
          <SectionBlocks
            content={content}
            layout={layout}
            variant="sidebar"
          />
        </aside>
        <main
          className="config-main px-7 py-6"
          style={{ color: layout.colors.mainText }}
        >
          <SectionBlocks content={content} layout={layout} variant="main" />
        </main>
      </div>
    </div>
  );
}

export { UniversalLayout as ConfigurableNovoLayout };

function ProfileHeader({
  profile,
  layout,
  style,
}: {
  profile: ResumeTemplateProps["content"]["profile"];
  layout: ResumeTemplateProps["layout"];
  style: "banner" | "centered" | "minimal";
}) {
  const typo = resolveTypography(layout);
  const nameSize = `${typo.baseSizePt * 2.1}pt`;
  const subSize = `${typo.baseSizePt * 1.05}pt`;

  const contactBlock = (
    <div
      className="shrink-0 text-right leading-relaxed opacity-90"
      style={{ fontSize: subSize }}
    >
      {profile.email && <p>{profile.email}</p>}
      {profile.phone && <p>{profile.phone}</p>}
      {profile.location && <p>{profile.location}</p>}
      {profile.links.map((link) =>
        link.label && link.url ? (
          <p key={link.id}>
            <a href={link.url} className="underline decoration-current/40">
              {link.label}
            </a>
          </p>
        ) : null,
      )}
    </div>
  );

  if (style === "centered") {
    return (
      <header
        className="config-header border-b px-8 py-6 text-center"
        style={{
          borderColor: `${layout.colors.accent}33`,
          backgroundColor: layout.colors.headerBg,
        }}
      >
        {profile.fullName && (
          <h1
            className="font-bold leading-tight tracking-tight"
            style={{ fontSize: nameSize, color: layout.colors.headerText }}
          >
            {profile.fullName}
          </h1>
        )}
        {profile.headline && (
          <p
            className="mt-1 font-normal"
            style={{ fontSize: subSize, color: layout.colors.mainMuted }}
          >
            {profile.headline}
          </p>
        )}
        <div
          className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-center"
          style={{ fontSize: subSize, color: layout.colors.mainMuted }}
        >
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.location && <span>{profile.location}</span>}
        </div>
      </header>
    );
  }

  if (style === "minimal") {
    return (
      <header
        className="config-header border-b px-8 py-5"
        style={{
          borderColor: `${layout.colors.accent}22`,
          color: layout.colors.mainText,
        }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            {profile.fullName && (
              <h1
                className="font-bold leading-tight"
                style={{ fontSize: nameSize, color: layout.colors.accent }}
              >
                {profile.fullName}
              </h1>
            )}
            {profile.headline && (
              <p
                className="mt-0.5"
                style={{ fontSize: subSize, color: layout.colors.mainMuted }}
              >
                {profile.headline}
              </p>
            )}
          </div>
          {contactBlock}
        </div>
      </header>
    );
  }

  return (
    <header
      className="config-header px-8 py-6"
      style={{
        backgroundColor: layout.colors.headerBg,
        color: layout.colors.headerText,
      }}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          {profile.fullName && (
            <h1
              className="font-bold leading-tight tracking-tight"
              style={{ fontSize: nameSize }}
            >
              {profile.fullName}
            </h1>
          )}
          {profile.headline && (
            <p
              className="mt-1 font-normal opacity-85"
              style={{ fontSize: subSize }}
            >
              {profile.headline}
            </p>
          )}
        </div>
        {contactBlock}
      </div>
    </header>
  );
}
