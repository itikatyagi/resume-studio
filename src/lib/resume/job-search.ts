import type { ResumeContent } from "./schema";

export type JobCountryCode = "GLOBAL" | "GB" | "US" | "CA" | "IN" | "DE" | "AU";

export type JobBoardLink = {
  id: string;
  name: string;
  description: string;
  url: string;
};

export type JobSearchSuggestion = {
  role: string;
  location: string;
  country: JobCountryCode;
  countryLabel: string;
  skills: string[];
  query: string;
  links: JobBoardLink[];
};

export const JOB_COUNTRIES: Array<{ code: JobCountryCode; label: string }> = [
  { code: "GLOBAL", label: "Global / Remote" },
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "CA", label: "Canada" },
  { code: "IN", label: "India" },
  { code: "DE", label: "Germany" },
  { code: "AU", label: "Australia" },
];

const COUNTRY_LABELS = Object.fromEntries(
  JOB_COUNTRIES.map((item) => [item.code, item.label]),
) as Record<JobCountryCode, string>;

function hasText(value?: string): boolean {
  return Boolean(value?.trim());
}

function slug(value: string): string {
  return encodeURIComponent(value.trim().toLowerCase().replace(/\s+/g, "-"));
}

function compactQuery(parts: Array<string | undefined>, maxSkills = 5): string {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const part of parts) {
    const cleaned = part?.trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(cleaned);
    if (result.length >= maxSkills + 1) break;
  }

  return result.join(" ");
}

export function detectJobCountry(location?: string): JobCountryCode {
  const value = location?.toLowerCase() ?? "";

  if (/\b(uk|u\.k\.|united kingdom|england|scotland|wales|northern ireland|london|manchester|birmingham|leeds|glasgow|bristol|wembley)\b/.test(value)) {
    return "GB";
  }
  if (/\b(us|u\.s\.|usa|united states|new york|california|texas|san francisco|seattle|boston|chicago|austin)\b/.test(value)) {
    return "US";
  }
  if (/\b(canada|toronto|vancouver|ontario|montreal|calgary|ottawa)\b/.test(value)) {
    return "CA";
  }
  if (/\b(india|delhi|new delhi|bangalore|bengaluru|mumbai|hyderabad|pune|chennai|gurgaon|noida)\b/.test(value)) {
    return "IN";
  }
  if (/\b(germany|deutschland|berlin|munich|hamburg|frankfurt|cologne)\b/.test(value)) {
    return "DE";
  }
  if (/\b(australia|sydney|melbourne|brisbane|perth|adelaide)\b/.test(value)) {
    return "AU";
  }

  return "GLOBAL";
}

export function extractJobSearchSignals(content: ResumeContent) {
  const role =
    content.profile.headline?.trim() ||
    content.experience.find((item) => hasText(item.title))?.title.trim() ||
    "Software Engineer";

  const location = content.profile.location?.trim() ?? "";
  const skills = content.skills
    .flatMap((group) => group.skills)
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    role,
    location,
    skills,
    country: detectJobCountry(location),
  };
}

function linkedInUrl(query: string, location: string): string {
  const params = new URLSearchParams({ keywords: query });
  if (location) params.set("location", location);
  return `https://www.linkedin.com/jobs/search/?${params.toString()}`;
}

function googleJobsUrl(query: string, location: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(
    `${query} jobs ${location}`.trim(),
  )}`;
}

const INDEED_HOSTS: Record<JobCountryCode, string> = {
  GLOBAL: "www.indeed.com",
  GB: "uk.indeed.com",
  US: "www.indeed.com",
  CA: "ca.indeed.com",
  IN: "in.indeed.com",
  DE: "de.indeed.com",
  AU: "au.indeed.com",
};

function indeedUrl(query: string, location: string, country: JobCountryCode): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("l", location);
  return `https://${INDEED_HOSTS[country]}/jobs?${params.toString()}`;
}

function remoteOkUrl(query: string): string {
  return `https://remoteok.com/remote-${slug(query)}-jobs`;
}

function wellfoundUrl(query: string, location: string): string {
  const params = new URLSearchParams({ query });
  if (location) params.set("locations[]", location);
  return `https://wellfound.com/jobs?${params.toString()}`;
}

function reedUrl(query: string, location: string): string {
  const querySlug = slug(query);
  const locationSlug = location ? `-in-${slug(location)}` : "";
  return `https://www.reed.co.uk/jobs/${querySlug}-jobs${locationSlug}`;
}

function totaljobsUrl(query: string, location: string): string {
  const params = new URLSearchParams({ keywords: query });
  if (location) params.set("location", location);
  return `https://www.totaljobs.com/jobs?${params.toString()}`;
}

function cwJobsUrl(query: string, location: string): string {
  const params = new URLSearchParams({ keywords: query });
  if (location) params.set("location", location);
  return `https://www.cwjobs.co.uk/jobs?${params.toString()}`;
}

function diceUrl(query: string, location: string): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("location", location);
  return `https://www.dice.com/jobs?${params.toString()}`;
}

