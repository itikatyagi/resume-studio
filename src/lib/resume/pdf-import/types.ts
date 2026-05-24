export type DraftExperience = {
  title: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
};

export type DraftEducation = {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  details?: string;
};

export type DraftProject = {
  name: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  bullets: string[];
};

export type DraftResume = {
  profile: {
    fullName: string;
    email: string;
    headline?: string;
    phone?: string;
    location?: string;
  };
  summary?: string;
  experience: DraftExperience[];
  education: DraftEducation[];
  skills: string[];
  projects: DraftProject[];
  certifications: { name: string; issuer?: string; date?: string }[];
  languages: { name: string; level?: string }[];
};
