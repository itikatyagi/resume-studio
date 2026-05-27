import type { ResumeContent } from "./schema";

export type AtsIssueSeverity = "high" | "medium" | "low";

export type AtsIssue = {
  id: string;
  title: string;
  description: string;
  severity: AtsIssueSeverity;
  section?: string;
};

export type AtsCategoryScores = {
  contact: number;
  summary: number;
  experience: number;
  skills: number;
  education: number;
  formatting: number;
  impact: number;
};

export type AtsScoreResult = {
  score: number;
  maxScore: 100;
  grade: "Excellent" | "Good" | "Needs work" | "Weak";
  issues: AtsIssue[];
  strengths: string[];
  categoryScores: AtsCategoryScores;
};

export type JobMatchResult = {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
};

const ACTION_VERBS = new Set([
  "achieved",
  "architected",
  "automated",
  "built",
  "collaborated",
  "created",
  "delivered",
  "designed",
  "developed",
  "drove",
  "enhanced",
  "implemented",
  "improved",
  "increased",
  "launched",
  "led",
  "managed",
  "mentored",
  "migrated",
  "optimized",
  "owned",
  "reduced",
  "resolved",
  "scaled",
  "shipped",
  "streamlined",
]);

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "the",
  "to",
  "with",
  "you",
  "your",
]);

const TECH_TERMS = [
  ".net",
  "api",
  "apis",
  "aws",
  "azure",
  "ci/cd",
  "docker",
  "graphql",
  "javascript",
  "kubernetes",
  "node.js",
  "postgresql",
  "react",
  "redux",
  "sql",
  "typescript",
];

function hasText(value?: string): boolean {
  return Boolean(value?.trim());
}

function wordCount(value?: string): number {
  return value?.trim().split(/\s+/).filter(Boolean).length ?? 0;
}

function allBullets(content: ResumeContent): string[] {
  return [
    ...content.experience.flatMap((item) => item.bullets),
    ...content.projects.flatMap((item) => item.bullets),
  ].filter(hasText);
}

function countMetricBullets(bullets: string[]): number {
  return bullets.filter((bullet) =>
    /(?:\d+(?:[.,]\d+)?\s?(?:%|k|m|x|users?|customers?|accounts?|records?|engineers?|developers?|days?|weeks?|months?|years?)|\$\d+)/i.test(
      bullet,
    ),
  ).length;
}

function startsWithActionVerb(bullet: string): boolean {
  const first = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "");
  return Boolean(first && ACTION_VERBS.has(first));
}

