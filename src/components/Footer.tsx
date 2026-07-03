import Image from "next/image";
import Link from "next/link";
import { brandAlt, brandImages } from "@/lib/brand";
import {
  applicationsEmail,
  contactEmail,
  navLinks,
} from "@/lib/navigation";

const serviceLinks = [
  { href: "/diensten", label: "Event crew" },
  { href: "/diensten", label: "Stagehands" },
  { href: "/diensten", label: "Horeca support" },
  { href: "/diensten", label: "Productie assistentie" },
  { href: "/diensten", label: "Logistiek" },
  { href: "/diensten", label: "Teamcaptains" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0B1F4D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex">
              <Image
                src={brandImages.logoWhite}
                alt={brandAlt}
                width={640}
                height={272}
                sizes="(max-width: 640px) 180px, 220px"
                className="h-auto w-[180px] max-w-full object-contain object-left sm:w-[200px]"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              Crew voor evenementen, horeca, stagebouw, productie en logistiek.
              Snel inzetbaar op locatie.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Navigatie
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Diensten
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                  Algemene vragen &amp; personeelsaanvragen
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="mt-1 block transition hover:text-white"
                >
                  {contactEmail}
                </a>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                  Crew aanmelden &amp; sollicitaties
                </p>
                <a
                  href={`mailto:${applicationsEmail}`}
                  className="mt-1 block transition hover:text-white"
                >
                  {applicationsEmail}
                </a>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Personeel aanvragen
                </Link>
              </li>
              <li>
                <Link href="/vacatures" className="transition hover:text-white">
                  Vacatures
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${applicationsEmail}`}
                  className="transition hover:text-white"
                >
                  Aanmelden als medewerker
                </a>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/login?type=intern"
                  className="transition hover:text-white"
                >
                  Intern portaal
                </Link>
              </li>
              <li>
                <Link
                  href="/login?type=medewerker"
                  className="transition hover:text-white"
                >
                  Medewerkersportaal
                </Link>
              </li>
              <li>
                <Link
                  href="/login?type=opdrachtgever"
                  className="transition hover:text-white"
                >
                  Opdrachtgeversportaal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Helping Hands Agency</p>
          <p>Event staffing &amp; crew voor de live branche</p>
        </div>
      </div>
    </footer>
  );
}
