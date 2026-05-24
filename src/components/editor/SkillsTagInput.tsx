"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

type SkillsTagInputProps = {
  skills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
};

export function SkillsTagInput({
  skills,
  onChange,
  placeholder = "Type a skill and press Enter",
}: SkillsTagInputProps) {
  const [draft, setDraft] = useState("");

  function addSkill(raw: string) {
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...skills];
    for (const part of parts) {
      if (!next.some((s) => s.toLowerCase() === part.toLowerCase())) {
        next.push(part);
      }
    }
    onChange(next);
    setDraft("");
  }

  function removeSkill(index: number) {
    onChange(skills.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="inline-flex items-center gap-1.5 rounded border border-zinc-300 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-800 shadow-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
                aria-label={`Remove ${skill}`}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addSkill(draft);
          } else if (e.key === "Backspace" && draft === "" && skills.length > 0) {
            removeSkill(skills.length - 1);
          }
        }}
        onBlur={() => {
          if (draft.trim()) addSkill(draft);
        }}
        placeholder={placeholder}
      />
      <p className="text-xs text-zinc-400">
        Press Enter or comma to add. Click × to remove.
      </p>
    </div>
  );
}
