import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import {
  AV_PDF_PATH,
  AV_VERSION_YEAR,
  avArticles,
  avCompanyIntro,
  type AvClause,
} from "@/lib/algemeneVoorwaardenContent";
import { buildPageMetadata } from "@/lib/seo";
import { formatAddressSingleLine, siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: "Algemene voorwaarden",
  description:
    "Algemene voorwaarden Helping Hands Agency 2026: toepasselijkheid, inzet van personeel, tarieven, urenregistratie, annulering, betaling, aansprakelijkheid en overige afspraken voor opdrachtgevers.",
  path: "/algemene-voorwaarden",
});

function ClauseList({ clauses }: { clauses: AvClause[] }) {
  return (
    <ol className="mt-4 space-y-4">
      {clauses.map((clause) => (
        <li key={clause.ref} className="text-base leading-7 text-[#101828]/85">
          <p>
            <span className="font-semibold text-[#0B1F4D]">{clause.ref}</span>{" "}
            {clause.text}
          </p>
          {clause.items ? (
            <ol className="mt-2 list-[lower-alpha] space-y-1 pl-6 marker:font-semibold marker:text-[#0B1F4D]">
              {clause.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Algemene voorwaarden", path: "/algemene-voorwaarden" },
        ]}
      />

      <section className="border-b border-slate-200/80 bg-[#0B1F4D] text-white">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-14 lg:pt-36">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Juridisch · versie {AV_VERSION_YEAR}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Algemene voorwaarden
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            Deze voorwaarden gelden voor alle opdrachten, offertes,
            opdrachtbevestigingen en diensten van {siteConfig.name} aan
            opdrachtgevers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={AV_PDF_PATH}
              download
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#F28C28] px-5 text-sm font-bold text-white transition hover:bg-[#e07d1c]"
            >
              Download PDF
            </a>
            <a
              href="#inhoudsopgave"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Inhoudsopgave
            </a>
          </div>
        </div>
      </section>

      <div className="bg-[#F5F7FA]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <section
            aria-labelledby="bedrijfsgegevens-heading"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8"
          >
            <h2
              id="bedrijfsgegevens-heading"
              className="text-xl font-black text-[#0B1F4D]"
            >
              {avCompanyIntro.title}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm leading-6 text-[#101828]/80 sm:grid-cols-2">
              <div>
                <dt className="font-bold text-[#0B1F4D]">Bedrijf</dt>
                <dd>{siteConfig.name}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#0B1F4D]">Eigenaar</dt>
                <dd>{avCompanyIntro.owner}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#0B1F4D]">KvK</dt>
                <dd>{avCompanyIntro.kvk}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#0B1F4D]">Locatie</dt>
                <dd>
                  {avCompanyIntro.location} — {formatAddressSingleLine()}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#0B1F4D]">E-mail</dt>
                <dd>
                  <a
                    href={`mailto:${avCompanyIntro.email}`}
                    className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    {avCompanyIntro.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-[#0B1F4D]">Website</dt>
                <dd>{avCompanyIntro.website}</dd>
              </div>
            </dl>
            <p className="mt-5 text-sm leading-7 text-[#101828]/80">
              <span className="font-bold text-[#0B1F4D]">Branche: </span>
              {avCompanyIntro.branche}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#101828]/80">
              {avCompanyIntro.description}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#101828]/80">
              {avCompanyIntro.workforce}
            </p>
            <p className="mt-5 border-t border-slate-200/80 pt-5 text-sm leading-7 text-[#101828]/80">
              <span className="font-bold text-[#0B1F4D]">
                Toepasselijkheid:{" "}
              </span>
              {avCompanyIntro.applicability}
            </p>
          </section>

          <nav
            id="inhoudsopgave"
            aria-label="Inhoudsopgave"
            className="mt-10 scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-black text-[#0B1F4D]">
              Inhoudsopgave
            </h2>
            <ol className="mt-4 columns-1 gap-x-8 space-y-2 text-sm sm:columns-2">
              {avArticles.map((article) => (
                <li key={article.id} className="break-inside-avoid">
                  <a
                    href={`#${article.id}`}
                    className="text-[#173A8A] underline-offset-4 hover:underline"
                  >
                    Artikel {article.number} — {article.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-8">
            {avArticles.map((article) => (
              <article
                key={article.id}
                id={article.id}
                className="scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8"
              >
                <h2 className="text-xl font-black tracking-tight text-[#0B1F4D] sm:text-2xl">
                  Artikel {article.number} — {article.title}
                </h2>
                {article.lead ? (
                  <p className="mt-3 text-sm font-medium leading-7 text-[#101828]/70">
                    {article.lead}
                  </p>
                ) : null}
                {article.clauses ? (
                  <ClauseList clauses={article.clauses} />
                ) : null}
                {article.subsections?.map((subsection) => (
                  <div key={subsection.title} className="mt-6">
                    <h3 className="text-base font-black text-[#0B1F4D]">
                      {subsection.title}
                    </h3>
                    <ClauseList clauses={subsection.clauses} />
                  </div>
                ))}
              </article>
            ))}
          </div>

          <section className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-black text-[#0B1F4D]">
              Documentgegevens
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#101828]/80">
              Versie {AV_VERSION_YEAR}. © {AV_VERSION_YEAR} {siteConfig.name}.
              Alle rechten voorbehouden. Niets uit dit document mag zonder
              schriftelijke toestemming worden verveelvoudigd of openbaar
              gemaakt.
            </p>
            <p className="mt-4 text-sm leading-7 text-[#101828]/70">
              Vragen over deze voorwaarden?{" "}
              <Link
                href="/contact"
                className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
              >
                Neem contact op
              </Link>{" "}
              of{" "}
              <a
                href={AV_PDF_PATH}
                download
                className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
              >
                download de PDF
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
