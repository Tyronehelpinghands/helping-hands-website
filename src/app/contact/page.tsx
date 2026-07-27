import type { Metadata } from "next";
import Link from "next/link";
import ContactTabs from "@/components/ContactTabs";
import CrewPhotoGrid from "@/components/CrewPhotoGrid";
import PhotoBackgroundCard from "@/components/PhotoBackgroundCard";
import FaqSection from "@/components/sections/FaqSection";
import PageHero from "@/components/sections/PageHero";
import TrustBar from "@/components/sections/TrustBar";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import JsonLd from "@/components/seo/JsonLd";
import {
  contactCrewPhoto,
  contactRequestPhoto,
  contactStrip,
} from "@/lib/crewPhotos";
import { contactFaqs } from "@/lib/faq";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { applicationsEmail, contactEmail } from "@/lib/navigation";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import {
  formatAddressSingleLine,
  siteConfig,
} from "@/lib/siteConfig";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Personeel aanvragen of crew aanmelden bij Helping Hands Agency. Deel datum, locatie, functies, tijden, kleding/PBM en briefing — ook voor spoedaanvragen.",
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
      <JsonLd data={faqJsonLd(contactFaqs)} />
      <PageHero content={getPageHeroContent("/contact")} />
      <TrustBar />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-black text-[#0B1F4D] sm:text-3xl">
            Personeel aanvragen of crew aanmelden
          </h2>
          <p className="mt-4 text-base leading-8 text-[#101828]/75">
            Voor opdrachtgevers: deel je planning zo compleet mogelijk. Voor crew:
            meld je aan met ervaring en beschikbaarheid, of bekijk eerst de{" "}
            <Link
              href="/vacatures"
              className="font-bold text-[#173A8A] underline-offset-4 hover:underline"
            >
              vacatures
            </Link>
            .
          </p>
        </div>

        <ContactTabs />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PhotoBackgroundCard photo={contactRequestPhoto} className="min-h-[14rem]">
            <div className="p-8 text-white">
              <h2 className="text-xl font-black">Personeelsaanvragen</h2>
              <p className="mt-4 text-sm text-white/80">
                Algemene vragen &amp; personeelsaanvragen — ook spoed
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="mt-2 block font-semibold text-white underline-offset-4 hover:underline"
              >
                {siteConfig.phoneDisplay}
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
              <p className="mt-4 text-sm leading-6 text-white/80">
                Voor werken bij Helping Hands mail je naar {applicationsEmail}.
              </p>
            </div>
          </PhotoBackgroundCard>
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
                <br />
                <a
                  href={`mailto:${siteConfig.ownerEmail}`}
                  className="font-semibold text-[#173A8A] underline-offset-4 hover:underline"
                >
                  {siteConfig.ownerEmail}
                </a>
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
              <dt className="font-bold text-[#0B1F4D]">IBAN</dt>
              <dd>{siteConfig.iban}</dd>
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
            <CrewPhotoGrid photos={contactStrip} columns={4} aspectClassName="aspect-[4/5]" />
          </div>
        </div>
      </section>

      <FaqSection
        items={contactFaqs}
        title="Vragen over aanvragen en aanmelden"
        description="Spoed, briefinggegevens en waar je het beste naartoe mailt."
        className="bg-white py-20 sm:py-28"
      />
    </>
  );
}
