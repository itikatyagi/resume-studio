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
const URL_RE = /https?:\/\/[^\s)]+/i;
const LINK_RE =
  /(?:https?:\/\/|www\.|linkedin\.com|github\.com|gitlab\.com|portfolio\.|\.com\/|\.co\.uk\/)/i;
const BULLET_RE = /^[\s]*[•●▪◦\-–—*]\s+/;

type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "interests"
  | "organizations";

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
  { key: "interests", re: /^interests?$/i },
  { key: "interests", re: /^hobbies$/i },
  { key: "interests", re: /^activities$/i },
  { key: "organizations", re: /^organizations?$/i },
  { key: "organizations", re: /^companies$/i },
];

const PAGE_LABEL_RE = /^[-–—\s]*(?:page\s*)?\d+\s+of\s+\d+[-–—\s]*$/i;

const KNOWN_SKILLS = [
  "Azure Role-Based Access Control",
  "Azure DevOps",
  "Azure Active Directory",
  "Azure Container Apps",
  "Azure SQL Database",
  "React Testing Library",
  "Event Driven Architecture",
  "Azure Queue Storage",
  "Azure Blob Storage",
  "Azure Front Door",
  "Azure Service Bus",
  "Azure Logic Apps",
  "Azure Key Vaults",
  "Entityframework",
  "Entity Framework",
  "API Gateway",
  "Azure Cosmos DB",
  "Microservices",
  "TypeScript",
  "Kubernetes",
  "Terraform",
  "SonarQube",
  "Azure CDN",
  "MongoDB",
  "GraphQL",
  "Docker",
  "Angular",
  "Redux",
  "React",
  "LINQ",
  "Neo4j",
  "MySQL",
  "TSQL",
  "T-SQL",
  "Xunit",
  "XUnit",
  "MSTest",
  "TFS",
  "CI/CD",
  "TDD",
  "Jira",
  "Git",
  "C#",
  "S3",
  "AWS EC2",
  "Web APIs",
  "Azure Monitor",
  "Azure functions",
  "New Relic",
  ".NET / .NET Core",
  ".NET",
].sort((a, b) => b.length - a.length);

const ROLE_WORDS = new Set([
  "analyst",
  "architect",
  "consultant",
  "designer",
  "developer",
  "engineer",
  "lead",
  "manager",
  "principal",
  "specialist",
  "senior",
  "software",
]);

const LOCATION_WORDS = /\b(uk|united kingdom|england|london|wembley|greater london|india|usa|united states|canada|germany|australia|remote|hyderabad|pune|mumbai|bengaluru|bangalore|delhi|san francisco|new york|toronto|berlin|sydney)\b/i;

