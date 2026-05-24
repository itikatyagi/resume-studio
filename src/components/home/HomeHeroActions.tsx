"use client";

import Link from "next/link";
import { FileText, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeHeroActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Button asChild size="lg" className="h-12 px-6">
        <Link href="/editor?theme=novo-blue">
          <FileText className="size-4" />
          Start building
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-12 border-white/20 bg-white/5 px-6 text-zinc-100 hover:bg-white/10 hover:text-white"
      >
        <Link href="/editor?import=1">
          <FileUp className="size-4" />
          Import resume
        </Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-12 border-white/20 bg-white/5 px-6 text-zinc-100 hover:bg-white/10 hover:text-white"
      >
        <Link href="/preview">View sample</Link>
      </Button>
    </div>
  );
}
