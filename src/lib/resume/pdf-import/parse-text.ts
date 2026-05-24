import { extractDateRange, normalizeDateToken } from "./date-utils";
import type {
  DraftEducation,
  DraftExperience,
  DraftProject,
  DraftResume,
} from "./types";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/;
const URL_RE = /https?:\/\/[^\s)]+/gi;
const BULLET_RE = /^[\s]*[•●▪◦\-–—*]\s+/;

type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages";

const SECTION_PATTERNS: { key: SectionKey; re: RegExp }[] = [
  { key: "summary", re: /^(professional\s+)?summary$/i },
  { key: "summary", re: /^about(\s+me)?$/i },
  { key: "summary", re: /^objective$/i },
  { key: "experience", re: /^(work\s+)?experience$/i },
  { key: "experience", re: /^employment(\s+history)?$/i },
  { key: "experience", re: /^professional\s+experience$/i },
  { key: "education", re: /^education$/i },
  { key: "education", re: /^academic(\s+background)?$/i },
  { key: "skills", re: /^(technical\s+)?skills$/i },
  { key: "skills", re: /^core\s+competencies$/i },
  { key: "projects", re: /^projects?$/i },
  { key: "projects", re: /^personal\s+projects$/i },
  { key: "certifications", re: /^certifications?$/i },
  { key: "certifications", re: /^licenses?(?:\s+(&|and)\s+certifications?)?$/i },
  { key: "languages", re: /^languages?$/i },
];

function normalizeLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, i, arr) => {
      if (!line) return false;
      if (i > 0 && !line && !arr[i - 1]) return false;
      return true;
    });
}

function isSectionHeader(line: string): SectionKey | null {
  const cleaned = line.replace(/[:\s]+$/, "").trim();
  for (const { key, re } of SECTION_PATTERNS) {
    if (re.test(cleaned)) return key;
  }
  return null;
}

function splitSections(lines: string[]): Map<SectionKey | "header", string[]> {
  const sections = new Map<SectionKey | "header", string[]>();
  let current: SectionKey | "header" = "header";

  for (const line of lines) {
    const section = isSectionHeader(line);
    if (section) {
      current = section;
      if (!sections.has(current)) sections.set(current, []);
      continue;
    }
    if (!sections.has(current)) sections.set(current, []);
    sections.get(current)!.push(line);
  }

  return sections;
}

function isBulletLine(line: string): boolean {
  return BULLET_RE.test(line);
}

function stripBullet(line: string): string {
  return line.replace(BULLET_RE, "").trim();
}

function splitTitleCompany(remainder: string): {
  title: string;
  company: string;
  location?: string;
} {
  const at = remainder.match(/^(.+?)\s+at\s+(.+)$/i);
  if (at) {
    return { title: at[1].trim(), company: at[2].trim() };
  }

  const pipe = remainder.split(/\s*\|\s*/);
  if (pipe.length >= 2) {
    return { title: pipe[0].trim(), company: pipe[1].trim() };
  }

  const dash = remainder.split(/\s+[–—-]\s+/);
  if (dash.length >= 2) {
    return { title: dash[0].trim(), company: dash[1].trim() };
  }

  const comma = remainder.split(/,\s+/);
  if (comma.length >= 2) {
    return {
      company: comma[0].trim(),
      title: comma.slice(1).join(", ").trim(),
    };
  }

  return { title: remainder, company: "" };
}

function parseExperienceBlock(block: string[]): DraftExperience | null {
  if (block.length === 0) return null;

  const first = block[0];
  const { start, end, current, remainder } = extractDateRange(first);
  const { title, company } = splitTitleCompany(remainder);

  const bullets: string[] = [];
  let location: string | undefined;

  for (let i = 1; i < block.length; i++) {
    const line = block[i];
    if (isBulletLine(line)) {
      bullets.push(stripBullet(line));
      continue;
    }
    if (!location && line.length < 60 && !line.includes(".")) {
      location = line;
      continue;
    }
    bullets.push(line);
  }

  if (!title && !company && bullets.length === 0) return null;

  return {
    title: title || company,
    company: company || title,
    location,
    startDate: start,
    endDate: end,
    current,
    bullets,
  };
}

function parseEducationBlock(block: string[]): DraftEducation | null {
  if (block.length === 0) return null;

  const first = block[0];
  const { start, end, current, remainder } = extractDateRange(first);
  const parts = remainder.split(/,\s*/);

  const institution = parts[0]?.trim() ?? "";
  const degree = parts.slice(1).join(", ").trim() || remainder;
  const details = block
    .slice(1)
    .map(stripBullet)
    .filter(Boolean)
    .join("\n");

  if (!institution && !degree) return null;

  return {
    institution: institution || degree,
    degree: degree || institution,
    startDate: start,
    endDate: end,
    current,
    details: details || undefined,
  };
}

