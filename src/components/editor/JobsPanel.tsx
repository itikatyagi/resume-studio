"use client";

import { useEffect, useMemo, useState } from "react";
import {
  JOB_COUNTRIES,
  suggestJobSearch,
  type JobCountryCode,
} from "@/lib/resume/job-search";
import { useResumeStore } from "@/lib/resume/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JobsPanel() {
  const content = useResumeStore((s) => s.document.content);
  const detected = useMemo(() => suggestJobSearch(content), [content]);

  const [query, setQuery] = useState(detected.query);
  const [location, setLocation] = useState(detected.location);
  const [country, setCountry] = useState<JobCountryCode>(detected.country);
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    setQuery(detected.query);
    setLocation(detected.location);
    setCountry(detected.country);
  }, [detected.query, detected.location, detected.country]);

  const suggestion = useMemo(
    () =>
      suggestJobSearch(content, {
        query,
        location,
        country,
        remoteOnly,
      }),
    [content, query, location, country, remoteOnly],
  );

  return (
    <div className="space-y-4 pb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Job Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
            <p>
              Detected role:{" "}
              <span className="font-medium text-zinc-900">{detected.role}</span>
            </p>
            <p>
              Detected market:{" "}
              <span className="font-medium text-zinc-900">
                {detected.countryLabel}
              </span>
            </p>
            {detected.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detected.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white px-2 py-1 text-xs text-zinc-700 ring-1 ring-zinc-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">Search query</Label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Senior Software Engineer React TypeScript"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="London, UK"
                disabled={remoteOnly}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Country / market</Label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value as JobCountryCode)}
                className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-2 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              >
                {JOB_COUNTRIES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
            />
            Remote only
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search Job Boards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestion.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">{link.name}</p>
                  <p className="text-xs text-zinc-500">{link.description}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-zinc-500">
                  Open
                </span>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-zinc-600">
          <p>
            This uses your resume headline, skills, and location to create job
            board searches. It does not scrape job sites or need an API key.
          </p>
          <p>
            For better results, keep your headline, location, and skills updated
            in the Content tab.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
