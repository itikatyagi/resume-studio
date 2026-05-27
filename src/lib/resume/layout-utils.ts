import type {
  DensityMode,
  FontFamily,
  LayoutConfig,
  LayoutSectionId,
  Typography,
} from "./layout-schema";
import {
  DEFAULT_STYLE_OPTIONS,
  DEFAULT_TYPOGRAPHY,
  LAYOUT_SECTION_IDS,
  layoutConfigSchema,
} from "./layout-schema";

export const SECTION_LABELS: Record<LayoutSectionId, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  customSections: "Custom sections",
};
import { getDefaultLayoutForTemplate } from "./layout-presets";
import {
  getThemeLayout,
  LEGACY_TEMPLATE_TO_THEME,
  resolveThemeId,
} from "./themes";
import { TEMPLATE_IDS, type ResumeDocument, type TemplateId } from "./schema";

function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

export const FONT_STACKS: Record<FontFamily, string> = {
  inter: 'var(--font-sans), Inter, system-ui, sans-serif',
  roboto: 'var(--font-roboto), Roboto, "Segoe UI", system-ui, sans-serif',
  montserrat:
    'var(--font-montserrat), Montserrat, var(--font-sans), system-ui, sans-serif',
  georgia: 'Georgia, "Times New Roman", Times, serif',
  lato: '"Lato", var(--font-inter), system-ui, sans-serif',
  merriweather: 'var(--font-merriweather), Merriweather, Georgia, serif',
  "open-sans": '"Open Sans", var(--font-inter), system-ui, sans-serif',
};

export function resolveTypography(layout: LayoutConfig): Typography {
  return { ...DEFAULT_TYPOGRAPHY, ...layout.typography };
}

export function resolveStyleOptions(layout: LayoutConfig) {
  return {
    profileStyle: layout.profileStyle ?? DEFAULT_STYLE_OPTIONS.profileStyle,
    headingStyle: layout.headingStyle ?? DEFAULT_STYLE_OPTIONS.headingStyle,
    skillStyle: layout.skillStyle ?? DEFAULT_STYLE_OPTIONS.skillStyle,
    pagePaddingIn: layout.pagePaddingIn ?? DEFAULT_STYLE_OPTIONS.pagePaddingIn,
    density: layout.density ?? DEFAULT_STYLE_OPTIONS.density,
  };
}

export function resolvePagePaddingIn(layout: LayoutConfig): number {
  return resolveStyleOptions(layout).pagePaddingIn;
}

export function getEffectiveLayout(document: ResumeDocument): LayoutConfig {
  const templatePreset = getDefaultLayoutForTemplate(document.templateId);
  const themeId =
    document.layoutConfig?.themeId ??
    LEGACY_TEMPLATE_TO_THEME[document.templateId];
  const base = themeId ? getThemeLayout(themeId) : templatePreset;
  const overrides: Partial<LayoutConfig> = document.layoutConfig ?? {};

  const merged: LayoutConfig = {
    ...base,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...base.typography,
      ...overrides.typography,
    },
    profileStyle:
      overrides.profileStyle ??
      base.profileStyle ??
      DEFAULT_STYLE_OPTIONS.profileStyle,
    headingStyle:
      overrides.headingStyle ??
      base.headingStyle ??
      DEFAULT_STYLE_OPTIONS.headingStyle,
    skillStyle:
      overrides.skillStyle ?? base.skillStyle ?? DEFAULT_STYLE_OPTIONS.skillStyle,
    pagePaddingIn:
      overrides.pagePaddingIn ??
      base.pagePaddingIn ??
      DEFAULT_STYLE_OPTIONS.pagePaddingIn,
    density:
      overrides.density ?? base.density ?? DEFAULT_STYLE_OPTIONS.density,
    sidebarSections: overrides.sidebarSections ?? base.sidebarSections,
    mainSections: overrides.mainSections ?? base.mainSections,
  };

  return layoutConfigSchema.parse(merged);
}

const DENSITY_TOKENS: Record<
  DensityMode,
  {
    sectionGap: string;
    entryGap: string;
    bulletGap: string;
    skillGap: string;
    skillPaddingY: string;
    skillPaddingX: string;
    skillFontSize: string;
    sidebarPadding: string;
    mainPadding: string;
    itikaBodyPadding: string;
    itikaSectionGap: string;
    itikaBulletGap: string;
    itikaSkillPaddingY: string;
    itikaSkillPaddingX: string;
    itikaSkillFontSize: string;
  }
> = {
  comfortable: {
    sectionGap: "1.25rem",
    entryGap: "1rem",
    bulletGap: "0.125rem",
    skillGap: "0.375rem",
    skillPaddingY: "0.25rem",
    skillPaddingX: "0.5rem",
    skillFontSize: "0.9em",
    sidebarPadding: "1.5rem 1.35rem",
    mainPadding: "1.5rem 1.65rem",
    itikaBodyPadding: "0.75rem 0.5in 0.5in",
    itikaSectionGap: "1rem",
    itikaBulletGap: "0.3rem",
    itikaSkillPaddingY: "0.16rem",
    itikaSkillPaddingX: "0.38rem",
    itikaSkillFontSize: "8pt",
  },
  compact: {
    sectionGap: "0.85rem",
    entryGap: "0.65rem",
    bulletGap: "0.05rem",
    skillGap: "0.25rem",
    skillPaddingY: "0.18rem",
    skillPaddingX: "0.38rem",
    skillFontSize: "0.82em",
    sidebarPadding: "1.1rem 1rem",
    mainPadding: "1.1rem 1.2rem",
    itikaBodyPadding: "0.55rem 0.42in 0.38in",
    itikaSectionGap: "0.72rem",
    itikaBulletGap: "0.18rem",
    itikaSkillPaddingY: "0.12rem",
    itikaSkillPaddingX: "0.3rem",
    itikaSkillFontSize: "7.4pt",
  },
  tight: {
    sectionGap: "0.6rem",
    entryGap: "0.45rem",
    bulletGap: "0",
    skillGap: "0.18rem",
    skillPaddingY: "0.12rem",
    skillPaddingX: "0.3rem",
    skillFontSize: "0.76em",
    sidebarPadding: "0.85rem 0.8rem",
    mainPadding: "0.85rem 0.95rem",
    itikaBodyPadding: "0.42rem 0.34in 0.32in",
    itikaSectionGap: "0.52rem",
    itikaBulletGap: "0.1rem",
    itikaSkillPaddingY: "0.09rem",
    itikaSkillPaddingX: "0.25rem",
    itikaSkillFontSize: "6.9pt",
  },
};

