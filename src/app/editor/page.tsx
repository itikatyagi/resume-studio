import { Suspense } from "react";
import { EditorShell } from "@/components/editor/EditorShell";
import "@/styles/resume-print.css";
import "@/styles/itika-resume.css";

export const metadata = {
  title: "Editor — Resume Studio",
  description: "Build and export your resume",
};

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-zinc-500">
          Loading editor…
        </div>
      }
    >
      <EditorShell />
    </Suspense>
  );
}
