export type SocialNetwork = "instagram" | "facebook" | "linkedin";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

/** Public social profiles — single source of truth for UI + schema sameAs. */
export const socialLinks: readonly SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/helpinghands_agency/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61568900542643",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/helping-hands-agency-hilversum/",
  },
] as const;

/** Profile URLs for Organization / LocalBusiness `sameAs`. */
export function socialSameAs(): string[] {
  return socialLinks.map((link) => link.href);
}
