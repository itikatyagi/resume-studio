"use client";

import type { CSSProperties } from "react";
import { hasProfileContent, hasSummaryContent } from "@/lib/resume/formatters";
import { isItikaLayout } from "@/lib/resume/is-itika-layout";
import {
  layoutToCssVariables,
  resolvePagePaddingIn,
  resolveStyleOptions,
  resolveTypography,
} from "@/lib/resume/layout-utils";
import type { ResumeTemplateProps } from "../../types";
import { ItikaProfileHeader } from "../../itika-ui";
import { SectionBlocks } from "../../section-blocks";

/** Universal config-driven resume layout — themes + layoutConfig drive all visuals. */
export function UniversalLayout({ content, layout }: ResumeTemplateProps) {
  const { profile } = content;
  const styles = resolveStyleOptions(layout);
  const cssVars = layoutToCssVariables(layout);
  const itika = isItikaLayout(layout);
  const columnOrder = layout.columnOrder ?? "sidebar-main";
  const mainFirst = columnOrder === "main-sidebar";

  const showHeader =
    layout.showHeader &&
    hasProfileContent(profile) &&
    (profile.fullName ||
      profile.headline ||
      profile.email ||
      profile.phone ||
      (itika && hasSummaryContent(content.summary)));

  const bodyStyle = {
    ...cssVars,
    fontFamily: cssVars["--resume-font-family"],
    fontSize: cssVars["--resume-font-size"],
    lineHeight: cssVars["--resume-line-height"],
  } as CSSProperties;

  const pagePad = resolvePagePaddingIn(layout);
  const pagePadCss = `${pagePad}in`;

  if (layout.structure === "single-column") {
    return (
      <div
        className="config-layout universal-layout"
        style={{
          ...bodyStyle,
          padding: pagePadCss,
          color: layout.colors.mainText,
          boxSizing: "border-box",
        }}
      >
        {showHeader && (
          <ProfileHeader
            content={content}
            profile={profile}
            layout={layout}
            style={styles.profileStyle}
          />
        )}
        <SectionBlocks content={content} layout={layout} variant="main" />
      </div>
    );
  }

  const bodyPadStyle: CSSProperties | undefined =
    pagePad > 0
      ? {
          paddingLeft: pagePadCss,
          paddingRight: pagePadCss,
          paddingBottom: pagePadCss,
          boxSizing: "border-box",
        }
      : undefined;

  const gridColumns = itika
    ? "minmax(0, 1.58fr) minmax(0, 1fr)"
    : mainFirst
      ? `1fr ${layout.sidebarWidthPercent}%`
      : `${layout.sidebarWidthPercent}% 1fr`;

  const sidebarColumn = (
    <aside
      className="config-sidebar resume-sidebar"
      style={{
        backgroundColor: layout.colors.sidebarBg,
        color: layout.colors.sidebarText,
        minHeight: "100%",
      }}
    >
      <div className="resume-sidebar-inner">
        <SectionBlocks content={content} layout={layout} variant="sidebar" />
      </div>
    </aside>
  );

  const mainColumn = (
    <main
      className="config-main resume-main"
      style={{
        color: layout.colors.mainText,
      }}
    >
      <div className="resume-main-inner">
        <SectionBlocks content={content} layout={layout} variant="main" />
      </div>
    </main>
  );

  return (
    <div
      className={`config-layout universal-layout flex flex-col ${itika ? "itika-layout-root" : "min-h-full flex-1"}`}
      style={bodyStyle}
    >
      {showHeader && (
        <ProfileHeader
          content={content}
          profile={profile}
          layout={layout}
          style={styles.profileStyle}
        />
      )}
      <div
        className={`config-body ${itika ? "itika-body" : "flex-1"}`}
        style={{
          display: "grid",
          gridTemplateColumns: gridColumns,
          gridTemplateRows: "1fr",
          alignItems: "stretch",
          gap: itika ? "1.1rem" : undefined,
          padding: itika ? "0.75rem 0.5in 0.5in" : undefined,
          ...bodyPadStyle,
        }}
      >
        {mainFirst ? (
          <>
            {mainColumn}
            {sidebarColumn}
          </>
        ) : (
          <>
            {sidebarColumn}
            {mainColumn}
          </>
        )}
      </div>
    </div>
  );
}

export { UniversalLayout as ConfigurableNovoLayout };

function ProfileHeader({
  content,
  profile,
  layout,
  style,
}: {
  content: ResumeTemplateProps["content"];
  profile: ResumeTemplateProps["content"]["profile"];
  layout: ResumeTemplateProps["layout"];
  style: "banner" | "centered" | "minimal" | "itika";
}) {
  if (style === "itika") {
    return <ItikaProfileHeader content={content} layout={layout} />;
  }

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
