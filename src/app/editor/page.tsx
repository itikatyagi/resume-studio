import { ResumeEditor } from "@/components/editor/ResumeEditor";
import "@/styles/resume-print.css";

export const metadata = {
  title: "Editor — Resume Studio",
  description: "Build and export your resume",
};

export default function EditorPage() {
  return <ResumeEditor />;
}
