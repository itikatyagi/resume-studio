import type { LayoutConfig } from "./layout-schema";
import {
  DEFAULT_STYLE_OPTIONS,
  DEFAULT_TYPOGRAPHY,
} from "./layout-schema";

/**
 * Locked default for the user's Novoresume template
 * (https://novoresume.com/editor/resume/ace68500-5fe6-11ef-a2b4-2f978d0b172a)
 */
export const NOVO_USER_LAYOUT: LayoutConfig = {
  structure: "header-sidebar-main",
  sidebarWidthPercent: 36,
  showHeader: true,
  themeId: "novo-blue",
  typography: { ...DEFAULT_TYPOGRAPHY },
  profileStyle: "banner",
  headingStyle: "caps-bar",
  skillStyle: "boxes",
  pagePaddingIn: 0,
  colors: {
    accent: "#3b5169",
    headerBg: "#3b5169",
    headerText: "#ffffff",
    sidebarBg: "#eef1f4",
    sidebarText: "#444444",
    mainText: "#222222",
    mainMuted: "#888888",
  },
  sidebarSections: [
    "skills",
    "languages",
    "certifications",
    "education",
  ],
  mainSections: ["summary", "experience", "projects", "customSections"],
};

export const CLASSIC_LAYOUT: LayoutConfig = {
  structure: "single-column",
  sidebarWidthPercent: 36,
  showHeader: true,
  themeId: "classic-serif",
  typography: {
    fontFamily: "georgia",
    baseSizePt: 10.5,
    lineHeight: 1.4,
  },
  profileStyle: "centered",
  headingStyle: "underline",
  skillStyle: "comma",
  pagePaddingIn: 0.5,
  colors: {
    accent: "#18181b",
    headerBg: "#ffffff",
    headerText: "#18181b",
    sidebarBg: "#ffffff",
    sidebarText: "#444444",
    mainText: "#18181b",
    mainMuted: "#71717a",
  },
  sidebarSections: [],
  mainSections: [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "customSections",
  ],
};

/** Professional Red / Itika layout preset (generic renderer). */
export const ITIKA_LAYOUT: LayoutConfig = {
  structure: "header-sidebar-main",
  sidebarWidthPercent: 38,
  columnOrder: "main-sidebar",
  showHeader: true,
  themeId: "itika-pro",
  typography: {
    fontFamily: "montserrat",
    baseSizePt: 10,
    lineHeight: 1.38,
  },
  profileStyle: "itika",
  headingStyle: "caps-icon",
  skillStyle: "itika-pills",
  pagePaddingIn: 0,
  colors: {
    accent: "#b84a4a",
    headerBg: "#ffffff",
    headerText: "#1a1a1a",
    sidebarBg: "#ffffff",
    sidebarText: "#333333",
    mainText: "#1a1a1a",
    mainMuted: "#c93a3a",
  },
  sidebarSections: [
    "skills",
    "languages",
    "education",
    "certifications",
    "customSections",
  ],
  mainSections: ["experience", "projects"],
};

/** Legacy template id → default layout */
export const LEGACY_TEMPLATE_LAYOUTS: Record<string, LayoutConfig> = {
  "novo-15-v1": NOVO_USER_LAYOUT,
  "default-v1": CLASSIC_LAYOUT,
  "universal-v1": NOVO_USER_LAYOUT,
  "itika-v1": ITIKA_LAYOUT,
};

export function getDefaultLayoutForTemplate(templateId: string): LayoutConfig {
  const preset =
    LEGACY_TEMPLATE_LAYOUTS[templateId] ?? LEGACY_TEMPLATE_LAYOUTS["universal-v1"];
  return structuredClone(preset);
}

export function createBaseLayout(
  overrides: Partial<LayoutConfig>,
): LayoutConfig {
  const base = structuredClone(NOVO_USER_LAYOUT);
  return {
    ...base,
    ...DEFAULT_STYLE_OPTIONS,
    ...overrides,
    colors: { ...base.colors, ...overrides.colors },
    typography: {
      ...DEFAULT_TYPOGRAPHY,
      ...overrides.typography,
    },
    profileStyle:
      overrides.profileStyle ?? DEFAULT_STYLE_OPTIONS.profileStyle,
    headingStyle:
      overrides.headingStyle ?? DEFAULT_STYLE_OPTIONS.headingStyle,
    skillStyle: overrides.skillStyle ?? DEFAULT_STYLE_OPTIONS.skillStyle,
    pagePaddingIn:
      overrides.pagePaddingIn ?? DEFAULT_STYLE_OPTIONS.pagePaddingIn,
  };
}
