"use client";

import Link from "next/link";
import { ResumeDocument } from "@/components/resume-template";
import { Button } from "@/components/ui/button";
import { createItikaSampleResume, createSampleResume } from "@/lib/resume/defaults";
import { THEME_LIST } from "@/lib/resume/themes";

function ItikaTemplateCard() {
  const document = createItikaSampleResume();

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border-2 border-red-500/30 bg-zinc-900/80 transition-colors hover:border-red-400/50">
      <div className="relative h-56 overflow-hidden bg-zinc-800">
        <div
          className="pointer-events-none absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.28]"
          style={{ width: "8.5in" }}
        >
          <ResumeDocument document={document} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-zinc-100">Professional Red</h3>
        <p className="mt-1 flex-1 text-sm text-zinc-400">
          Centered header, summary box, contact bar, experience left & skills right.
        </p>
        <Button asChild className="mt-4 w-full" size="sm">
          <Link href="/editor?theme=itika-pro">Use this theme</Link>
        </Button>
      </div>
    </article>
  );
}

function ThemePreviewCard({ themeId }: { themeId: string }) {
  const theme = THEME_LIST.find((t) => t.id === themeId)!;
  const document = {
    ...createSampleResume(),
    layoutConfig: theme.layout,
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/80 transition-colors hover:border-violet-500/40">
      <div className="relative h-56 overflow-hidden bg-zinc-800">
        <div
          className="pointer-events-none absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.28]"
          style={{ width: "8.5in" }}
        >
          <ResumeDocument document={document} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-zinc-100">{theme.name}</h3>
        <p className="mt-1 flex-1 text-sm text-zinc-400">{theme.description}</p>
        <Button asChild className="mt-4 w-full" size="sm">
          <Link href={`/editor?theme=${themeId}`}>Use this theme</Link>
        </Button>
      </div>
    </article>
  );
}

export function TemplateGallery() {
  return (
    <section className="border-t border-white/10 bg-zinc-900/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Pick a theme, customize everything
          </h2>
          <p className="mt-3 text-zinc-400">
            One universal template with 12+ themes. Change colors, fonts, layout,
            and section order in the editor — no code required.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ItikaTemplateCard />
          {THEME_LIST.map((t) => (
            <ThemePreviewCard key={t.id} themeId={t.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