export function layoutToCssVariables(
  layout: LayoutConfig,
): Record<string, string> {
  const typo = resolveTypography(layout);
  const density = resolveStyleOptions(layout).density;
  const tokens = DENSITY_TOKENS[density];
  return {
    "--resume-accent": layout.colors.accent,
    "--resume-header-bg": layout.colors.headerBg,
    "--resume-header-text": layout.colors.headerText,
    "--resume-sidebar-bg": layout.colors.sidebarBg,
    "--resume-sidebar-text": layout.colors.sidebarText,
    "--resume-main-text": layout.colors.mainText,
    "--resume-main-muted": layout.colors.mainMuted,
    "--resume-font-family": FONT_STACKS[typo.fontFamily],
    "--resume-font-size": `${typo.baseSizePt}pt`,
    "--resume-line-height": String(typo.lineHeight),
    "--resume-page-padding": `${resolvePagePaddingIn(layout)}in`,
    "--resume-sidebar-padding": tokens.sidebarPadding,
    "--resume-main-padding": tokens.mainPadding,
    "--resume-section-gap": tokens.sectionGap,
    "--resume-entry-gap": tokens.entryGap,
    "--resume-bullet-gap": tokens.bulletGap,
    "--resume-skill-gap": tokens.skillGap,
    "--resume-skill-padding-y": tokens.skillPaddingY,
    "--resume-skill-padding-x": tokens.skillPaddingX,
    "--resume-skill-font-size": tokens.skillFontSize,
    "--itika-body-padding": tokens.itikaBodyPadding,
    "--itika-section-gap": tokens.itikaSectionGap,
    "--itika-bullet-gap": tokens.itikaBulletGap,
    "--itika-skill-padding-y": tokens.itikaSkillPaddingY,
    "--itika-skill-padding-x": tokens.itikaSkillPaddingX,
    "--itika-skill-font-size": tokens.itikaSkillFontSize,
  };
}

export function applyThemeToDocument(
  document: ResumeDocument,
  themeId: string,
): ResumeDocument {
  return {
    ...document,
    templateId: "universal-v1",
    layoutConfig: getThemeLayout(themeId),
  };
}

export function applyTemplatePreset(
  document: ResumeDocument,
  templateOrThemeId: TemplateId | string,
): ResumeDocument {
  const themeId = resolveThemeId(templateOrThemeId);
  if (themeId) return applyThemeToDocument(document, themeId);

  if (isTemplateId(templateOrThemeId)) {
    return {
      ...document,
      templateId: "universal-v1",
      layoutConfig: getDefaultLayoutForTemplate(templateOrThemeId),
    };
  }

  return document;
}

export function moveSectionInList<T>(
  list: T[],
  index: number,
  dir: -1 | 1,
): T[] {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function getSectionColumn(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
): "sidebar" | "main" | "hidden" {
  if (layout.sidebarSections.includes(sectionId)) return "sidebar";
  if (layout.mainSections.includes(sectionId)) return "main";
  return "hidden";
}

export function setSectionColumn(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
  column: "sidebar" | "main" | "hidden",
): LayoutConfig {
  const sidebar = layout.sidebarSections.filter((s) => s !== sectionId);
  const main = layout.mainSections.filter((s) => s !== sectionId);
  if (column === "sidebar") sidebar.push(sectionId);
  if (column === "main") main.push(sectionId);
  return { ...layout, sidebarSections: sidebar, mainSections: main };
}

export function getHiddenLayoutSections(
  layout: LayoutConfig,
): LayoutSectionId[] {
  return LAYOUT_SECTION_IDS.filter(
    (id) =>
      !layout.sidebarSections.includes(id) &&
      !layout.mainSections.includes(id),
  );
}

/** Content editor order: sidebar (top→bottom), then main, then hidden. */
export function getContentEditorSectionOrder(
  layout: LayoutConfig,
): LayoutSectionId[] {
  const hidden = getHiddenLayoutSections(layout);
  if (layout.structure === "single-column") {
    return [...layout.mainSections, ...hidden];
  }
  return [...layout.sidebarSections, ...layout.mainSections, ...hidden];
}

export function moveLayoutSection(
  layout: LayoutConfig,
  sectionId: LayoutSectionId,
  dir: -1 | 1,
): Partial<LayoutConfig> | null {
  const column = getSectionColumn(layout, sectionId);
  if (column === "hidden") return null;
  const key =
    column === "sidebar" ? "sidebarSections" : "mainSections";
  const list = layout[key];
  const index = list.indexOf(sectionId);
  if (index < 0) return null;
  return { [key]: moveSectionInList(list, index, dir) };
}