function builtInUrl(query: string, location: string): string {
  const base = location ? `https://builtin.com/jobs/${slug(location)}` : "https://builtin.com/jobs";
  return `${base}?search=${encodeURIComponent(query)}`;
}

function jobBankUrl(query: string, location: string): string {
  return `https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=${encodeURIComponent(
    query,
  )}&locationstring=${encodeURIComponent(location)}`;
}

function workopolisUrl(query: string, location: string): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("l", location);
  return `https://www.workopolis.com/jobsearch/jobs?${params.toString()}`;
}

function naukriUrl(query: string, location: string): string {
  const locationPath = location ? `-jobs-in-${slug(location)}` : "-jobs";
  return `https://www.naukri.com/${slug(query)}${locationPath}`;
}

function founditUrl(query: string, location: string): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("where", location);
  return `https://www.foundit.in/srp/results?${params.toString()}`;
}

function stepStoneUrl(query: string, location: string): string {
  const params = new URLSearchParams({ ke: query });
  if (location) params.set("ws", location);
  return `https://www.stepstone.de/jobs?${params.toString()}`;
}

function xingUrl(query: string, location: string): string {
  const params = new URLSearchParams({ keywords: query });
  if (location) params.set("location", location);
  return `https://www.xing.com/jobs/search?${params.toString()}`;
}

function seekUrl(query: string, location: string): string {
  const locationPath = location ? `-in-${slug(location)}` : "";
  return `https://www.seek.com.au/${slug(query)}-jobs${locationPath}`;
}

function joraUrl(query: string, location: string): string {
  const params = new URLSearchParams({ q: query });
  if (location) params.set("l", location);
  return `https://au.jora.com/jobs?${params.toString()}`;
}

function board(
  id: string,
  name: string,
  description: string,
  url: string,
): JobBoardLink {
  return { id, name, description, url };
}

export function buildJobBoardLinks({
  query,
  location,
  country,
  remoteOnly,
}: {
  query: string;
  location: string;
  country: JobCountryCode;
  remoteOnly?: boolean;
}): JobBoardLink[] {
  const effectiveQuery = remoteOnly ? `${query} remote` : query;
  const effectiveLocation = remoteOnly ? "Remote" : location;
  const globalBoards = [
    board("linkedin", "LinkedIn", "Large professional network", linkedInUrl(effectiveQuery, effectiveLocation)),
    board("google", "Google Jobs", "Broad search across job boards", googleJobsUrl(effectiveQuery, effectiveLocation)),
    board("indeed", "Indeed", "General job board", indeedUrl(effectiveQuery, effectiveLocation, country)),
    board("remoteok", "RemoteOK", "Remote-first jobs", remoteOkUrl(query)),
    board("wellfound", "Wellfound", "Startup jobs", wellfoundUrl(effectiveQuery, effectiveLocation)),
  ];

  if (remoteOnly || country === "GLOBAL") return globalBoards;

  const regional: Record<JobCountryCode, JobBoardLink[]> = {
    GLOBAL: [],
    GB: [
      board("reed", "Reed", "UK job board", reedUrl(query, location)),
      board("totaljobs", "Totaljobs", "UK roles across industries", totaljobsUrl(query, location)),
      board("cwjobs", "CWJobs", "UK tech roles", cwJobsUrl(query, location)),
    ],
    US: [
      board("dice", "Dice", "US tech jobs", diceUrl(query, location)),
      board("builtin", "Built In", "US startup and tech jobs", builtInUrl(query, location)),
    ],
    CA: [
      board("jobbank", "Job Bank", "Official Canada job board", jobBankUrl(query, location)),
      board("workopolis", "Workopolis", "Canadian jobs", workopolisUrl(query, location)),
    ],
    IN: [
      board("naukri", "Naukri", "India job board", naukriUrl(query, location)),
      board("foundit", "Foundit", "India and APAC jobs", founditUrl(query, location)),
    ],
    DE: [
      board("stepstone", "StepStone", "Germany job board", stepStoneUrl(query, location)),
      board("xing", "Xing Jobs", "German professional network", xingUrl(query, location)),
    ],
    AU: [
      board("seek", "Seek", "Australia job board", seekUrl(query, location)),
      board("jora", "Jora", "Australian jobs aggregator", joraUrl(query, location)),
    ],
  };

  return [...globalBoards, ...regional[country]];
}

export function suggestJobSearch(
  content: ResumeContent,
  overrides?: {
    query?: string;
    location?: string;
    country?: JobCountryCode;
    remoteOnly?: boolean;
  },
): JobSearchSuggestion {
  const signals = extractJobSearchSignals(content);
  const country = overrides?.country ?? signals.country;
  const location = overrides?.location ?? signals.location;
  const query =
    overrides?.query ??
    compactQuery([signals.role, ...signals.skills], 5) ??
    signals.role;

  return {
    role: signals.role,
    location,
    country,
    countryLabel: COUNTRY_LABELS[country],
    skills: signals.skills,
    query,
    links: buildJobBoardLinks({
      query,
      location,
      country,
      remoteOnly: overrides?.remoteOnly,
    }),
  };
}
