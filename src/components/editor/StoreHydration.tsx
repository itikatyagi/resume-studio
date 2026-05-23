"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/lib/resume/store";

export function StoreHydration({ children }: { children: React.ReactNode }) {
  const hydrated = useResumeStore((s) => s.hydrated);
  const loadPersisted = useResumeStore((s) => s.loadPersisted);

  useEffect(() => {
    loadPersisted();
  }, [loadPersisted]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
