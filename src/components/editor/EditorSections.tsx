"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  CertificationItem,
  CustomSection,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  Link,
  ProjectItem,
  SkillEntry,
} from "@/lib/resume/schema";
import { createId, nextOrder, useResumeStore } from "@/lib/resume/store";

function SectionCard({
  title,
  children,
  onAdd,
  addLabel,
}: {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {onAdd && (
          <Button variant="outline" size="sm" onClick={onAdd}>
            <Plus className="size-4" />
            {addLabel ?? "Add"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-zinc-600">{label}</Label>
      {children}
    </div>
  );
}

function ItemActions({ onRemove }: { onRemove: () => void }) {
  return (
    <div className="flex justify-end">
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
        <Trash2 className="size-4" />
        Remove
      </Button>
    </div>
  );
}

function BulletsEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-zinc-600">Bullet points</Label>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            value={bullet}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = e.target.value;
              onChange(next);
            }}
            rows={2}
            placeholder="Describe an achievement or responsibility"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onChange(bullets.filter((_, j) => j !== i))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...bullets, ""])}
      >
        <Plus className="size-4" />
        Add bullet
      </Button>
    </div>
  );
}

function ProfileEditor() {
  const profile = useResumeStore((s) => s.document.content.profile);
  const updateProfile = useResumeStore((s) => s.updateProfile);

  function updateLink(index: number, patch: Partial<Link>) {
    const links = profile.links.map((l, i) =>
      i === index ? { ...l, ...patch } : l,
    );
    updateProfile({ links });
  }

  return (
    <SectionCard title="Profile">
      <FieldRow label="Full name">
        <Input
          value={profile.fullName}
          onChange={(e) => updateProfile({ fullName: e.target.value })}
          placeholder="Jane Doe"
        />
      </FieldRow>
      <FieldRow label="Headline">
        <Input
          value={profile.headline ?? ""}
          onChange={(e) => updateProfile({ headline: e.target.value })}
          placeholder="Software Engineer"
        />
      </FieldRow>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldRow label="Email">
          <Input
            type="email"
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
            placeholder="jane@email.com"
          />
        </FieldRow>
        <FieldRow label="Phone">
          <Input
            value={profile.phone ?? ""}
            onChange={(e) => updateProfile({ phone: e.target.value })}
            placeholder="(555) 000-0000"
          />
        </FieldRow>
      </div>
      <FieldRow label="Location">
        <Input
          value={profile.location ?? ""}
          onChange={(e) => updateProfile({ location: e.target.value })}
          placeholder="City, State"
        />
      </FieldRow>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-zinc-600">Links</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateProfile({
                links: [
                  ...profile.links,
                  { id: createId(), label: "", url: "https://" },
                ],
              })
            }
          >
            <Plus className="size-4" />
            Add link
          </Button>
        </div>
        {profile.links.map((link, i) => (
          <div key={link.id} className="grid gap-2 sm:grid-cols-2">
            <Input
              value={link.label}
              onChange={(e) => updateLink(i, { label: e.target.value })}
              placeholder="LinkedIn"
            />
            <div className="flex gap-2">
              <Input
                value={link.url}
                onChange={(e) => updateLink(i, { url: e.target.value })}
                placeholder="https://"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() =>
                  updateProfile({ links: profile.links.filter((_, j) => j !== i) })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ExperienceEditor() {
  const experience = useResumeStore((s) => s.document.content.experience);
  const updateExperience = useResumeStore((s) => s.updateExperience);

  function updateItem(index: number, patch: Partial<ExperienceItem>) {
    updateExperience(
      experience.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(index: number) {
    updateExperience(experience.filter((_, i) => i !== index));
  }

  function addItem() {
    const item: ExperienceItem = {
      id: createId(),
      order: nextOrder(experience),
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    updateExperience([...experience, item]);
  }

  return (
    <SectionCard title="Experience" onAdd={addItem} addLabel="Add job">
      {experience.length === 0 && (
        <p className="text-sm text-zinc-500">No experience entries yet.</p>
      )}
      {experience.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Job title">
              <Input
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="Company">
              <Input
                value={item.company}
                onChange={(e) => updateItem(index, { company: e.target.value })}
              />
            </FieldRow>
          </div>
          <FieldRow label="Location">
            <Input
              value={item.location ?? ""}
              onChange={(e) => updateItem(index, { location: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-3">
            <FieldRow label="Start date (YYYY or YYYY-MM)">
              <Input
                value={item.startDate}
                onChange={(e) => updateItem(index, { startDate: e.target.value })}
                placeholder="2020-01"
              />
            </FieldRow>
            <FieldRow label="End date">
              <Input
                value={item.endDate ?? ""}
                onChange={(e) => updateItem(index, { endDate: e.target.value })}
                placeholder="2023-06"
                disabled={item.current}
              />
            </FieldRow>
            <FieldRow label="Currently working here">
              <label className="flex items-center gap-2 pt-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.current ?? false}
                  onChange={(e) =>
                    updateItem(index, {
                      current: e.target.checked,
                      endDate: e.target.checked ? undefined : item.endDate,
                    })
                  }
                />
                Present
              </label>
            </FieldRow>
          </div>
          <BulletsEditor
            bullets={item.bullets}
            onChange={(bullets) => updateItem(index, { bullets })}
          />
          <ItemActions onRemove={() => removeItem(index)} />
        </div>
      ))}
    </SectionCard>
  );
}

function EducationEditor() {
  const education = useResumeStore((s) => s.document.content.education);
  const updateEducation = useResumeStore((s) => s.updateEducation);

  function updateItem(index: number, patch: Partial<EducationItem>) {
    updateEducation(
      education.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    const item: EducationItem = {
      id: createId(),
      order: nextOrder(education),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      current: false,
      details: "",
    };
    updateEducation([...education, item]);
  }

  return (
    <SectionCard title="Education" onAdd={addItem} addLabel="Add school">
      {education.length === 0 && (
        <p className="text-sm text-zinc-500">No education entries yet.</p>
      )}
      {education.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <FieldRow label="Institution">
            <Input
              value={item.institution}
              onChange={(e) => updateItem(index, { institution: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Degree">
              <Input
                value={item.degree}
                onChange={(e) => updateItem(index, { degree: e.target.value })}
                placeholder="B.S."
              />
            </FieldRow>
            <FieldRow label="Field of study">
              <Input
                value={item.field ?? ""}
                onChange={(e) => updateItem(index, { field: e.target.value })}
                placeholder="Computer Science"
              />
            </FieldRow>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Start date">
              <Input
                value={item.startDate ?? ""}
                onChange={(e) => updateItem(index, { startDate: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="End date">
              <Input
                value={item.endDate ?? ""}
                onChange={(e) => updateItem(index, { endDate: e.target.value })}
              />
            </FieldRow>
          </div>
          <FieldRow label="Details">
            <Input
              value={item.details ?? ""}
              onChange={(e) => updateItem(index, { details: e.target.value })}
              placeholder="GPA, honors, etc."
            />
          </FieldRow>
          <ItemActions
            onRemove={() =>
              updateEducation(education.filter((_, i) => i !== index))
            }
          />
        </div>
      ))}
    </SectionCard>
  );
}

function SkillsEditor() {
  const skills = useResumeStore((s) => s.document.content.skills);
  const updateSkills = useResumeStore((s) => s.updateSkills);

  function updateItem(index: number, patch: Partial<SkillEntry>) {
    updateSkills(
      skills.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addGroup() {
    const item: SkillEntry = {
      id: createId(),
      order: nextOrder(skills),
      groupName: "",
      skills: [],
    };
    updateSkills([...skills, item]);
  }

  return (
    <SectionCard title="Skills" onAdd={addGroup} addLabel="Add group">
      {skills.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <FieldRow label="Group name (optional)">
            <Input
              value={item.groupName ?? ""}
              onChange={(e) => updateItem(index, { groupName: e.target.value })}
              placeholder="Languages"
            />
          </FieldRow>
          <FieldRow label="Skills (comma-separated)">
            <Input
              value={item.skills.join(", ")}
              onChange={(e) =>
                updateItem(index, {
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="React, TypeScript, Node.js"
            />
          </FieldRow>
          <ItemActions
            onRemove={() =>
              updateSkills(skills.filter((_, i) => i !== index))
            }
          />
        </div>
      ))}
    </SectionCard>
  );
}

function ProjectsEditor() {
  const projects = useResumeStore((s) => s.document.content.projects);
  const updateProjects = useResumeStore((s) => s.updateProjects);

  function updateItem(index: number, patch: Partial<ProjectItem>) {
    updateProjects(
      projects.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    const item: ProjectItem = {
      id: createId(),
      order: nextOrder(projects),
      name: "",
      url: "",
      startDate: "",
      endDate: "",
      description: "",
      bullets: [],
    };
    updateProjects([...projects, item]);
  }

  return (
    <SectionCard title="Projects" onAdd={addItem} addLabel="Add project">
      {projects.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Project name">
              <Input
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="URL (optional)">
              <Input
                value={item.url ?? ""}
                onChange={(e) => updateItem(index, { url: e.target.value })}
                placeholder="https://"
              />
            </FieldRow>
          </div>
          <FieldRow label="Description">
            <Textarea
              value={item.description ?? ""}
              onChange={(e) => updateItem(index, { description: e.target.value })}
              rows={2}
            />
          </FieldRow>
          <BulletsEditor
            bullets={item.bullets}
            onChange={(bullets) => updateItem(index, { bullets })}
          />
          <ItemActions
            onRemove={() =>
              updateProjects(projects.filter((_, i) => i !== index))
            }
          />
        </div>
      ))}
    </SectionCard>
  );
}

function CertificationsEditor() {
  const certifications = useResumeStore(
    (s) => s.document.content.certifications,
  );
  const updateCertifications = useResumeStore((s) => s.updateCertifications);

  function updateItem(index: number, patch: Partial<CertificationItem>) {
    updateCertifications(
      certifications.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    const item: CertificationItem = {
      id: createId(),
      order: nextOrder(certifications),
      name: "",
      issuer: "",
      date: "",
    };
    updateCertifications([...certifications, item]);
  }

  return (
    <SectionCard title="Certifications" onAdd={addItem} addLabel="Add">
      {certifications.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <FieldRow label="Certification name">
            <Input
              value={item.name}
              onChange={(e) => updateItem(index, { name: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Issuer">
              <Input
                value={item.issuer ?? ""}
                onChange={(e) => updateItem(index, { issuer: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="Date">
              <Input
                value={item.date ?? ""}
                onChange={(e) => updateItem(index, { date: e.target.value })}
                placeholder="2022-09"
              />
            </FieldRow>
          </div>
          <ItemActions
            onRemove={() =>
              updateCertifications(
                certifications.filter((_, i) => i !== index),
              )
            }
          />
        </div>
      ))}
    </SectionCard>
  );
}

function LanguagesEditor() {
  const languages = useResumeStore((s) => s.document.content.languages);
  const updateLanguages = useResumeStore((s) => s.updateLanguages);

  function updateItem(index: number, patch: Partial<LanguageItem>) {
    updateLanguages(
      languages.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function addItem() {
    const item: LanguageItem = {
      id: createId(),
      order: nextOrder(languages),
      language: "",
      proficiency: "",
    };
    updateLanguages([...languages, item]);
  }

  return (
    <SectionCard title="Languages" onAdd={addItem} addLabel="Add">
      {languages.map((item, index) => (
        <div key={item.id} className="grid gap-3 sm:grid-cols-2">
          <FieldRow label="Language">
            <Input
              value={item.language}
              onChange={(e) => updateItem(index, { language: e.target.value })}
            />
          </FieldRow>
          <FieldRow label="Proficiency">
            <Input
              value={item.proficiency ?? ""}
              onChange={(e) => updateItem(index, { proficiency: e.target.value })}
              placeholder="Native, Fluent, etc."
            />
          </FieldRow>
          <div className="sm:col-span-2">
            <ItemActions
              onRemove={() =>
                updateLanguages(languages.filter((_, i) => i !== index))
              }
            />
          </div>
        </div>
      ))}
    </SectionCard>
  );
}

function CustomSectionsEditor() {
  const customSections = useResumeStore((s) => s.document.content.customSections);
  const updateCustomSections = useResumeStore((s) => s.updateCustomSections);

  function updateItem(index: number, patch: Partial<CustomSection>) {
    updateCustomSections(
      customSections.map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function addItem() {
    const item: CustomSection = {
      id: createId(),
      order: nextOrder(customSections),
      title: "Custom Section",
      content: "",
    };
    updateCustomSections([...customSections, item]);
  }

  return (
    <SectionCard title="Custom sections" onAdd={addItem} addLabel="Add">
      {customSections.map((item, index) => (
        <div key={item.id} className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <FieldRow label="Section title">
            <Input
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
            />
          </FieldRow>
          <FieldRow label="Content">
            <Textarea
              value={item.content}
              onChange={(e) => updateItem(index, { content: e.target.value })}
              rows={4}
            />
          </FieldRow>
          <ItemActions
            onRemove={() =>
              updateCustomSections(
                customSections.filter((_, i) => i !== index),
              )
            }
          />
        </div>
      ))}
    </SectionCard>
  );
}

function SummaryEditor() {
  const summary = useResumeStore((s) => s.document.content.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={summary ?? ""}
          onChange={(e) => updateSummary(e.target.value)}
          rows={4}
          placeholder="Brief professional summary…"
        />
      </CardContent>
    </Card>
  );
}

export function EditorSections() {
  return (
    <div className="space-y-4 pb-8">
      <ProfileEditor />
      <SummaryEditor />
      <ExperienceEditor />
      <EducationEditor />
      <SkillsEditor />
      <ProjectsEditor />
      <CertificationsEditor />
      <LanguagesEditor />
      <CustomSectionsEditor />
    </div>
  );
}
