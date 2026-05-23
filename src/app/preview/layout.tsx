import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview — Resume Studio",
  description: "Sample resume template preview",
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