function addIssue(
  issues: AtsIssue[],
  issue: Omit<AtsIssue, "id"> & { id?: string },
) {
  issues.push({
    id:
      issue.id ??
      `${issue.section ?? "resume"}-${issue.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    ...issue,
  });
}

function grade(score: number): AtsScoreResult["grade"] {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Weak";
}

function clampScore(value: number, max: number): number {
  return Math.max(0, Math.min(max, Math.round(value)));
}

function resumeText(content: ResumeContent): string {
  return [
    content.profile.fullName,
    content.profile.headline,
    content.profile.email,
    content.profile.phone,
    content.profile.location,
    ...content.profile.links.flatMap((link) => [link.label, link.url]),
    content.summary,
    ...content.experience.flatMap((item) => [
      item.title,
      item.company,
      item.projectName,
      item.location,
      ...item.bullets,
    ]),
    ...content.education.flatMap((item) => [
      item.degree,
      item.field,
      item.institution,
      item.details,
    ]),
    ...content.skills.flatMap((group) => [group.groupName, ...group.skills]),
    ...content.projects.flatMap((item) => [
      item.name,
      item.description,
      ...item.bullets,
    ]),
    ...content.certifications.flatMap((item) => [item.name, item.issuer]),
    ...content.languages.flatMap((item) => [item.language, item.proficiency]),
    ...content.customSections.flatMap((item) => [item.title, item.content]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function calculateAtsScore(content: ResumeContent): AtsScoreResult {
  const issues: AtsIssue[] = [];
  const strengths: string[] = [];
  const categoryScores: AtsCategoryScores = {
    contact: 0,
    summary: 0,
    experience: 0,
    skills: 0,
    education: 0,
    formatting: 0,
    impact: 0,
  };

  const profile = content.profile;
  if (hasText(profile.fullName)) categoryScores.contact += 4;
  else addIssue(issues, { title: "Add your full name", description: "ATS parsers expect a clear name at the top.", severity: "high", section: "Profile" });

  if (hasText(profile.email) && /\S+@\S+\.\S+/.test(profile.email)) categoryScores.contact += 4;
  else addIssue(issues, { title: "Add a valid email", description: "Recruiters need a reliable email address.", severity: "high", section: "Profile" });

  if (hasText(profile.phone)) categoryScores.contact += 3;
  else addIssue(issues, { title: "Add a phone number", description: "Many recruiters still screen candidates by phone.", severity: "medium", section: "Profile" });

  if (hasText(profile.location)) categoryScores.contact += 2;
  if (profile.links.some((link) => hasText(link.url) && link.url !== "https://")) {
    categoryScores.contact += 2;
    strengths.push("Profile includes at least one external link.");
  } else {
    addIssue(issues, { title: "Add LinkedIn or portfolio", description: "A LinkedIn, GitHub, or portfolio link improves recruiter confidence.", severity: "low", section: "Profile" });
  }

  const summaryWords = wordCount(content.summary);
  if (summaryWords > 0) categoryScores.summary += 5;
  else addIssue(issues, { title: "Add a professional summary", description: "A short summary helps ATS and recruiters classify your profile quickly.", severity: "medium", section: "Summary" });
  if (summaryWords >= 30 && summaryWords <= 90) categoryScores.summary += 3;
  else if (summaryWords > 0) addIssue(issues, { title: "Tune summary length", description: "Aim for 30-90 words: enough detail without becoming a long paragraph.", severity: "low", section: "Summary" });
  if (content.summary && /engineer|developer|manager|analyst|designer|architect|specialist|consultant/i.test(content.summary)) {
    categoryScores.summary += 2;
  }

  const experiences = content.experience.filter(
    (item) => hasText(item.title) || hasText(item.company) || item.bullets.some(hasText),
  );
  const bullets = allBullets(content);
  if (experiences.length > 0) categoryScores.experience += 5;
  else addIssue(issues, { title: "Add experience", description: "Experience is usually the highest-weight section for ATS ranking.", severity: "high", section: "Experience" });

  const completeJobs = experiences.filter(
    (item) => hasText(item.title) && hasText(item.company) && hasText(item.startDate),
  ).length;
  if (experiences.length > 0) {
    categoryScores.experience += (completeJobs / experiences.length) * 6;
  }
  if (completeJobs < experiences.length) {
    addIssue(issues, { title: "Complete job details", description: "Each role should include title, company, and dates.", severity: "medium", section: "Experience" });
  }

  if (bullets.length >= 3) categoryScores.experience += 6;
  else addIssue(issues, { title: "Add more achievement bullets", description: "Use 3-6 bullets for recent roles where possible.", severity: "medium", section: "Experience" });

  const actionVerbCount = bullets.filter(startsWithActionVerb).length;
  if (bullets.length > 0) categoryScores.experience += (actionVerbCount / bullets.length) * 4;
  if (bullets.length > 0 && actionVerbCount / bullets.length < 0.5) {
    addIssue(issues, { title: "Start bullets with action verbs", description: "Use verbs like Built, Led, Improved, Delivered, Optimized.", severity: "low", section: "Experience" });
  }

  const substantialBullets = bullets.filter((bullet) => wordCount(bullet) >= 8).length;
  if (bullets.length > 0) categoryScores.experience += (substantialBullets / bullets.length) * 4;

  const skillItems = content.skills.flatMap((group) => group.skills).filter(hasText);
  const uniqueSkills = new Set(skillItems.map((skill) => skill.trim().toLowerCase()));
  if (skillItems.length > 0) categoryScores.skills += 5;
  else addIssue(issues, { title: "Add skills", description: "ATS systems heavily rely on skills and keywords.", severity: "high", section: "Skills" });
  categoryScores.skills += Math.min(5, skillItems.length * 0.6);
  if (content.skills.filter((group) => group.skills.some(hasText)).length > 1) categoryScores.skills += 3;
  const text = resumeText(content);
  const repeatedSkills = [...uniqueSkills].filter((skill) => skill.length > 2 && text.includes(skill));
  if (uniqueSkills.size > 0) categoryScores.skills += (repeatedSkills.length / uniqueSkills.size) * 4;
  categoryScores.skills += skillItems.length === uniqueSkills.size ? 3 : 1;
  if (skillItems.length < 8) {
    addIssue(issues, { title: "Add more relevant skills", description: "Aim for at least 8-12 role-specific skills.", severity: "medium", section: "Skills" });
  }

  const education = content.education.filter(
    (item) => hasText(item.degree) || hasText(item.institution),
  );
  if (education.length > 0) categoryScores.education += 5;
  else addIssue(issues, { title: "Add education", description: "Include your highest relevant degree or certification path.", severity: "low", section: "Education" });
  if (education.some((item) => hasText(item.degree) && hasText(item.institution))) categoryScores.education += 3;
  if (education.some((item) => hasText(item.startDate) || hasText(item.endDate) || hasText(item.details))) categoryScores.education += 2;

  const standardSections = [
    experiences.length > 0,
    skillItems.length > 0,
    education.length > 0,
  ].filter(Boolean).length;
  categoryScores.formatting += standardSections;
  const emptySections = [
    content.experience.length > 0 && experiences.length === 0,
    content.education.length > 0 && education.length === 0,
    content.skills.length > 0 && skillItems.length === 0,
  ].filter(Boolean).length;
  categoryScores.formatting += emptySections === 0 ? 2 : 0;
  const totalWords = wordCount(text);
  categoryScores.formatting += totalWords >= 250 && totalWords <= 900 ? 3 : 1;
  const brokenLinks = profile.links.filter((link) => !hasText(link.url) || link.url === "https://").length;
  categoryScores.formatting += brokenLinks === 0 ? 2 : 0;
  if (brokenLinks > 0) {
    addIssue(issues, { title: "Remove empty links", description: "Blank or placeholder links can confuse parsers.", severity: "low", section: "Profile" });
  }

  const metricBullets = countMetricBullets(bullets);
  categoryScores.impact =
    metricBullets >= 6 ? 10 : metricBullets >= 3 ? 7 : metricBullets >= 1 ? 4 : 0;
  if (metricBullets >= 3) strengths.push("Resume includes measurable achievements.");
  else addIssue(issues, { title: "Add measurable impact", description: "Include numbers like %, revenue, users, accounts, time saved, or team size.", severity: "medium", section: "Experience" });

  if (experiences.length >= 2) strengths.push("Experience section has multiple roles.");
  if (skillItems.length >= 8) strengths.push("Skills section has enough keywords for matching.");
  if (summaryWords >= 30 && summaryWords <= 90) strengths.push("Summary length is ATS-friendly.");

  const bounded: AtsCategoryScores = {
    contact: clampScore(categoryScores.contact, 15),
    summary: clampScore(categoryScores.summary, 10),
    experience: clampScore(categoryScores.experience, 25),
    skills: clampScore(categoryScores.skills, 20),
    education: clampScore(categoryScores.education, 10),
    formatting: clampScore(categoryScores.formatting, 10),
    impact: clampScore(categoryScores.impact, 10),
  };

  const score = Object.values(bounded).reduce((sum, value) => sum + value, 0);

  return {
    score,
    maxScore: 100,
    grade: grade(score),
    issues: issues.sort((a, b) => severityRank(a.severity) - severityRank(b.severity)),
    strengths,
    categoryScores: bounded,
  };
}

function severityRank(severity: AtsIssueSeverity): number {
  return severity === "high" ? 0 : severity === "medium" ? 1 : 2;
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const terms = new Set<string>();

  for (const term of TECH_TERMS) {
    if (lower.includes(term)) terms.add(term);
  }

  lower
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
    .forEach((word) => terms.add(word));

  return [...terms].slice(0, 80);
}

export function calculateJobMatchScore(
  content: ResumeContent,
  jobDescription: string,
): JobMatchResult {
  const jdKeywords = extractKeywords(jobDescription);
  if (jdKeywords.length === 0) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: ["Paste a job description to calculate keyword match."],
    };
  }

  const text = resumeText(content);
  const matchedKeywords = jdKeywords.filter((keyword) => text.includes(keyword));
  const missingKeywords = jdKeywords.filter((keyword) => !text.includes(keyword));
  const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

  const suggestions =
    missingKeywords.length > 0
      ? [
          `Add relevant missing keywords if truthful: ${missingKeywords.slice(0, 6).join(", ")}.`,
          "Mirror important job-description wording in Skills and recent Experience bullets.",
        ]
      : ["Great keyword coverage for this job description."];

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    suggestions,
  };
}
