import type { Metadata } from "next";
import Link from "next/link";
import ContactTabs from "@/components/ContactTabs";
import ContactChecklist from "@/components/contact/ContactChecklist";
import ContactProcess from "@/components/contact/ContactProcess";
import CrewPhotoGrid from "@/components/CrewPhotoGrid";
import PhotoBackgroundCard from "@/components/PhotoBackgroundCard";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import ReviewCta from "@/components/seo/ReviewCta";
import SocialLinks from "@/components/SocialLinks";
import {
  contactCrewPhoto,
  contactRequestPhoto,
  contactStrip,
} from "@/lib/crewPhotos";
import { contactFaqs } from "@/lib/faq";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import {
  applicationsEmail,
  contactEmail,
  hrEmail,
  plannerEmail,
  planningEmail,
} from "@/lib/navigation";
import {
  buildPageMetadata,
  contactPointsJsonLd,
  faqJsonLd,
} from "@/lib/seo";
import {
  formatAddressSingleLine,
  siteConfig,
} from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact | Personeel aanvragen of crew melden",
  description:
    "Vraag crew of personeel aan voor events, horeca, stagebouw, productie, logistiek en hospitality. Neem contact op met Helping Hands Agency of meld je aan als medewerker.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <JsonLd data={[faqJsonLd(contactFaqs), contactPointsJsonLd()]} />
      <PageHero content={getPageHeroContent("/contact")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Personeel aanvragen of crew aanmelden
          </h2>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Voor opdrachtgevers: deel je planning zo compleet mogelijk. Voor
            crew: meld je aan met ervaring en beschikbaarheid, of bekijk eerst
            de{" "}
            <Link
              href="/vacatures"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              vacatures
            </Link>{" "}
            en{" "}
            <Link
              href="/werken-bij"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              werken bij
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.75fr)] lg:items-start">
          <ContactTabs />
          <div className="lg:sticky lg:top-28">
            <ContactChecklist />
          </div>
        </div>

        <ContactProcess />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <PhotoBackgroundCard photo={contactRequestPhoto} className="min-h-[14rem]">
            <div className="p-8 text-white">
              <h2 className="text-xl font-black">Personeelsaanvragen</h2>
              <p className="mt-4 text-sm text-white/80">
                Crew voor events, horeca en productie — ook spoed
              </p>
              <a
                href={`mailto:${planningEmail}`}
                className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {planningEmail}
              </a>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white/55">
                Planning (Mesbah)
              </p>
              <a
                href={`mailto:${plannerEmail}`}
                className="mt-1 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {plannerEmail}
              </a>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="mt-2 block font-semibold text-white underline-offset-4 hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                WhatsApp
              </a>
              <Link
                href="/diensten"
                className="mt-4 inline-flex text-sm font-bold text-white underline-offset-4 hover:underline"
              >
                Bekijk diensten →
              </Link>
            </div>
          </PhotoBackgroundCard>

          <PhotoBackgroundCard
            photo={contactCrewPhoto}
            className="min-h-[14rem]"
            overlayClassName="bg-[#173A8A]/80"
          >
            <div className="p-8 text-white">
              <h2 className="text-xl font-black">Crew aanmelden</h2>
              <p className="mt-4 text-sm text-white/80">
                Aanmeldingen &amp; sollicitaties
              </p>
              <a
                href={`mailto:${applicationsEmail}`}
                className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {applicationsEmail}
              </a>
              <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white/55">
                H&R (Marieke)
              </p>
              <a
                href={`mailto:${hrEmail}`}
                className="mt-1 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {hrEmail}
              </a>
              <Link
                href="/vacatures"
                className="mt-4 inline-flex text-sm font-bold text-white underline-offset-4 hover:underline"
              >
                Bekijk vacatures →
              </Link>
            </div>
          </PhotoBackgroundCard>

          <div className="flex min-h-[14rem] flex-col justify-end rounded-2xl border border-slate-200/80 bg-[#0B1F4D] p-8 text-white shadow-xl">
            <h2 className="text-xl font-black">Algemene vragen</h2>
            <p className="mt-4 text-sm text-white/80">
              Samenwerking, overige vragen of doorverwijzing
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
            <Link
              href="/opdrachtgevers"
              className="mt-4 inline-flex text-sm font-bold text-white underline-offset-4 hover:underline"
            >
              Voor opdrachtgevers →
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-[#F5F7FA] p-6 sm:p-8">
          <h2 className="text-xl font-black text-[#0B1F4D]">
            Bedrijfsgegevens
          </h2>
          <dl className="mt-5 grid gap-4 text-sm leading-6 text-[#101828]/80 sm:grid-cols-2">
            <div>
              <dt className="font-bold text-[#0B1F4D]">Bedrijf</dt>
              <dd>{siteConfig.name}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#0B1F4D]">Adres</dt>
              <dd>{formatAddressSingleLine()}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#0B1F4D]">Telefoon</dt>
              <dd>
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {siteConfig.phoneDisplay}
                </a>
                <span className="text-[#101828]/55"> (mobiel)</span>
                <br />
                <a
                  href={`tel:${siteConfig.phoneLandlineTel}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {siteConfig.phoneLandlineDisplay}
                </a>
                <span className="text-[#101828]/55"> (vast)</span>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[#0B1F4D]">E-mail</dt>
              <dd>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
                <span className="text-[#101828]/55"> (algemeen)</span>
                <br />
                <a
                  href={`mailto:${planningEmail}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {planningEmail}
                </a>
                <span className="text-[#101828]/55"> (personeelsaanvragen)</span>
                <br />
                <a
                  href={`mailto:${applicationsEmail}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {applicationsEmail}
                </a>
                <span className="text-[#101828]/55"> (aanmeldingen)</span>
              </dd>
            </div>
            <div>
              <dt className="font-bold text-[#0B1F4D]">KvK</dt>
              <dd>{siteConfig.kvk}</dd>
            </div>
            <div>
              <dt className="font-bold text-[#0B1F4D]">BTW</dt>
              <dd>{siteConfig.vat}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-bold text-[#0B1F4D]">Social media</dt>
              <dd className="mt-2">
                <SocialLinks variant="light" />
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
            Op locatie
          </p>
          <h2 className="mt-3 text-2xl font-black text-[#0B1F4D]">
            Van aanvraag tot crew op de vloer
          </h2>
          <div className="mt-6">
            <CrewPhotoGrid
              photos={contactStrip}
              columns={4}
              aspectClassName="aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      <FaqSection
        items={contactFaqs}
        title="Vragen over aanvragen en aanmelden"
        description="Spoed, briefinggegevens, privacy en waar je het beste naartoe mailt."
        className="bg-white py-20 sm:py-28"
      />

      <section className="bg-[#0B1F4D] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Klaar om crew of personeel aan te vragen?
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              Vul het formulier in of mail direct naar planning. Voor werken bij
              Helping Hands Agency: aanmeldingen of vacatures.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact#aanvraag"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#F28C28] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#de7c1f]"
            >
              Personeel aanvragen
            </Link>
            <Link
              href="/vacatures"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-white/35 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Vacatures
            </Link>
          </div>
        </div>
      </section>

      <ReviewCta />
    </>
  );
}
