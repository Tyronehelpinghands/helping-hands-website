import type { Metadata } from "next";
import ContactTabs from "@/components/ContactTabs";
import CrewPhotoGrid from "@/components/CrewPhotoGrid";
import PhotoBackgroundCard from "@/components/PhotoBackgroundCard";
import PageHero from "@/components/sections/PageHero";
import {
  contactCrewPhoto,
  contactRequestPhoto,
  contactStrip,
} from "@/lib/crewPhotos";
import { getPageHeroContent } from "@/lib/pageHeroContent";
import { applicationsEmail, contactEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Contact | Helping Hands Agency",
  description:
    "Neem contact op voor personeelsaanvragen of aanmeldingen als crewlid.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero content={getPageHeroContent("/contact")} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ContactTabs />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <PhotoBackgroundCard photo={contactRequestPhoto} className="min-h-[14rem]">
            <div className="p-8 text-white">
              <h2 className="text-xl font-black">Personeelsaanvragen</h2>
              <p className="mt-4 text-sm text-white/80">
                Algemene vragen &amp; personeelsaanvragen
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
              >
                {contactEmail}
              </a>
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
    </>
  );
}
