import type { ResumeContent } from "@/lib/resume/schema";
import { hasProfileContent, joinContactParts } from "@/lib/resume/formatters";

type ProfileSectionProps = {
  content: ResumeContent;
};

export function ProfileSection({ content }: ProfileSectionProps) {
  const { profile } = content;
  if (!hasProfileContent(profile)) return null;

  const contactLine = joinContactParts([
    profile.email,
    profile.phone,
    profile.location,
  ]);

  const links = profile.links.filter((l) => l.label && l.url);

  return (
    <section className="profile-section mb-5 text-center" aria-label="Profile">
      {profile.fullName && (
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {profile.fullName}
        </h1>
      )}
      {profile.headline && (
        <p className="mt-1 text-sm text-zinc-600">{profile.headline}</p>
      )}
      {contactLine && (
        <p className="mt-2 text-xs text-zinc-600">{contactLine}</p>
      )}
      {links.length > 0 && (
        <p className="mt-1 text-xs text-zinc-600">
          {links.map((link, i) => (
            <span key={link.id}>
              {i > 0 && " · "}
              <a
                href={link.url}
                className="text-zinc-700 underline decoration-zinc-400 underline-offset-2"
              >
                {link.label}
              </a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
