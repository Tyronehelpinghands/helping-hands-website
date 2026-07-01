import type { Metadata } from "next";
import ContactTabs from "@/components/ContactTabs";
import PageHero from "@/components/PageHero";
import { contactEmail } from "@/lib/navigation";

export const metadata: Metadata = {
  title: "Contact | Helping Hands Agency",
  description:
    "Neem contact op voor personeelsaanvragen of aanmeldingen als crewlid.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Neem contact op met Helping Hands Agency."
        description="Voor personeelsaanvragen, aanmeldingen als crewlid of vragen over samenwerking."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <ContactTabs />

        <div className="mt-10 rounded-2xl bg-[#0B1F4D] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-black">Direct contact</h2>
          <p className="mt-4 text-white/85">
            E-mail:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="font-semibold text-[#F28C28] underline-offset-4 hover:underline"
            >
              {contactEmail}
            </a>
          </p>
          <p className="mt-4 max-w-2xl leading-8 text-white/75">
            Vermeld in je bericht de relevante gegevens uit de lijst hierboven. Zo kunnen we je
            snel en gericht helpen.
          </p>
        </div>
      </section>
    </>
  );
}
