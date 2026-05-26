"use client";

import { Fragment } from "react";
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
import type { LayoutSectionId } from "@/lib/resume/layout-schema";
import { moveOrderedItem, sortByOrder } from "@/lib/resume/formatters";
import { getContentEditorSectionOrder, getEffectiveLayout } from "@/lib/resume/layout-utils";
import { createId, nextOrder, useResumeStore } from "@/lib/resume/store";
import { EntryOrderActions } from "./EntryOrderActions";
import {
  CollapsibleEntry,
  CollapsibleSectionCard,
  useExpandedEntries,
} from "./EditorCollapsible";
import { SkillsTagInput } from "./SkillsTagInput";

function experienceEntryTitle(item: ExperienceItem): string {
  return item.title.trim() || "New role";
}

function experienceEntrySubtitle(item: ExperienceItem): string | undefined {
  const parts = [item.company, item.projectName?.trim()]
    .filter((p) => p && p.length > 0);
  return parts.length > 0 ? parts.join(" · ") : undefined;
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

function ItemActions({
  onRemove,
  orderIndex,
  orderTotal,
  onMove,
}: {
  onRemove: () => void;
  orderIndex?: number;
  orderTotal?: number;
  onMove?: (dir: -1 | 1) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {orderIndex !== undefined &&
      orderTotal !== undefined &&
      onMove ? (
        <EntryOrderActions
          index={orderIndex}
          total={orderTotal}
          onMove={onMove}
        />
      ) : (
        <span />
      )}
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
    <CollapsibleSectionCard title="Profile">
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
    </CollapsibleSectionCard>
  );
}

function ExperienceEditor() {
  const experience = useResumeStore((s) => s.document.content.experience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const sorted = sortByOrder(experience);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<ExperienceItem>) {
    updateExperience(
      experience.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(id: string) {
    updateExperience(experience.filter((item) => item.id !== id));
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateExperience(moveOrderedItem(experience, index, dir));
  }

  function addItem() {
    const item: ExperienceItem = {
      id: createId(),
      order: nextOrder(experience),
      company: "",
      title: "",
      projectName: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    onAddExpand(item.id);
    updateExperience([...experience, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Experience"
      count={experience.length}
      onAdd={addItem}
      addLabel="Add job"
    >
      {experience.length === 0 && (
        <p className="text-sm text-zinc-500">No experience entries yet.</p>
      )}
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={experienceEntryTitle(item)}
          subtitle={experienceEntrySubtitle(item)}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Job title">
              <Input
                value={item.title}
                onChange={(e) => updateItem(item.id, { title: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="Company">
              <Input
                value={item.company}
                onChange={(e) => updateItem(item.id, { company: e.target.value })}
              />
            </FieldRow>
          </div>
          <FieldRow label="Project name (optional)">
            <Input
              value={item.projectName ?? ""}
              onChange={(e) =>
                updateItem(item.id, { projectName: e.target.value })
              }
              placeholder="e.g. Payment platform migration"
            />
          </FieldRow>
          <FieldRow label="Location">
            <Input
              value={item.location ?? ""}
              onChange={(e) => updateItem(item.id, { location: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-3">
            <FieldRow label="Start date (YYYY or YYYY-MM)">
              <Input
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                placeholder="2020-01"
              />
            </FieldRow>
            <FieldRow label="End date">
              <Input
                value={item.endDate ?? ""}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
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
                    updateItem(item.id, {
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
            onChange={(bullets) => updateItem(item.id, { bullets })}
          />
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() => removeItem(item.id)}
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function EducationEditor() {
  const education = useResumeStore((s) => s.document.content.education);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const sorted = sortByOrder(education);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<EducationItem>) {
    updateEducation(
      education.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateEducation(moveOrderedItem(education, index, dir));
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
    onAddExpand(item.id);
    updateEducation([...education, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Education"
      count={education.length}
      onAdd={addItem}
      addLabel="Add school"
    >
      {education.length === 0 && (
        <p className="text-sm text-zinc-500">No education entries yet.</p>
      )}
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.institution.trim() || item.degree.trim() || "New school"}
          subtitle={[item.degree, item.field].filter(Boolean).join(" in ") || undefined}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <FieldRow label="Institution">
            <Input
              value={item.institution}
              onChange={(e) => updateItem(item.id, { institution: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Degree">
              <Input
                value={item.degree}
                onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                placeholder="B.S."
              />
            </FieldRow>
            <FieldRow label="Field of study">
              <Input
                value={item.field ?? ""}
                onChange={(e) => updateItem(item.id, { field: e.target.value })}
                placeholder="Computer Science"
              />
            </FieldRow>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Start date">
              <Input
                value={item.startDate ?? ""}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="End date">
              <Input
                value={item.endDate ?? ""}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
              />
            </FieldRow>
          </div>
          <FieldRow label="Details / location">
            <Input
              value={item.details ?? ""}
              onChange={(e) => updateItem(item.id, { details: e.target.value })}
              placeholder="GPA, honors, or location (e.g. India)"
            />
          </FieldRow>
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() =>
              updateEducation(education.filter((e) => e.id !== item.id))
            }
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function SkillsEditor() {
  const skills = useResumeStore((s) => s.document.content.skills);
  const updateSkills = useResumeStore((s) => s.updateSkills);
  const sorted = sortByOrder(skills);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<SkillEntry>) {
    updateSkills(
      skills.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateSkills(moveOrderedItem(skills, index, dir));
  }

  function addGroup() {
    const item: SkillEntry = {
      id: createId(),
      order: nextOrder(skills),
      groupName: "",
      skills: [],
    };
    onAddExpand(item.id);
    updateSkills([...skills, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Skills"
      count={skills.length}
      onAdd={addGroup}
      addLabel="Add group"
    >
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.groupName?.trim() || "Skill group"}
          subtitle={
            item.skills.length > 0
              ? `${item.skills.length} skill${item.skills.length === 1 ? "" : "s"}`
              : undefined
          }
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <FieldRow label="Group name (optional)">
            <Input
              value={item.groupName ?? ""}
              onChange={(e) => updateItem(item.id, { groupName: e.target.value })}
              placeholder="Languages"
            />
          </FieldRow>
          <FieldRow label="Skills">
            <SkillsTagInput
              skills={item.skills}
              onChange={(skillList) => updateItem(item.id, { skills: skillList })}
            />
          </FieldRow>
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() => updateSkills(skills.filter((e) => e.id !== item.id))}
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function ProjectsEditor() {
  const projects = useResumeStore((s) => s.document.content.projects);
  const updateProjects = useResumeStore((s) => s.updateProjects);
  const sorted = sortByOrder(projects);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<ProjectItem>) {
    updateProjects(
      projects.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateProjects(moveOrderedItem(projects, index, dir));
  }

  function addItem() {
    const item: ProjectItem = {
      id: createId(),
      order: nextOrder(projects),
      name: "",
      description: "",
      bullets: [],
    };
    onAddExpand(item.id);
    updateProjects([...projects, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Projects"
      count={projects.length}
      onAdd={addItem}
      addLabel="Add project"
    >
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.name.trim() || "New project"}
          subtitle={item.description?.trim() || undefined}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Project name">
              <Input
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="URL (optional)">
              <Input
                value={item.url ?? ""}
                onChange={(e) =>
                  updateItem(item.id, { url: e.target.value || undefined })
                }
                placeholder="https://"
              />
            </FieldRow>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <FieldRow label="Start date (YYYY or YYYY-MM)">
              <Input
                value={item.startDate ?? ""}
                onChange={(e) =>
                  updateItem(item.id, {
                    startDate: e.target.value || undefined,
                  })
                }
                placeholder="2022-01"
              />
            </FieldRow>
            <FieldRow label="End date">
              <Input
                value={item.endDate ?? ""}
                onChange={(e) =>
                  updateItem(item.id, {
                    endDate: e.target.value || undefined,
                  })
                }
                placeholder="2023-06"
                disabled={item.current}
              />
            </FieldRow>
            <FieldRow label="Ongoing project">
              <label className="flex items-center gap-2 pt-2 text-sm">
                <input
                  type="checkbox"
                  checked={item.current ?? false}
                  onChange={(e) =>
                    updateItem(item.id, {
                      current: e.target.checked,
                      endDate: e.target.checked ? undefined : item.endDate,
                    })
                  }
                />
                Present
              </label>
            </FieldRow>
          </div>
          <FieldRow label="Description">
            <Textarea
              value={item.description ?? ""}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              rows={2}
            />
          </FieldRow>
          <BulletsEditor
            bullets={item.bullets}
            onChange={(bullets) => updateItem(item.id, { bullets })}
          />
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() =>
              updateProjects(projects.filter((e) => e.id !== item.id))
            }
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function CertificationsEditor() {
  const certifications = useResumeStore(
    (s) => s.document.content.certifications,
  );
  const updateCertifications = useResumeStore((s) => s.updateCertifications);
  const sorted = sortByOrder(certifications);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<CertificationItem>) {
    updateCertifications(
      certifications.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateCertifications(moveOrderedItem(certifications, index, dir));
  }

  function addItem() {
    const item: CertificationItem = {
      id: createId(),
      order: nextOrder(certifications),
      name: "",
      issuer: "",
      date: "",
    };
    onAddExpand(item.id);
    updateCertifications([...certifications, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Certifications"
      count={certifications.length}
      onAdd={addItem}
      addLabel="Add"
    >
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.name.trim() || "New certification"}
          subtitle={item.issuer?.trim() || undefined}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <FieldRow label="Certification name">
            <Input
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
            />
          </FieldRow>
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldRow label="Issuer">
              <Input
                value={item.issuer ?? ""}
                onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
              />
            </FieldRow>
            <FieldRow label="Date">
              <Input
                value={item.date ?? ""}
                onChange={(e) => updateItem(item.id, { date: e.target.value })}
                placeholder="2022-09"
              />
            </FieldRow>
          </div>
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() =>
              updateCertifications(
                certifications.filter((e) => e.id !== item.id),
              )
            }
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function LanguagesEditor() {
  const languages = useResumeStore((s) => s.document.content.languages);
  const updateLanguages = useResumeStore((s) => s.updateLanguages);
  const sorted = sortByOrder(languages);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<LanguageItem>) {
    updateLanguages(
      languages.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateLanguages(moveOrderedItem(languages, index, dir));
  }

  function addItem() {
    const item: LanguageItem = {
      id: createId(),
      order: nextOrder(languages),
      language: "",
      proficiency: "",
    };
    onAddExpand(item.id);
    updateLanguages([...languages, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Languages"
      count={languages.length}
      onAdd={addItem}
      addLabel="Add"
    >
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.language.trim() || "New language"}
          subtitle={item.proficiency?.trim() || undefined}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <div className="grid gap-3 sm:grid-cols-2">
          <FieldRow label="Language">
            <Input
              value={item.language}
              onChange={(e) => updateItem(item.id, { language: e.target.value })}
            />
          </FieldRow>
          <FieldRow label="Proficiency">
            <Input
              value={item.proficiency ?? ""}
              onChange={(e) => updateItem(item.id, { proficiency: e.target.value })}
              placeholder="Native, Fluent, etc."
            />
          </FieldRow>
          <div className="sm:col-span-2">
            <ItemActions
              orderIndex={index}
              orderTotal={sorted.length}
              onMove={(dir) => moveItem(item.id, dir)}
              onRemove={() =>
                updateLanguages(languages.filter((e) => e.id !== item.id))
              }
            />
          </div>
          </div>
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function CustomSectionsEditor() {
  const customSections = useResumeStore((s) => s.document.content.customSections);
  const updateCustomSections = useResumeStore((s) => s.updateCustomSections);
  const sorted = sortByOrder(customSections);
  const entryIds = sorted.map((item) => item.id);
  const { isExpanded, toggle, onAddExpand } = useExpandedEntries(entryIds, {
    expandNewest: true,
  });

  function updateItem(id: string, patch: Partial<CustomSection>) {
    updateCustomSections(
      customSections.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }

  function moveItem(id: string, dir: -1 | 1) {
    const index = sorted.findIndex((item) => item.id === id);
    if (index < 0) return;
    updateCustomSections(moveOrderedItem(customSections, index, dir));
  }

  function addItem() {
    const item: CustomSection = {
      id: createId(),
      order: nextOrder(customSections),
      title: "Custom Section",
      content: "",
    };
    onAddExpand(item.id);
    updateCustomSections([...customSections, item]);
  }

  return (
    <CollapsibleSectionCard
      title="Custom sections"
      count={customSections.length}
      onAdd={addItem}
      addLabel="Add"
    >
      {sorted.map((item, index) => (
        <CollapsibleEntry
          key={item.id}
          title={item.title.trim() || "Custom section"}
          open={isExpanded(item.id)}
          onOpenChange={() => toggle(item.id)}
        >
          <FieldRow label="Section title">
            <Input
              value={item.title}
              onChange={(e) => updateItem(item.id, { title: e.target.value })}
            />
          </FieldRow>
          <FieldRow label="Content">
            <Textarea
              value={item.content}
              onChange={(e) => updateItem(item.id, { content: e.target.value })}
              rows={4}
            />
          </FieldRow>
          <ItemActions
            orderIndex={index}
            orderTotal={sorted.length}
            onMove={(dir) => moveItem(item.id, dir)}
            onRemove={() =>
              updateCustomSections(
                customSections.filter((e) => e.id !== item.id),
              )
            }
          />
        </CollapsibleEntry>
      ))}
    </CollapsibleSectionCard>
  );
}

function SummaryEditor() {
  const summary = useResumeStore((s) => s.document.content.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <CollapsibleSectionCard title="Summary">
      <Textarea
        value={summary ?? ""}
        onChange={(e) => updateSummary(e.target.value)}
        rows={4}
        placeholder="Brief professional summary…"
      />
    </CollapsibleSectionCard>
  );
}

const SECTION_EDITORS: Record<LayoutSectionId, () => React.ReactNode> = {
  summary: () => <SummaryEditor />,
  experience: () => <ExperienceEditor />,
  education: () => <EducationEditor />,
  skills: () => <SkillsEditor />,
  projects: () => <ProjectsEditor />,
  certifications: () => <CertificationsEditor />,
  languages: () => <LanguagesEditor />,
  customSections: () => <CustomSectionsEditor />,
};

export function EditorSections() {
  const document = useResumeStore((s) => s.document);
  const layout = getEffectiveLayout(document);
  const sectionOrder = getContentEditorSectionOrder(layout);

  return (
    <div className="space-y-4 pb-8">
      <ProfileEditor />
      {sectionOrder.map((sectionId) => (
        <Fragment key={sectionId}>{SECTION_EDITORS[sectionId]()}</Fragment>
      ))}
    </div>
  );
}