function parseProjectBlock(block: string[]): DraftProject | null {
  if (block.length === 0) return null;

  const first = block[0];
  const { start, end, current, remainder } = extractDateRange(first);
  const urlMatch = remainder.match(URL_RE);
  const url = urlMatch?.[0];
  const name = remainder.replace(URL_RE, "").trim() || "Project";

  const bullets: string[] = [];
  let description: string | undefined;

  for (let i = 1; i < block.length; i++) {
    const line = block[i];
    if (isBulletLine(line)) {
      bullets.push(stripBullet(line));
    } else if (!description) {
      description = line;
    } else {
      bullets.push(line);
    }
  }

  return {
    name,
    url,
    startDate: start,
    endDate: end,
    current,
    description,
    bullets,
  };
}

function chunkBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    const { start } = extractDateRange(line);
    const looksLikeEntry =
      Boolean(start) ||
      (current.length === 0 && line.length > 0 && line.length < 120);

    if (looksLikeEntry && current.length > 0 && extractDateRange(line).start) {
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) blocks.push(current);
  return blocks;
}

function parseSkillLine(line: string): string[] {
  if (isBulletLine(line)) {
    return [stripBullet(line)];
  }

  const parts = line
    .split(/[,;|•]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return parts;
  }

  return line.trim() ? [line.trim()] : [];
}

function isSkillCategoryHeader(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || isBulletLine(line)) return false;
  if (trimmed.length > 45) return false;
  if (/[,;|•]/.test(trimmed)) return false;
  if (/\//.test(trimmed)) return false;
  if (/\([^)]*\)/.test(trimmed)) return false;
  if (trimmed.split(/\s+/).length > 5) return false;
  return /^[A-Za-z]/.test(trimmed);
}

function parseSkillsSection(lines: string[]): DraftResume["skills"] {
  const groups: DraftResume["skills"] = [];
  let current: DraftResume["skills"][number] | null = null;

  function ensureGroup(groupName?: string) {
    if (!current || (groupName && current.groupName !== groupName)) {
      current = { groupName, skills: [] };
      groups.push(current);
    }
  }

  for (const line of lines) {
    if (isSkillCategoryHeader(line)) {
      current = { groupName: line.trim(), skills: [] };
      groups.push(current);
      continue;
    }

    const items = parseSkillLine(line);
    if (items.length === 0) continue;

    ensureGroup();
    current!.skills.push(...items);
  }

  return groups.filter((group) => group.skills.length > 0);
}

function parseListSection(lines: string[]): string[] {
  const items: string[] = [];
  for (const line of lines) {
    items.push(...parseSkillLine(line));
  }
  return items;
}

function extractContact(lines: string[]): DraftResume["profile"] {
  const profile: DraftResume["profile"] = {
    fullName: "",
    email: "",
  };

  const text = lines.join("\n");
  const email = text.match(EMAIL_RE)?.[0];
  if (email) profile.email = email;

  const phone = text.match(PHONE_RE)?.[0];
  if (phone) profile.phone = phone.trim();

  const nonContact = lines.filter(
    (line) =>
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !URL_RE.test(line) &&
      line.length < 80,
  );

  if (nonContact[0] && !isSectionHeader(nonContact[0])) {
    profile.fullName = nonContact[0];
  }
  if (nonContact[1] && nonContact[1].includes(",")) {
    profile.location = nonContact[1];
  } else if (nonContact[1] && nonContact[1].length < 60) {
    profile.headline = nonContact[1];
  }

  return profile;
}

/** Heuristic parser: turns raw PDF text into a draft resume structure. */
export function parseResumeText(text: string): DraftResume {
  const lines = normalizeLines(text);
  const sections = splitSections(lines);

  const headerLines = sections.get("header") ?? [];
  const profile = extractContact(headerLines);

  const summaryLines = sections.get("summary") ?? [];
  const summary = summaryLines.join(" ").trim() || undefined;

  const experience: DraftExperience[] = [];
  for (const block of chunkBlocks(sections.get("experience") ?? [])) {
    const item = parseExperienceBlock(block);
    if (item) experience.push(item);
  }

  const education: DraftEducation[] = [];
  for (const block of chunkBlocks(sections.get("education") ?? [])) {
    const item = parseEducationBlock(block);
    if (item) education.push(item);
  }

  const projects: DraftProject[] = [];
  for (const block of chunkBlocks(sections.get("projects") ?? [])) {
    const item = parseProjectBlock(block);
    if (item) projects.push(item);
  }

  const skills = parseSkillsSection(sections.get("skills") ?? []);

  const certifications = parseListSection(sections.get("certifications") ?? []).map(
    (line) => {
      const { start, remainder } = extractDateRange(line);
      const parts = remainder.split(/[,-]\s*/);
      return {
        name: parts[0]?.trim() || line,
        issuer: parts[1]?.trim(),
        date: start ? normalizeDateToken(start) : undefined,
      };
    },
  );

  const languages = parseListSection(sections.get("languages") ?? []).map(
    (line) => {
      const dash = line.split(/\s*[-–—:]\s*/);
      return {
        name: dash[0]?.trim() || line,
        level: dash[1]?.trim(),
      };
    },
  );

  return {
    profile,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
  };
}