function normalizeLines(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, i, arr) => {
      if (!line) return false;
      if (PAGE_LABEL_RE.test(line)) return false;
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

function looksLikeName(line: string): boolean {
  const cleaned = line.trim();
  if (!cleaned || cleaned.length > 45) return false;
  if (isSectionHeader(cleaned)) return false;
  if (EMAIL_RE.test(cleaned) || PHONE_RE.test(cleaned) || URL_RE.test(cleaned)) return false;
  if (/\d|[/:@]/.test(cleaned)) return false;
  const words = cleaned.split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;
  if (words.every((word) => ROLE_WORDS.has(word.toLowerCase()))) return false;
  return words.every((word) => /^[A-Z][a-zA-Z'.-]+$/.test(word));
}

function looksLikeRoleHeadline(line: string): boolean {
  const cleaned = line.trim();
  if (!cleaned || cleaned.length > 70) return false;
  if (isSectionHeader(cleaned)) return false;
  if (EMAIL_RE.test(cleaned) || PHONE_RE.test(cleaned) || LINK_RE.test(cleaned)) {
    return false;
  }
  if (/[()]/.test(cleaned)) return false;
  const words = cleaned.toLowerCase().split(/\s+/);
  const roleWordCount = words.filter((word) =>
    ROLE_WORDS.has(word.replace(/[^a-z]/g, "")),
  ).length;
  return roleWordCount >= 2;
}

function looksLikeLocationLine(line: string): boolean {
  const cleaned = line.trim();
  if (!cleaned || cleaned.length > 90) return false;
  if (EMAIL_RE.test(cleaned) || PHONE_RE.test(cleaned) || LINK_RE.test(cleaned)) {
    return true;
  }
  return LOCATION_WORDS.test(cleaned) && !/\(\d{2}\/\d{4}/.test(cleaned);
}

function looksLikeOrganizationLine(line: string): boolean {
  const cleaned = line.trim();
  if (!cleaned || isNoiseLine(cleaned) || looksLikeLocationLine(cleaned)) return false;
  if (looksLikeRoleHeadline(cleaned)) return false;
  if (/[.!?]/.test(cleaned)) return false;
  if (/\(\d{2}\/\d{4}\s*[-–—]\s*(?:present|\d{2}\/\d{4})\)/i.test(cleaned)) {
    return true;
  }
  if (cleaned.length > 70) return false;
  return /\b(company|consulting|technologies|ltd|llc|inc|corp|corporation|limited|ibm)\b/i.test(cleaned);
}

function looksLikeSummaryLine(line: string): boolean {
  const cleaned = line.trim();
  if (!cleaned || cleaned.length < 25) return false;
  if (isNoiseLine(cleaned) || looksLikeOrganizationLine(cleaned)) return false;
  return /experience|architect|scalable|services|proven|performance|available|visa|mentor|developer|engineer|platform/i.test(
    cleaned,
  );
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

function looksLikeDateLine(line: string): boolean {
  const { start, remainder } = extractDateRange(line);
  return Boolean(start && remainder.length <= 40);
}

function isNoiseLine(line: string): boolean {
  return (
    PAGE_LABEL_RE.test(line) ||
    EMAIL_RE.test(line) ||
    PHONE_RE.test(line) ||
    LINK_RE.test(line) ||
    looksLikeName(line) ||
    isSectionHeader(line) !== null
  );
}

function parseRoleCompany(line: string): { title: string; company: string } {
  const normalized = line.trim();
  const comma = normalized.split(/,\s*/);
  if (comma.length >= 2) {
    return {
      title: comma[0].trim(),
      company: comma.slice(1).join(", ").trim(),
    };
  }
  return splitTitleCompany(normalized);
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

function createExperienceFromHeader(
  headerLines: string[],
  dateLine: string,
): DraftExperience | null {
  const parsedDate = extractDateRange(dateLine);
  const cleanHeader = headerLines
    .map(stripBullet)
    .map((line) => line.trim())
    .filter((line) => line && !isNoiseLine(line));

  if (parsedDate.remainder) cleanHeader.push(parsedDate.remainder);
  if (cleanHeader.length === 0) return null;

  const roleLine = cleanHeader[cleanHeader.length - 1] ?? "";
  const projectName =
    cleanHeader.length >= 2 ? cleanHeader[cleanHeader.length - 2] : undefined;
  const { title, company } = parseRoleCompany(roleLine);

  return {
    title: title || roleLine,
    company: company || "",
    projectName:
      projectName && projectName !== title && projectName !== company
        ? projectName
        : undefined,
    startDate: parsedDate.start,
    endDate: parsedDate.end,
    current: parsedDate.current,
    bullets: [],
  };
}

function parseExperienceSection(lines: string[]): DraftExperience[] {
  const entries: DraftExperience[] = [];
  let current: DraftExperience | null = null;
  let pendingHeader: string[] = [];
  let pendingAfterCurrent: string[] = [];

  function flushPendingAsBullets() {
    if (!current || pendingAfterCurrent.length === 0) return;
    current.bullets.push(...pendingAfterCurrent.map(stripBullet).filter(Boolean));
    pendingAfterCurrent = [];
  }

  for (const line of lines) {
    if (!line || isNoiseLine(line)) continue;

    if (looksLikeDateLine(line)) {
      const header =
        pendingAfterCurrent.length > 0
          ? pendingAfterCurrent.slice(-2)
          : pendingHeader;
      if (current && pendingAfterCurrent.length > 2) {
        current.bullets.push(
          ...pendingAfterCurrent.slice(0, -2).map(stripBullet).filter(Boolean),
        );
      }
      const next = createExperienceFromHeader(header, line);
      if (next) {
        current = next;
        entries.push(current);
      }
      pendingHeader = [];
      pendingAfterCurrent = [];
      continue;
    }

    if (isBulletLine(line)) {
      flushPendingAsBullets();
      if (current) current.bullets.push(stripBullet(line));
      else pendingHeader.push(stripBullet(line));
      continue;
    }

    if (current) {
      pendingAfterCurrent.push(line);
    } else {
      pendingHeader.push(line);
    }
  }

  flushPendingAsBullets();

  if (entries.length > 0) return entries;

  return chunkBlocks(lines)
    .map(parseExperienceBlock)
    .filter((item): item is DraftExperience => item !== null);
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

function createEducationFromLines(
  lines: string[],
  dateLine?: string,
): DraftEducation | null {
  const clean = lines
    .map(stripBullet)
    .map((line) => line.trim())
    .filter((line) => line && !isNoiseLine(line));

  const parsedDate = dateLine ? extractDateRange(dateLine) : undefined;
  if (parsedDate?.remainder) clean.push(parsedDate.remainder);
  if (clean.length === 0) return null;

  const degree = clean[0] ?? "Degree";
  const institution = clean[1] ?? clean[0] ?? "Institution";
  const details = clean.slice(2).join("\n");

  return {
    institution,
    degree,
    startDate: parsedDate?.start,
    endDate: parsedDate?.end,
    current: parsedDate?.current,
    details: details || undefined,
  };
}

function parseEducationSection(lines: string[]): DraftEducation[] {
  const education: DraftEducation[] = [];
  let pending: string[] = [];

  for (const line of lines) {
    if (!line || isNoiseLine(line)) continue;
    if (looksLikeDateLine(line)) {
      const item = createEducationFromLines(pending, line);
      if (item) education.push(item);
      pending = [];
      continue;
    }
    pending.push(line);
  }

  if (pending.length > 0) {
    const item = createEducationFromLines(pending);
    if (item) education.push(item);
  }

  if (education.length > 0) return education;

  return chunkBlocks(lines)
    .map(parseEducationBlock)
    .filter((item): item is DraftEducation => item !== null);
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

function parseCertificationsSection(
  lines: string[],
): DraftResume["certifications"] {
  const certifications: DraftResume["certifications"] = [];
  let current: DraftResume["certifications"][number] | null = null;

  for (const raw of lines) {
    const line = stripBullet(raw);
    if (!line || isNoiseLine(line)) continue;

    const { start, remainder } = extractDateRange(line);
    if (start && current) {
      current.date = start;
      if (remainder) current.issuer = current.issuer ?? remainder;
      current = null;
      continue;
    }

    const singleDate = normalizeDateToken(line);
    if (singleDate && current) {
      current.date = singleDate;
      current = null;
      continue;
    }

    if (!current) {
      current = { name: line };
      certifications.push(current);
    } else if (!current.issuer) {
      current.issuer = line;
    } else {
      current.name = `${current.name} ${line}`.trim();
    }
  }

  return certifications;
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

  const explicitParts = line
    .split(/[,;|•●▪◦*]|[\uE000-\uF8FF]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const extracted = explicitParts.flatMap(extractKnownSkills);
  if (extracted.length > 0) {
    return extracted;
  }

  if (explicitParts.length > 1) {
    return explicitParts;
  }

  return line.trim() ? [line.trim()] : [];
}

function extractKnownSkills(value: string): string[] {
  const lower = value.toLowerCase();
  const matches = KNOWN_SKILLS.filter((skill) =>
    lower.includes(skill.toLowerCase()),
  );

  if (matches.length <= 1) return matches;

  const selected: string[] = [];
  const occupied: Array<[number, number]> = [];

  for (const skill of matches) {
    const start = lower.indexOf(skill.toLowerCase());
    const end = start + skill.length;
    const overlaps = occupied.some(([a, b]) => start < b && end > a);
    if (!overlaps) {
      selected.push(skill);
      occupied.push([start, end]);
    }
  }

  return selected.sort(
    (a, b) => lower.indexOf(a.toLowerCase()) - lower.indexOf(b.toLowerCase()),
  );
}

function isSkillCategoryHeader(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || isBulletLine(line)) return false;
  if (extractKnownSkills(trimmed).length > 1) return false;
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
      !PAGE_LABEL_RE.test(line) &&
      !EMAIL_RE.test(line) &&
      !PHONE_RE.test(line) &&
      !LINK_RE.test(line) &&
      line.length < 80,
  );

  const emailIndex = lines.findIndex((line) => EMAIL_RE.test(line));
  const nearby =
    emailIndex >= 0
      ? lines.slice(Math.max(0, emailIndex - 8), Math.min(lines.length, emailIndex + 10))
      : lines;
  const nameCandidate = nearby.find(looksLikeName) ?? nonContact.find(looksLikeName);

  if (nameCandidate) {
    profile.fullName = nameCandidate;
  } else if (nonContact[0] && !isSectionHeader(nonContact[0])) {
    profile.fullName = nonContact[0];
  }

  const headlineCandidate =
    nearby.find(looksLikeRoleHeadline) ?? nonContact.find(looksLikeRoleHeadline);
  if (headlineCandidate) profile.headline = headlineCandidate;

  const locationCandidate = nonContact.find(
    (line) => looksLikeLocationLine(line) && line !== profile.fullName,
  );
  if (locationCandidate) {
    profile.location = locationCandidate;
  }

  return profile;
}

/** Heuristic parser: turns raw PDF text into a draft resume structure. */
export function parseResumeText(text: string): DraftResume {
  const lines = normalizeLines(text);
  const sections = splitSections(lines);

  const headerLines = sections.get("header") ?? [];
  const headerProfile = extractContact(headerLines);
  const globalProfile = extractContact(lines);
  const profile = {
    ...globalProfile,
    ...Object.fromEntries(
      Object.entries(headerProfile).filter(([, value]) => Boolean(value)),
    ),
  } as DraftResume["profile"];

  const summaryLines = sections.get("summary") ?? [];

  const experience = parseExperienceSection(sections.get("experience") ?? []);

  const education = parseEducationSection(sections.get("education") ?? []);

  const projects: DraftProject[] = [];
  for (const block of chunkBlocks(sections.get("projects") ?? [])) {
    const item = parseProjectBlock(block);
    if (item) projects.push(item);
  }

  const skills = parseSkillsSection(sections.get("skills") ?? []);

  const certifications = parseCertificationsSection(
    sections.get("certifications") ?? [],
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

  const interests = parseListSection(sections.get("interests") ?? []);
  const organizationSource = (sections.get("organizations") ?? [])
    .map(stripBullet)
    .filter(Boolean);
  const organizations = organizationSource.filter(looksLikeOrganizationLine);
  const leakedProfileLines = organizationSource.filter(
    (line) => !looksLikeOrganizationLine(line),
  );
  const leakedHeadline = leakedProfileLines.find(looksLikeRoleHeadline);
  if (!profile.headline && leakedHeadline) profile.headline = leakedHeadline;

  const leakedSummaryLines = leakedProfileLines.filter(
    (line) => line !== leakedHeadline && looksLikeSummaryLine(line),
  );
  const summary =
    summaryLines.join(" ").trim() ||
    leakedSummaryLines.join(" ").trim() ||
    undefined;
  const customSections =
    organizations.length > 0
      ? [
          {
            title: "Organizations",
            content: organizations.join("\n"),
          },
        ]
      : [];

  return {
    profile,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    interests,
    customSections,
  };
}
