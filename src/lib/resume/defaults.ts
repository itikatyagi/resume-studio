import { getThemeLayout } from "./themes";
import {
  resumeDocumentSchema,
  SCHEMA_VERSION,
  DEFAULT_TEMPLATE_ID,
  type ResumeContent,
  type ResumeDocument,
} from "./schema";

export function createResumeId(): string {
  return crypto.randomUUID();
}

function blankContent(): ResumeContent {
  return {
    profile: {
      fullName: "",
      email: "",
      headline: "",
      phone: "",
      location: "",
      links: [],
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    customSections: [],
  };
}

function baseDocument(
  title: string,
  content: ResumeContent,
  themeId = "novo-blue",
): ResumeDocument {
  const now = new Date().toISOString();
  return resumeDocumentSchema.parse({
    id: createResumeId(),
    schemaVersion: SCHEMA_VERSION,
    templateId: DEFAULT_TEMPLATE_ID,
    layoutConfig: getThemeLayout(themeId),
    meta: {
      title,
      createdAt: now,
      updatedAt: now,
    },
    content,
  });
}

export function createBlankResume(themeId = "novo-blue"): ResumeDocument {
  return baseDocument("Untitled Resume", blankContent(), themeId);
}

export function createSampleResume(): ResumeDocument {
  const expId1 = "a1111111-1111-4111-8111-111111111111";
  const expId2 = "a2222222-2222-4222-8222-222222222222";
  const eduId1 = "b1111111-1111-4111-8111-111111111111";
  const skillId1 = "c1111111-1111-4111-8111-111111111111";
  const skillId2 = "c2222222-2222-4222-8222-222222222222";
  const projId1 = "d1111111-1111-4111-8111-111111111111";
  const certId1 = "e1111111-1111-4111-8111-111111111111";
  const langId1 = "f1111111-1111-4111-8111-111111111111";
  const linkId1 = "01111111-1111-4111-8111-111111111111";

  return baseDocument("Sample Resume", {
    profile: {
      fullName: "Alex Morgan",
      email: "alex.morgan@email.com",
      headline: "Senior Software Engineer",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      links: [
        {
          id: linkId1,
          label: "LinkedIn",
          url: "https://linkedin.com/in/alexmorgan",
        },
      ],
    },
    summary:
      "Results-driven software engineer with 8+ years building scalable web applications. Passionate about clean architecture, developer experience, and shipping products that users love.",
    experience: [
      {
        id: expId1,
        order: 0,
        company: "TechFlow Inc.",
        title: "Senior Software Engineer",
        location: "San Francisco, CA",
        startDate: "2021-03",
        endDate: undefined,
        current: true,
        bullets: [
          "Led migration of monolith to microservices, reducing deployment time by 60%",
          "Architected real-time analytics dashboard serving 50K+ daily active users",
          "Mentored team of 4 junior engineers through code reviews and pair programming",
        ],
      },
      {
        id: expId2,
        order: 1,
        company: "DataPulse",
        title: "Software Engineer",
        location: "Remote",
        startDate: "2018-06",
        endDate: "2021-02",
        current: false,
        bullets: [
          "Built REST and GraphQL APIs in Node.js and PostgreSQL for B2B SaaS platform",
          "Implemented CI/CD pipeline with GitHub Actions, cutting release cycles from weekly to daily",
          "Collaborated with product and design on A/B tests that increased conversion by 18%",
        ],
      },
    ],
    education: [
      {
        id: eduId1,
        order: 0,
        institution: "University of California, Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        startDate: "2014",
        endDate: "2018",
        current: false,
        details: "Dean's List, GPA 3.7",
      },
    ],
    skills: [
      {
        id: skillId1,
        order: 0,
        groupName: "Languages",
        skills: ["TypeScript", "Python", "Go", "SQL"],
      },
      {
        id: skillId2,
        order: 1,
        groupName: "Frameworks & Tools",
        skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS"],
      },
    ],
    projects: [
      {
        id: projId1,
        order: 0,
        name: "OpenResume",
        url: "https://github.com/example/openresume",
        startDate: "2023",
        endDate: undefined,
        description: "Open-source resume builder with live preview",
        bullets: [
          "Built with Next.js and Zod schema validation",
          "500+ GitHub stars within first 3 months",
        ],
      },
    ],
    certifications: [
      {
        id: certId1,
        order: 0,
        name: "AWS Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2022-09",
      },
    ],
    languages: [
      {
        id: langId1,
        order: 0,
        language: "English",
        proficiency: "Native",
      },
    ],
    customSections: [],
  });
}
