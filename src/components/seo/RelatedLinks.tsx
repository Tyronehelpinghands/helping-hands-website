import Link from "next/link";
import type { SeoRelatedLink } from "@/lib/seo/types";

type RelatedLinksProps = {
  title?: string;
  links: SeoRelatedLink[];
};

export default function RelatedLinks({
  title = "Ook interessant",
  links,
}: RelatedLinksProps) {
  if (links.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-black text-[#0B1F4D]">{title}</h2>
      <ul className="mt-6 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
