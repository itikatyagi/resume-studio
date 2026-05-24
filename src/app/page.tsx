import Link from "next/link";
import { ArrowRight, Download, Eye, Shield, Sparkles, Zap } from "lucide-react";
import { HomeHeroActions } from "@/components/home/HomeHeroActions";
import { TemplateGallery } from "@/components/home/TemplateGallery";
import { Button } from "@/components/ui/button";

function ResumeMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-violet-500/20 via-blue-500/10 to-cyan-500/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-900/10">
        <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-amber-400" />
            <span className="size-2.5 rounded-full bg-emerald-400" />
          </div>
        </div>
        <div className="space-y-4 p-6 font-serif text-zinc-800">
          <div className="text-center">
            <div className="mx-auto h-3 w-32 rounded bg-zinc-900" />
            <div className="mx-auto mt-2 h-2 w-24 rounded bg-zinc-400" />
            <div className="mx-auto mt-3 h-1.5 w-40 rounded bg-zinc-200" />
          </div>
          <div>
            <div className="mb-2 h-2 w-16 rounded bg-zinc-300" />
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded bg-zinc-100" />
              <div className="h-1.5 w-11/12 rounded bg-zinc-100" />
            </div>
          </div>
          <div>
            <div className="mb-2 h-2 w-20 rounded bg-zinc-300" />
            <div className="space-y-3">
              <div>
                <div className="h-2 w-28 rounded bg-zinc-200" />
                <div className="mt-1.5 h-1.5 w-full rounded bg-zinc-100" />
                <div className="mt-1 h-1.5 w-4/5 rounded bg-zinc-100" />
              </div>
              <div>
                <div className="h-2 w-24 rounded bg-zinc-200" />
                <div className="mt-1.5 h-1.5 w-full rounded bg-zinc-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Eye,
    title: "Live preview",
    description:
      "See your resume update as you type — no guessing how it will look.",
  },
  {
    icon: Download,
    title: "One-click PDF",
    description:
      "Export a print-ready PDF straight from your browser. No account needed.",
  },
  {
    icon: Shield,
    title: "Private & local",
    description: "Your data stays in your browser. Nothing is sent to a server.",
  },
  {
    icon: Zap,
    title: "Fast & structured",
    description:
      "Guided sections for experience, skills, and more — no formatting headaches.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Resume Studio
          </Link>
          <nav className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              <Link href="/preview">Sample</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/editor">
                Open editor
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/40 via-zinc-950 to-zinc-950" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Sparkles className="size-3.5" />
              Free · No signup · Works offline
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build a resume that{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                gets noticed
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-zinc-400">
              Edit content and layout in the browser — colors, columns, and section
              placement. No code. Live preview and PDF export included.
            </p>
            <HomeHeroActions />
          </div>

          <ResumeMockup />
        </div>
      </section>

      <TemplateGallery />

      <section className="border-t border-white/10 bg-zinc-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mt-3 text-zinc-400">
              Focus on your content. We handle the layout.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-zinc-900/80 p-5 transition-colors hover:border-violet-500/30 hover:bg-zinc-900"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-semibold text-zinc-100">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Ready to create your resume?
          </h2>
          <p className="mt-3 text-zinc-400">
            Opens instantly in your browser. Your progress is saved automatically.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-8">
            <Link href="/editor">
              Open editor
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-zinc-500">
        Resume Studio — built for speed and privacy
      </footer>
    </div>
  );
}
