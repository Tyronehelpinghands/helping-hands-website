import type { Metadata } from "next";
import AboutApproach from "@/components/about/AboutApproach";
import AboutBentoGrid from "@/components/about/AboutBentoGrid";
import AboutCta from "@/components/about/AboutCta";
import AboutDifference from "@/components/about/AboutDifference";
import AboutFaq from "@/components/about/AboutFaq";
import AboutForClients from "@/components/about/AboutForClients";
import AboutForEmployees from "@/components/about/AboutForEmployees";
import AboutGrowthPath from "@/components/about/AboutGrowthPath";
import AboutHero from "@/components/about/AboutHero";
import AboutValues from "@/components/about/AboutValues";
import FounderStory from "@/components/about/FounderStory";
import TeamSection from "@/components/opdrachtgevers/TeamSection";
import OverOnsTimeline from "@/components/over-ons/OverOnsTimeline";
import RevealOnScroll from "@/components/RevealOnScroll";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import GoogleBusinessCta from "@/components/seo/GoogleBusinessCta";
import JsonLd from "@/components/seo/JsonLd";
import { aboutFaqs } from "@/lib/aboutFaq";
import { aboutPageJsonLd, buildPageMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Over ons | Event staffing & crewbedrijf",
  description:
    "Helping Hands Agency is een event staffing- en crewbedrijf in Hilversum — geen zorg of thuiszorg. Opgericht in 2022 door Tyrone van der Schagt voor events, horeca en productie.",
  path: "/over-ons",
});

const pageAnchors = [
  { href: "#missie", label: "Missie" },
  { href: "#verhaal", label: "Verhaal" },
  { href: "#team", label: "Team" },
  { href: "#aanpak", label: "Aanpak" },
  { href: "#opdrachtgevers", label: "Opdrachtgevers" },
  { href: "#groei", label: "Groei" },
  { href: "#faq", label: "FAQ" },
] as const;

export default function OverOnsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Over ons", path: "/over-ons" },
        ]}
      />
      <JsonLd
        data={[
          faqJsonLd(aboutFaqs),
          aboutPageJsonLd({
            path: "/over-ons",
            name: "Over Helping Hands Agency",
            description:
              "Helping Hands Agency is in 2022 opgericht door Tyrone van der Schagt: een crewbedrijf met een maatschappelijke missie voor medewerkers en professionele uitvoering voor opdrachtgevers.",
          }),
        ]}
      />

      <AboutHero />

      <section className="border-b border-slate-200/80 bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
              Wat wij doen
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0B1F4D] sm:text-3xl">
              Event staffing &amp; crew voor de live branche
            </h2>
            <p className="mt-4 text-base leading-8 text-[#101828]/75">
              Helping Hands Agency levert event crew, stagehands, horecapersoneel
              en productiesupport voor festivals, stadions, beurzen, concerten,
              catering en horecalocaties. Wij zijn gevestigd in Hilversum en
              actief door heel Nederland — met duidelijke briefing, één
              aanspreekpunt en tarief op aanvraag.
            </p>
            <p className="mt-4 text-base leading-8 text-[#101828]/75">
              Let op: wij zijn geen zorg-, thuiszorg- of Wmo-organisatie. Andere
              merken met de naam &ldquo;Helping Hands&rdquo; in de zorgbranche
              horen niet bij Helping Hands Agency.
            </p>
          </div>
        </div>
      </section>

      <nav
        aria-label="Op deze pagina"
        className="border-b border-slate-200/80 bg-white"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {pageAnchors.map((anchor) => (
            <a
              key={anchor.href}
              href={anchor.href}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-slate-200 bg-[#F5F7FA] px-4 text-sm font-bold text-[#173A8A] transition hover:border-[#F28C28]/50"
            >
              {anchor.label}
            </a>
          ))}
        </div>
      </nav>

      <div id="missie" className="scroll-mt-28">
        <AboutValues />
      </div>

      <FounderStory />

      <div id="team" className="scroll-mt-28">
        <TeamSection
          eyebrow="Ons team"
          title="De mensen achter Helping Hands"
          description="Een klein, vast team van eigenaren, H&R en planning — met korte lijnen en persoonlijk contact."
          showNotes={false}
        />
      </div>

      <AboutBentoGrid />

      <AboutDifference />

      <AboutForEmployees />

      <AboutForClients />

      <div id="tijdlijn" className="scroll-mt-28">
        <OverOnsTimeline />
      </div>

      <section id="aanpak" className="scroll-mt-28 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RevealOnScroll>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F28C28]">
                Onze aanpak
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B1F4D] sm:text-4xl">
                Van intake tot op locatie
              </h2>
              <p className="mt-4 text-base leading-8 text-[#101828]/70 sm:text-lg">
                Voor medewerkers en opdrachtgevers werken we met dezelfde
                heldere structuur — bekijk hieronder hoe het proces per
                doelgroep verloopt.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delayMs={100} variant="scale" className="mt-12">
            <AboutApproach />
          </RevealOnScroll>
        </div>
      </section>

      <AboutGrowthPath />

      <AboutFaq />

      <AboutCta />

      <GoogleBusinessCta />
    </>
  );
}
