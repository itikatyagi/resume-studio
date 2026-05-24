type SectionHeadingProps = {
  title: string;
};

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <h2 className="resume-section-heading mb-2 border-b border-zinc-300 pb-1 text-sm font-semibold uppercase tracking-wide text-zinc-800">
      {title}
    </h2>
  );
}
