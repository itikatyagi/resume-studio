"use client";

import { useMemo, useState } from "react";
import {
  calculateAtsScore,
  calculateJobMatchScore,
  type AtsCategoryScores,
  type AtsIssueSeverity,
} from "@/lib/resume/ats-score";
import { useResumeStore } from "@/lib/resume/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const CATEGORY_LABELS: Record<keyof AtsCategoryScores, { label: string; max: number }> = {
  contact: { label: "Contact", max: 15 },
  summary: { label: "Summary", max: 10 },
  experience: { label: "Experience", max: 25 },
  skills: { label: "Skills", max: 20 },
  education: { label: "Education", max: 10 },
  formatting: { label: "Formatting", max: 10 },
  impact: { label: "Impact", max: 10 },
};

function scoreTone(score: number): string {
  if (score >= 85) return "text-emerald-700";
  if (score >= 70) return "text-lime-700";
  if (score >= 50) return "text-amber-700";
  return "text-red-700";
}

function barTone(score: number): string {
  if (score >= 85) return "bg-emerald-500";
  if (score >= 70) return "bg-lime-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function issueTone(severity: AtsIssueSeverity): string {
  if (severity === "high") return "border-red-200 bg-red-50 text-red-800";
  if (severity === "medium") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

function CategoryRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-600">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className={`h-full rounded-full ${barTone(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function KeywordList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-zinc-500">{empty}</p>
      )}
    </div>
  );
}

export function AtsScorePanel() {
  const content = useResumeStore((s) => s.document.content);
  const [jobDescription, setJobDescription] = useState("");

  const score = useMemo(() => calculateAtsScore(content), [content]);
  const jobMatch = useMemo(
    () => calculateJobMatchScore(content, jobDescription),
    [content, jobDescription],
  );

  const topIssues = score.issues.slice(0, 6);

  return (
    <div className="space-y-4 pb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ATS Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-zinc-50 p-4 text-center">
            <p className={`text-5xl font-bold ${scoreTone(score.score)}`}>
              {score.score}
            </p>
            <p className="mt-1 text-sm text-zinc-500">out of 100</p>
            <p className="mt-2 text-sm font-medium text-zinc-800">
              {score.grade}
            </p>
          </div>

          <div className="space-y-3">
            {(Object.keys(CATEGORY_LABELS) as Array<keyof AtsCategoryScores>).map(
              (key) => (
                <CategoryRow
                  key={key}
                  label={CATEGORY_LABELS[key].label}
                  value={score.categoryScores[key]}
                  max={CATEGORY_LABELS[key].max}
                />
              ),
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Top Fixes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topIssues.length > 0 ? (
            topIssues.map((issue) => (
              <div
                key={issue.id}
                className={`rounded-lg border p-3 text-sm ${issueTone(issue.severity)}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{issue.title}</p>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] uppercase">
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs opacity-85">{issue.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-600">
              No major issues found. Fine tune for each job description next.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          {score.strengths.length > 0 ? (
            <ul className="list-disc space-y-1 pl-4 text-sm text-zinc-700">
              {score.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500">
              Add contact details, skills, experience bullets, and measurable
              impact to unlock strengths.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Job Description Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={7}
            placeholder="Paste a job description here to compare keywords..."
          />

          <div className="rounded-lg bg-zinc-50 p-3">
            <p className={`text-3xl font-bold ${scoreTone(jobMatch.score)}`}>
              {jobDescription.trim() ? `${jobMatch.score}%` : "--"}
            </p>
            <p className="text-xs text-zinc-500">keyword match</p>
          </div>

          <KeywordList
            title="Matched Keywords"
            items={jobMatch.matchedKeywords}
            empty="Paste a job description to see matches."
          />
          <KeywordList
            title="Missing Keywords"
            items={jobMatch.missingKeywords}
            empty="No missing keywords yet."
          />

          <div className="space-y-1 text-xs text-zinc-600">
            {jobMatch.suggestions.map((suggestion) => (
              <p key={suggestion}>{suggestion}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
