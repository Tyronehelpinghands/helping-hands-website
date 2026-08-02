import { socialLinks, type SocialNetwork } from "@/lib/social";

type SocialLinksProps = {
  className?: string;
  /** Icon button styling: footer (on navy) vs light surfaces. */
  variant?: "footer" | "light";
};

function SocialIcon({
  network,
  className,
}: {
  network: SocialNetwork;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
    className: className ?? "h-5 w-5",
  };

  switch (network) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24Zm6.12-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM12 4.32c-2.1 0-2.36.01-3.19.05-.82.04-1.38.17-1.87.36a3.78 3.78 0 0 0-1.37.89 3.78 3.78 0 0 0-.89 1.37c-.19.49-.32 1.05-.36 1.87-.04.83-.05 1.09-.05 3.19s.01 2.36.05 3.19c.04.82.17 1.38.36 1.87.2.51.46.94.89 1.37.43.43.86.69 1.37.89.49.19 1.05.32 1.87.36.83.04 1.09.05 3.19.05s2.36-.01 3.19-.05c.82-.04 1.38-.17 1.87-.36a3.78 3.78 0 0 0 1.37-.89 3.78 3.78 0 0 0 .89-1.37c.19-.49.32-1.05.36-1.87.04-.83.05-1.09.05-3.19s-.01-2.36-.05-3.19c-.04-.82-.17-1.38-.36-1.87a3.78 3.78 0 0 0-.89-1.37 3.78 3.78 0 0 0-1.37-.89c-.49-.19-1.05-.32-1.87-.36-.83-.04-1.09-.05-3.19-.05Zm0 1.52c2.06 0 2.31.01 3.12.05.75.03 1.16.16 1.43.27.36.14.62.31.89.58.27.27.44.53.58.89.11.27.24.68.27 1.43.04.81.05 1.06.05 3.12s-.01 2.31-.05 3.12c-.03.75-.16 1.16-.27 1.43-.14.36-.31.62-.58.89-.27.27-.53.44-.89.58-.27.11-.68.24-1.43.27-.81.04-1.06.05-3.12.05s-2.31-.01-3.12-.05c-.75-.03-1.16-.16-1.43-.27a2.4 2.4 0 0 1-.89-.58 2.4 2.4 0 0 1-.58-.89c-.11-.27-.24-.68-.27-1.43-.04-.81-.05-1.06-.05-3.12s.01-2.31.05-3.12c.03-.75.16-1.16.27-1.43.14-.36.31-.62.58-.89.27-.27.53-.44.89-.58.27-.11.68-.24 1.43-.27.81-.04 1.06-.05 3.12-.05Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.91h2.4V9.85c0-2.37 1.41-3.68 3.57-3.68 1.03 0 2.12.18 2.12.18v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.91h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0Z" />
        </svg>
      );
  }
}

export default function SocialLinks({
  className = "",
  variant = "footer",
}: SocialLinksProps) {
  const linkClass =
    variant === "footer"
      ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 transition hover:border-[#F28C28]/60 hover:bg-white/10 hover:text-white"
      : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#173A8A] transition hover:border-[#F28C28]/50 hover:text-[#0B1F4D]";

  return (
    <nav aria-label="Sociale media" className={className}>
      <ul className="flex flex-wrap items-center gap-2.5">
        {socialLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opent in nieuw tabblad)`}
              className={linkClass}
            >
              <SocialIcon network={link.id} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
