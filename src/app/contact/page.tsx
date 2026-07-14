import type { Metadata } from "next";
import ContactTabs from "@/components/ContactTabs";
import PageHero from "@/components/sections/PageHero";
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
          <div className="rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
            <h2 className="text-xl font-black">Personeelsaanvragen</h2>
            <p className="mt-4 text-sm text-white/70">
              Algemene vragen &amp; personeelsaanvragen
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
          </div>
          <div className="rounded-2xl bg-[#173A8A] p-8 text-white shadow-xl">
            <h2 className="text-xl font-black">Crew aanmelden</h2>
            <p className="mt-4 text-sm text-white/70">
              Aanmeldingen &amp; sollicitaties
            </p>
            <a
              href={`mailto:${applicationsEmail}`}
              className="mt-2 block font-semibold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {applicationsEmail}
            </a>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Voor werken bij Helping Hands mail je naar{" "}
              {applicationsEmail}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
