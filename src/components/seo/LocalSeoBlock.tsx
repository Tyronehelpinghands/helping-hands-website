import Link from "next/link";
import { formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";

type LocalSeoBlockProps = {
  city?: string;
  serviceLabel?: string;
};

export default function LocalSeoBlock({
  city,
  serviceLabel,
}: LocalSeoBlockProps) {
  const regionLine = city
    ? `Actief in regio ${city}. Gevestigd in Hilversum, leveren we personeel door heel Nederland.`
    : "Gevestigd in Hilversum, actief door heel Nederland.";

  return (
    <section className="border-y border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-[#0B1F4D]">
          {serviceLabel && city
            ? `${serviceLabel} in ${city}`
            : "Lokaal bereikbaar, landelijk inzetbaar"}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[#101828]/75">
          {regionLine} Geen nepvestigingen — wel betrouwbare inzet op locatie met
          één aanspreekpunt bij planning.
        </p>
        <dl className="mt-6 grid gap-3 text-sm text-[#0B1F4D] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="font-bold">Bedrijf</dt>
            <dd className="mt-1 text-[#101828]/75">{siteConfig.name}</dd>
          </div>
          <div>
            <dt className="font-bold">Adres</dt>
            <dd className="mt-1 text-[#101828]/75">
              {formatAddressSingleLine()}
            </dd>
          </div>
          <div>
            <dt className="font-bold">Telefoon</dt>
            <dd className="mt-1">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-bold">Planning</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${siteConfig.planningEmail}`}
                className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
              >
                {siteConfig.planningEmail}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-sm">
          <Link
            href="/locaties"
            className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
          >
            Bekijk alle locatiepagina&apos;s
          </Link>
        </p>
      </div>
    </section>
  );
}
