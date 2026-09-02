import Image from "next/image";
import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { brandAlt, brandImages } from "@/lib/brand";
import {
  applicationsEmail,
  coOwnerEmail,
  contactEmail,
  contactPhoneDisplay,
  contactPhoneLandlineDisplay,
  contactPhoneLandlineTel,
  contactPhoneTel,
  hrEmail,
  planningEmail,
} from "@/lib/navigation";
import { crewApplyHref } from "@/lib/contact";
import { formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";

/** Curated footer nav — descriptive anchors for pages we want as Google sitelinks. */
const primaryNavLinks = [
  { href: "/personeel-inhuren", label: "Personeel inhuren" },
  { href: "/werken-bij", label: "Werken bij" },
  { href: "/vacatures", label: "Vacatures" },
  { href: "/opdrachtgevers", label: "Opdrachtgevers" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/contact", label: "Contact" },
  { href: "/diensten", label: "Diensten" },
  { href: "/projecten", label: "Projecten" },
  { href: "/locaties", label: "Locaties" },
];

const serviceLinks = [
  { href: "/personeel-inhuren", label: "Personeel inhuren" },
  { href: "/personeel-inhuren/event-crew", label: "Event crew" },
  { href: "/personeel-inhuren/stagehands", label: "Stagehands" },
  { href: "/personeel-inhuren/horeca-personeel", label: "Horeca support" },
  { href: "/diensten/restaurant-personeel", label: "Restaurant personeel" },
  { href: "/personeel-inhuren/keukenhulp", label: "Keukenhulp" },
  { href: "/personeel-inhuren/barpersoneel", label: "Barpersoneel" },
  {
    href: "/personeel-inhuren/productie-assistenten",
    label: "Productie-assistenten",
  },
  { href: "/personeel-inhuren/logistiek-personeel", label: "Logistiek" },
  { href: "/personeel-inhuren/hospitality-personeel", label: "Hospitality" },
  { href: "/diensten", label: "Alle diensten" },
];

const locationLinks = [
  { href: "/locaties/hilversum", label: "Hilversum (vestiging)" },
  { href: "/event-crew-amsterdam", label: "Amsterdam" },
  { href: "/event-crew-utrecht", label: "Utrecht" },
  { href: "/horeca-personeel-hilversum", label: "Horeca Hilversum" },
  { href: "/event-crew-rotterdam", label: "Rotterdam" },
  { href: "/event-crew-den-haag", label: "Den Haag" },
  { href: "/festival-crew-randstad", label: "Randstad festivals" },
  { href: "/locaties", label: "Alle locaties" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0B1F4D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
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
              Helping Hands Agency is een event staffing- en crewbedrijf in
              Hilversum voor evenementen, horeca, stagebouw, productie en
              logistiek — geen zorg- of thuiszorgorganisatie.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/55">
              {formatAddressSingleLine()}
              <br />
              <a
                href={`tel:${contactPhoneTel}`}
                className="transition hover:text-white"
              >
                {contactPhoneDisplay}
              </a>
              <br />
              <a
                href={`tel:${contactPhoneLandlineTel}`}
                className="transition hover:text-white"
              >
                Vast {contactPhoneLandlineDisplay}
              </a>
            </p>
            <SocialLinks className="mt-5" variant="footer" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#F28C28]">
              Navigatie
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {primaryNavLinks.map((link) => (
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
              Locaties
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {locationLinks.map((link) => (
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
              Contact
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                  Algemene vragen
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
                  Personeelsaanvragen
                </p>
                <a
                  href={`mailto:${planningEmail}`}
                  className="mt-1 block transition hover:text-white"
                >
                  {planningEmail}
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
                <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                  H&R (Marieke)
                </p>
                <a
                  href={`mailto:${hrEmail}`}
                  className="mt-1 block transition hover:text-white"
                >
                  {hrEmail}
                </a>
              </li>
              <li>
                <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                  Mede-eigenaar (Sieb)
                </p>
                <a
                  href={`mailto:${coOwnerEmail}`}
                  className="mt-1 block transition hover:text-white"
                >
                  {coOwnerEmail}
                </a>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/personeel-inhuren"
                  className="transition hover:text-white"
                >
                  Personeel inhuren
                </Link>
              </li>
              <li>
                <Link href="/werken-bij" className="transition hover:text-white">
                  Werken bij
                </Link>
              </li>
              <li>
                <Link href="/vacatures" className="transition hover:text-white">
                  Vacatures
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="transition hover:text-white">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href={crewApplyHref} className="transition hover:text-white">
                  Aanmelden als medewerker
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

        <div className="mt-12 space-y-3 border-t border-white/10 pt-6 text-xs leading-5 text-white/45">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; 2026 {siteConfig.name}</p>
            <p>
              Event staffing &amp; crew — evenementen, horeca, stagebouw &amp;
              productie
            </p>
          </div>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            <Link
              href="/algemene-voorwaarden"
              className="transition hover:text-white"
            >
              Algemene voorwaarden
            </Link>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </p>
          <p>
            {siteConfig.name} · {formatAddressSingleLine()} · KvK{" "}
            {siteConfig.kvk} · BTW {siteConfig.vat}
          </p>
        </div>
      </div>
    </footer>
  );
}
