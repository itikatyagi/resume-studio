type ProfileSectionProps = {
  content: Record<string, unknown>;
};

/** Step 0.5: implement profile layout */
export function ProfileSection({ content: _content }: ProfileSectionProps) {
  return (
    <section className="profile-section" aria-label="Profile">
      <p className="text-sm text-muted-foreground">Profile — template pending</p>
    </section>
  );
}
