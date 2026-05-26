import type { LayoutConfig } from "./layout-schema";
import {
  createBaseLayout,
  NOVO_USER_LAYOUT,
  CLASSIC_LAYOUT,
  ITIKA_LAYOUT,
} from "./layout-presets";

export type ThemeDefinition = {
  id: string;
  name: string;
  description: string;
  category: "sidebar" | "single" | "modern";
  layout: LayoutConfig;
};

export const THEME_CATALOG: ThemeDefinition[] = [
  {
    id: "itika-pro",
    name: "Professional Red",
    description:
      "Centered header, summary box, contact bar, experience left & skills right",
    category: "modern",
    layout: structuredClone(ITIKA_LAYOUT),
  },
  {
    id: "novo-blue",
    name: "Professional Blue",
    description: "Novoresume-style sidebar with accent header",
    category: "sidebar",
    layout: structuredClone(NOVO_USER_LAYOUT),
  },
  {
    id: "classic-serif",
    name: "Classic Serif",
    description: "Traditional single-column layout",
    category: "single",
    layout: structuredClone(CLASSIC_LAYOUT),
  },
  {
    id: "modern-teal",
    name: "Modern Teal",
    description: "Fresh teal accent with light sidebar",
    category: "modern",
    layout: createBaseLayout({
      themeId: "modern-teal",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 34,
      typography: {
        fontFamily: "inter",
        baseSizePt: 10.5,
        lineHeight: 1.45,
      },
      profileStyle: "banner",
      headingStyle: "left-bar",
      skillStyle: "boxes",
      colors: {
        accent: "#0d9488",
        headerBg: "#0f766e",
        headerText: "#ffffff",
        sidebarBg: "#f0fdfa",
        sidebarText: "#334155",
        mainText: "#1e293b",
        mainMuted: "#64748b",
      },
      sidebarSections: ["skills", "languages", "education", "certifications"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "executive-navy",
    name: "Executive Navy",
    description: "Dark header with gold accents",
    category: "sidebar",
    layout: createBaseLayout({
      themeId: "executive-navy",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 38,
      typography: {
        fontFamily: "merriweather",
        baseSizePt: 10,
        lineHeight: 1.5,
      },
      profileStyle: "banner",
      headingStyle: "caps-plain",
      skillStyle: "boxes",
      colors: {
        accent: "#c9a227",
        headerBg: "#1e293b",
        headerText: "#f8fafc",
        sidebarBg: "#f1f5f9",
        sidebarText: "#334155",
        mainText: "#0f172a",
        mainMuted: "#64748b",
      },
      sidebarSections: ["skills", "certifications", "languages", "education"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    description: "Clean black & white, no sidebar",
    category: "single",
    layout: createBaseLayout({
      themeId: "minimal-mono",
      structure: "single-column",
      typography: {
        fontFamily: "inter",
        baseSizePt: 10,
        lineHeight: 1.5,
      },
      profileStyle: "minimal",
      headingStyle: "caps-plain",
      skillStyle: "comma",
      pagePaddingIn: 0.55,
      colors: {
        accent: "#18181b",
        headerBg: "#ffffff",
        headerText: "#18181b",
        sidebarBg: "#ffffff",
        sidebarText: "#3f3f46",
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
    }),
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    description: "Bold purple sidebar for creative roles",
    category: "modern",
    layout: createBaseLayout({
      themeId: "creative-purple",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 40,
      typography: {
        fontFamily: "lato",
        baseSizePt: 10.5,
        lineHeight: 1.45,
      },
      profileStyle: "banner",
      headingStyle: "underline",
      skillStyle: "dots",
      colors: {
        accent: "#7c3aed",
        headerBg: "#5b21b6",
        headerText: "#ffffff",
        sidebarBg: "#f5f3ff",
        sidebarText: "#4c1d95",
        mainText: "#1e1b4b",
        mainMuted: "#6b7280",
      },
      sidebarSections: ["skills", "languages", "projects", "certifications"],
      mainSections: ["summary", "experience", "education", "customSections"],
    }),
  },
  {
    id: "professional-green",
    name: "Professional Green",
    description: "Corporate green header and accents",
    category: "sidebar",
    layout: createBaseLayout({
      themeId: "professional-green",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 35,
      typography: {
        fontFamily: "roboto",
        baseSizePt: 10.5,
        lineHeight: 1.45,
      },
      profileStyle: "banner",
      headingStyle: "caps-bar",
      skillStyle: "boxes",
      colors: {
        accent: "#15803d",
        headerBg: "#166534",
        headerText: "#ffffff",
        sidebarBg: "#f0fdf4",
        sidebarText: "#14532d",
        mainText: "#052e16",
        mainMuted: "#4b5563",
      },
      sidebarSections: ["skills", "education", "languages", "certifications"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "compact-charcoal",
    name: "Compact Charcoal",
    description: "Narrow sidebar, dense layout",
    category: "sidebar",
    layout: createBaseLayout({
      themeId: "compact-charcoal",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 28,
      typography: {
        fontFamily: "open-sans",
        baseSizePt: 9.5,
        lineHeight: 1.4,
      },
      profileStyle: "banner",
      headingStyle: "caps-bar",
      skillStyle: "boxes",
      colors: {
        accent: "#374151",
        headerBg: "#111827",
        headerText: "#f9fafb",
        sidebarBg: "#f3f4f6",
        sidebarText: "#374151",
        mainText: "#111827",
        mainMuted: "#6b7280",
      },
      sidebarSections: ["skills", "languages", "certifications", "education"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "elegant-serif",
    name: "Elegant Serif",
    description: "Centered profile, refined typography",
    category: "single",
    layout: createBaseLayout({
      themeId: "elegant-serif",
      structure: "single-column",
      typography: {
        fontFamily: "merriweather",
        baseSizePt: 11,
        lineHeight: 1.55,
      },
      profileStyle: "centered",
      headingStyle: "underline",
      skillStyle: "comma",
      pagePaddingIn: 0.6,
      colors: {
        accent: "#78350f",
        headerBg: "#ffffff",
        headerText: "#292524",
        sidebarBg: "#ffffff",
        sidebarText: "#44403c",
        mainText: "#1c1917",
        mainMuted: "#78716c",
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
    }),
  },
  {
    id: "coral-modern",
    name: "Coral Modern",
    description: "Warm coral accent, skills-forward sidebar",
    category: "modern",
    layout: createBaseLayout({
      themeId: "coral-modern",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 36,
      typography: {
        fontFamily: "inter",
        baseSizePt: 10.5,
        lineHeight: 1.45,
      },
      profileStyle: "centered",
      headingStyle: "left-bar",
      skillStyle: "boxes",
      colors: {
        accent: "#ea580c",
        headerBg: "#fff7ed",
        headerText: "#9a3412",
        sidebarBg: "#ffedd5",
        sidebarText: "#7c2d12",
        mainText: "#431407",
        mainMuted: "#9a3412",
      },
      sidebarSections: ["skills", "languages", "certifications", "education"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "slate-minimal",
    name: "Slate Minimal",
    description: "Two-column without colored header",
    category: "sidebar",
    layout: createBaseLayout({
      themeId: "slate-minimal",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 32,
      showHeader: true,
      typography: {
        fontFamily: "inter",
        baseSizePt: 10,
        lineHeight: 1.5,
      },
      profileStyle: "minimal",
      headingStyle: "caps-plain",
      skillStyle: "dots",
      colors: {
        accent: "#475569",
        headerBg: "#ffffff",
        headerText: "#0f172a",
        sidebarBg: "#f8fafc",
        sidebarText: "#475569",
        mainText: "#0f172a",
        mainMuted: "#94a3b8",
      },
      sidebarSections: ["skills", "education", "languages", "certifications"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
  {
    id: "midnight-tech",
    name: "Midnight Tech",
    description: "Dark sidebar for tech & engineering",
    category: "modern",
    layout: createBaseLayout({
      themeId: "midnight-tech",
      structure: "header-sidebar-main",
      sidebarWidthPercent: 36,
      typography: {
        fontFamily: "roboto",
        baseSizePt: 10,
        lineHeight: 1.45,
      },
      profileStyle: "banner",
      headingStyle: "caps-bar",
      skillStyle: "boxes",
      colors: {
        accent: "#38bdf8",
        headerBg: "#0c4a6e",
        headerText: "#e0f2fe",
        sidebarBg: "#0f172a",
        sidebarText: "#cbd5e1",
        mainText: "#1e293b",
        mainMuted: "#64748b",
      },
      sidebarSections: ["skills", "languages", "certifications", "education"],
      mainSections: ["summary", "experience", "projects", "customSections"],
    }),
  },
];

export const THEME_MAP = Object.fromEntries(
  THEME_CATALOG.map((t) => [t.id, t]),
) as Record<string, ThemeDefinition>;

export const THEME_LIST = THEME_CATALOG;

export function getTheme(themeId: string): ThemeDefinition | undefined {
  return THEME_MAP[themeId];
}

export function isThemeId(value: string): boolean {
  return value in THEME_MAP;
}

export const LEGACY_TEMPLATE_TO_THEME: Record<string, string> = {
  "novo-15-v1": "novo-blue",
  "default-v1": "classic-serif",
  "universal-v1": "novo-blue",
  "itika-v1": "itika-pro",
};

export function resolveThemeId(themeOrTemplateId: string): string | undefined {
  if (isThemeId(themeOrTemplateId)) return themeOrTemplateId;
  return LEGACY_TEMPLATE_TO_THEME[themeOrTemplateId];
}

export function getThemeLayout(themeId: string): LayoutConfig {
  const theme = getTheme(themeId);
  if (theme) return structuredClone(theme.layout);
  return structuredClone(NOVO_USER_LAYOUT);
}
