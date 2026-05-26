import type { Metadata } from "next";
import "@/styles/resume-print.css";
import "@/styles/itika-resume.css";

export const metadata: Metadata = {
  title: "Resume",
};

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="print-route min-h-screen bg-white">{children}</div>;
}
