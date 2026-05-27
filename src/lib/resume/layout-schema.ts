import { z } from "zod";

/** Resume sections that can be placed in sidebar or main column */
export const LAYOUT_SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "customSections",
] as const;

export type LayoutSectionId = (typeof LAYOUT_SECTION_IDS)[number];

export const layoutStructureSchema = z.enum([
  "header-sidebar-main",
  "single-column",
]);

export type LayoutStructure = z.infer<typeof layoutStructureSchema>;

export const FONT_FAMILIES = [
  "inter",
  "roboto",
  "montserrat",
  "georgia",
  "lato",
  "merriweather",
  "open-sans",
] as const;

export type FontFamily = (typeof FONT_FAMILIES)[number];

export const PROFILE_STYLES = ["banner", "centered", "minimal", "itika"] as const;
export type ProfileStyle = (typeof PROFILE_STYLES)[number];

export const HEADING_STYLES = [
  "caps-bar",
  "underline",
  "caps-plain",
  "left-bar",
  "caps-icon",
] as const;
export type HeadingStyle = (typeof HEADING_STYLES)[number];

export const SKILL_STYLES = ["boxes", "comma", "dots", "itika-pills"] as const;
export type SkillStyle = (typeof SKILL_STYLES)[number];

export const COLUMN_ORDERS = ["sidebar-main", "main-sidebar"] as const;
export type ColumnOrder = (typeof COLUMN_ORDERS)[number];

export const DENSITY_MODES = ["comfortable", "compact", "tight"] as const;
export type DensityMode = (typeof DENSITY_MODES)[number];

export const layoutColorsSchema = z.object({
  accent: z.string(),
  headerBg: z.string(),
  headerText: z.string(),
  sidebarBg: z.string(),
  sidebarText: z.string(),
  mainText: z.string(),
  mainMuted: z.string(),
});

export const typographySchema = z.object({
  fontFamily: z.enum(FONT_FAMILIES),
  baseSizePt: z.number().min(8.5).max(12),
  lineHeight: z.number().min(1.15).max(1.7),
});

export const layoutConfigSchema = z.object({
  structure: layoutStructureSchema,
  sidebarWidthPercent: z.number().min(24).max(48),
  showHeader: z.boolean(),
  colors: layoutColorsSchema,
  sidebarSections: z.array(z.enum(LAYOUT_SECTION_IDS)),
  mainSections: z.array(z.enum(LAYOUT_SECTION_IDS)),
  themeId: z.string().optional(),
  typography: typographySchema.optional(),
  profileStyle: z.enum(PROFILE_STYLES).optional(),
  headingStyle: z.enum(HEADING_STYLES).optional(),
  skillStyle: z.enum(SKILL_STYLES).optional(),
  pagePaddingIn: z.number().min(0).max(1).optional(),
  columnOrder: z.enum(COLUMN_ORDERS).optional(),
  density: z.enum(DENSITY_MODES).optional(),
});

export type LayoutColors = z.infer<typeof layoutColorsSchema>;
export type Typography = z.infer<typeof typographySchema>;
export type LayoutConfig = z.infer<typeof layoutConfigSchema>;

export const DEFAULT_TYPOGRAPHY: Typography = {
  fontFamily: "roboto",
  baseSizePt: 10.5,
  lineHeight: 1.45,
};

export const DEFAULT_STYLE_OPTIONS = {
  profileStyle: "banner" as ProfileStyle,
  headingStyle: "caps-bar" as HeadingStyle,
  skillStyle: "boxes" as SkillStyle,
  pagePaddingIn: 0.5,
  density: "comfortable" as DensityMode,
};
