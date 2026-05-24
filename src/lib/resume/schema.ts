import { z } from "zod";
import { layoutConfigSchema } from "./layout-schema";

export const SCHEMA_VERSION = 1 as const;

export const TEMPLATE_IDS = [
  "universal-v1",
  "novo-15-v1",
  "default-v1",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];
export const DEFAULT_TEMPLATE_ID: TemplateId = "universal-v1";

/** @deprecated use DEFAULT_TEMPLATE_ID */
export const TEMPLATE_ID = DEFAULT_TEMPLATE_ID;

export type SchemaVersion = typeof SCHEMA_VERSION;

/** YYYY or YYYY-MM */
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}(-\d{2})?$/, "Date must be YYYY or YYYY-MM");

export const linkSchema = z.object({
  id: z.string().uuid(),
  label: z.string(),
  url: z.string().url(),
});

export const profileSchema = z.object({
  fullName: z.string(),
  email: z.string().email().or(z.literal("")),
  headline: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  links: z.array(linkSchema).default([]),
});

export const experienceItemSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  company: z.string(),
  title: z.string(),
  location: z.string().optional(),
  startDate: dateStringSchema,
  endDate: dateStringSchema.optional(),
  current: z.boolean().optional(),
  bullets: z.array(z.string()).default([]),
});

export const educationItemSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  current: z.boolean().optional(),
  details: z.string().optional(),
});

export const skillEntrySchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  groupName: z.string().optional(),
  skills: z.array(z.string()),
});

export const projectItemSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  name: z.string(),
  url: z.string().url().optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).default([]),
});

export const certificationItemSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  name: z.string(),
  issuer: z.string().optional(),
  date: dateStringSchema.optional(),
});

export const languageItemSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  language: z.string(),
  proficiency: z.string().optional(),
});

export const customSectionSchema = z.object({
  id: z.string().uuid(),
  order: z.number(),
  title: z.string(),
  content: z.string(),
});

export const resumeContentSchema = z.object({
  profile: profileSchema,
  summary: z.string().optional(),
  experience: z.array(experienceItemSchema).default([]),
  education: z.array(educationItemSchema).default([]),
  skills: z.array(skillEntrySchema).default([]),
  projects: z.array(projectItemSchema).default([]),
  certifications: z.array(certificationItemSchema).default([]),
  languages: z.array(languageItemSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export const resumeMetaSchema = z.object({
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const resumeDocumentSchema = z.object({
  id: z.string().uuid(),
  schemaVersion: z.literal(SCHEMA_VERSION),
  templateId: z.enum(TEMPLATE_IDS),
  /** Browser-editable layout; defaults come from template preset */
  layoutConfig: layoutConfigSchema.optional(),
  meta: resumeMetaSchema,
  content: resumeContentSchema,
});

export type { LayoutConfig, LayoutSectionId } from "./layout-schema";

export type Link = z.infer<typeof linkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type SkillEntry = z.infer<typeof skillEntrySchema>;
export type ProjectItem = z.infer<typeof projectItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type LanguageItem = z.infer<typeof languageItemSchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type ResumeContent = z.infer<typeof resumeContentSchema>;
export type ResumeMeta = z.infer<typeof resumeMetaSchema>;
export type ResumeDocument = z.infer<typeof resumeDocumentSchema>;
